import React from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '', confirmPassword: '', fullName: '' });
  const [error, setError] = React.useState('');
  const [ok, setOk] = React.useState(false);

  const submit = async () => {
    setError(''); setOk(false);
    if (form.password !== form.confirmPassword) { setError('Mật khẩu không khớp'); return; }
    const res = await register(form);
    if (res.ok) { setOk(true); setTimeout(()=>nav('/login'), 800); }
    else setError(typeof res.error === 'string' ? res.error : JSON.stringify(res.error));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>Đăng ký</Typography>
          <Stack spacing={2}>
            <TextField label="Họ tên" value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})} />
            <TextField label="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
            <TextField label="Mật khẩu" type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
            <TextField label="Xác nhận mật khẩu" type="password" value={form.confirmPassword} onChange={(e)=>setForm({...form, confirmPassword: e.target.value})} />
            {error && <Typography color="error">{error}</Typography>}
            {ok && <Typography color="primary">Đăng ký thành công! Điều hướng tới đăng nhập…</Typography>}
            <Button variant="contained" onClick={submit}>Tạo tài khoản</Button>
            <Button component={Link} to="/login">Quay về đăng nhập</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}