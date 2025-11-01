import React from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Stack, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '', // Changed from phoneNumber to phone to match API
    dateOfBirth: '', // Added dateOfBirth field as per API
    address: '' // Added address field as per API
  });
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = 'Tên không được để trống';
    if (!form.lastName.trim()) errors.lastName = 'Họ không được để trống';
    if (!form.email.trim()) errors.email = 'Email không được để trống';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email không hợp lệ';
    if (!form.password) errors.password = 'Mật khẩu không được để trống';
    if (form.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Mật khẩu không khớp';
    if (form.phone && !/^[0-9+\-\s()]{10,15}$/.test(form.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
      errors.dateOfBirth = 'Ngày sinh không hợp lệ';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await register(form);
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => nav('/login'), 2000);
      } else {
        setError(result.error || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Đăng ký</Typography>
          <Stack spacing={2}>
            <TextField
              label="Tên"
              value={form.firstName}
              onChange={(e) => {
                setForm({ ...form, firstName: e.target.value });
                if (validationErrors.firstName) setValidationErrors({ ...validationErrors, firstName: '' });
              }}
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
              required
            />
            <TextField
              label="Họ"
              value={form.lastName}
              onChange={(e) => {
                setForm({ ...form, lastName: e.target.value });
                if (validationErrors.lastName) setValidationErrors({ ...validationErrors, lastName: '' });
              }}
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
              required
            />
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
              label="Số điện thoại"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: '' });
              }}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
            <TextField
              label="Ngày sinh"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => {
                setForm({ ...form, dateOfBirth: e.target.value });
                if (validationErrors.dateOfBirth) setValidationErrors({ ...validationErrors, dateOfBirth: '' });
              }}
              error={!!validationErrors.dateOfBirth}
              helperText={validationErrors.dateOfBirth}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Địa chỉ"
              multiline
              rows={2}
              value={form.address}
              onChange={(e) => {
                setForm({ ...form, address: e.target.value });
              }}
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
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm({ ...form, confirmPassword: e.target.value });
                if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: '' });
              }}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              required
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Đăng ký thành công! Đang chuyển hướng...</Alert>}
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </Button>
            <Button component={Link} to="/login">Quay về đăng nhập</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}