import React from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Stack, Alert } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = React.useState({
    email: searchParams.get('email') || '',
    otp: '', // Changed from token to otp
    newPassword: '', // Changed from password to newPassword
    confirmPassword: ''
  });
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email không được để trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email không hợp lệ';
    if (!form.otp.trim()) errors.otp = 'OTP không được để trống';
    if (!form.newPassword) errors.newPassword = 'Mật khẩu không được để trống';

    // Enhanced password validation
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) errors.newPassword = passwordError;

    if (form.newPassword !== form.confirmPassword) errors.confirmPassword = 'Mật khẩu không khớp';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (!hasUpperCase) {
      return 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa';
    }
    if (!hasLowerCase) {
      return 'Mật khẩu phải chứa ít nhất một chữ cái viết thường';
    }
    if (!hasNumbers) {
      return 'Mật khẩu phải chứa ít nhất một số';
    }
    if (!hasSpecialChar) {
      return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt';
    }
    return null;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await authApi.resetPassword(form);
      setMessage('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card><CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Đặt lại mật khẩu</Typography>
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
            label="OTP xác thực"
            value={form.otp}
            onChange={(e) => {
              setForm({ ...form, otp: e.target.value });
              if (validationErrors.otp) setValidationErrors({ ...validationErrors, otp: '' });
            }}
            error={!!validationErrors.otp}
            helperText={validationErrors.otp}
            placeholder="Nhập mã OTP 6 số từ email"
            required
          />
          <TextField
            type="password"
            label="Mật khẩu mới"
            value={form.newPassword}
            onChange={(e) => {
              setForm({ ...form, newPassword: e.target.value });
              if (validationErrors.newPassword) setValidationErrors({ ...validationErrors, newPassword: '' });
            }}
            error={!!validationErrors.newPassword}
            helperText={validationErrors.newPassword}
            required
          />
          <TextField
            type="password"
            label="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
              if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: '' });
            }}
            error={!!validationErrors.confirmPassword}
            helperText={validationErrors.confirmPassword}
            required
          />
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            variant="contained"
            onClick={submit}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="text"
            fullWidth
          >
            Quay về đăng nhập
          </Button>
        </Stack>
      </CardContent></Card>
    </Container>
  );
}