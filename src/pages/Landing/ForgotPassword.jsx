import React from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Stack, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email không được để trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
    return '';
  };

  const submit = async () => {
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage('Đã gửi hướng dẫn đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra hộp thư.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card><CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Quên mật khẩu</Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            error={!!emailError}
            helperText={emailError}
            required
            fullWidth
          />
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            variant="contained"
            onClick={submit}
            disabled={loading || !email}
            fullWidth
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
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