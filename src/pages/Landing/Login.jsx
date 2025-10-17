import React from 'react';
import {
  Container, Card, CardContent, Typography,
  TextField, Button, Stack, Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loginPath] = React.useState(localStorage.getItem('loginPath') || '/api/Auth/login');

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      // Gửi dữ liệu với nhiều key để backend .NET nào cũng đọc được
      const payload = {
        email: form.email,
        password: form.password,
        userName: form.email,
        username: form.email,
        userNameOrEmail: form.email,
      };

      const res = await axiosClient.post(loginPath, payload);
      const d = res?.data || {};

      // Đọc token ở các field phổ biến
      const token =
  d.token ||
  d.accessToken ||
  d.jwt ||
  d.data?.token ||
  d.data?.accessToken || // 🔥 thêm dòng này
  d.result?.token;

      const role =
        d.role || d.user?.role || d.data?.role || d.result?.role || 'CoOwner';

      if (!token) {
        setError('Không nhận được token từ API. Kiểm tra lại payload hoặc response.');
        console.error('Login response:', d);
        return;
      }

      // Lưu token + role
      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', role);

      // Điều hướng theo role
      switch (role) {
        case 'Admin':
          nav('/dashboard/admin');
          break;
        case 'Staff':
          nav('/dashboard/staff');
          break;
        default:
          nav('/dashboard/coowner');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
        err.message ||
        'Lỗi không xác định khi đăng nhập';
      setError(msg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Đăng nhập</Typography>
          <Stack spacing={2}>
            <TextField
              label="Email hoặc Username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <Typography color="error" sx={{ whiteSpace: 'pre-wrap' }}>{error}</Typography>}
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
            <Stack direction="row" justifyContent="space-between">
              <MuiLink component={Link} to="/forgot-password">Quên mật khẩu?</MuiLink>
              <MuiLink component={Link} to="/register">Chưa có tài khoản?</MuiLink>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
