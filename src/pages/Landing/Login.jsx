import React from 'react';
import {
  Container, Card, CardContent, Typography,
  TextField, Button, Stack, Link as MuiLink, Alert
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../api/authApi';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email không được để trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email không hợp lệ';
    if (!form.password) errors.password = 'Mật khẩu không được để trống';
    if (form.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setError('');
    setLoading(true);

    try {
      const result = await login(form);
      if (result.success) {
        // Navigation will be handled by AuthContext
        const role = localStorage.getItem('role') || 'CoOwner';
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
      } else {
        setError(result.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
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
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
              }}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              required
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (validationErrors.password) setValidationErrors({ ...validationErrors, password: '' });
              }}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              required
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading || !form.email || !form.password}
              fullWidth
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
