import React from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const { forgot } = useAuth();
  const [email, setEmail] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [error, setError] = React.useState('');

  const submit = async () => {
    setMsg(''); setError('');
    const res = await forgot({ email });
    if (res.ok) setMsg('Đã gửi hướng dẫn đặt lại mật khẩu vào email (nếu tồn tại).');
    else setError(typeof res.error === 'string' ? res.error : JSON.stringify(res.error));
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card><CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Quên mật khẩu</Typography>
        <Stack spacing={2}>
          <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          {msg && <Typography color="primary">{msg}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={submit}>Gửi</Button>
        </Stack>
      </CardContent></Card>
    </Container>
  );
}