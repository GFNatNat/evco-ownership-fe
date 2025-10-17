import React from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function ResetPassword() {
  const { reset } = useAuth();
  const [form, setForm] = React.useState({ email: '', token: '', password: '', confirmPassword: '' });
  const [msg, setMsg] = React.useState('');
  const [error, setError] = React.useState('');

  const submit = async () => {
    setMsg(''); setError('');
    if (form.password !== form.confirmPassword) { setError('Mật khẩu không khớp'); return; }
    const res = await reset(form);
    if (res.ok) setMsg('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.');
    else setError(typeof res.error === 'string' ? res.error : JSON.stringify(res.error));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card><CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Đặt lại mật khẩu</Typography>
        <Stack spacing={2}>
          <TextField label="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
          <TextField label="Token" value={form.token} onChange={(e)=>setForm({...form, token: e.target.value})} />
          <TextField type="password" label="Mật khẩu mới" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
          <TextField type="password" label="Xác nhận mật khẩu" value={form.confirmPassword} onChange={(e)=>setForm({...form, confirmPassword: e.target.value})} />
          {msg && <Typography color="primary">{msg}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={submit}>Đổi mật khẩu</Button>
        </Stack>
      </CardContent></Card>
    </Container>
  );
}