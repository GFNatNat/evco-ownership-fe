/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authApi } from '@/api/authApi';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [name, setName] = useState(''); const [err, setErr] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setLoading(true);
    try {
      await authApi.register({ email, password, name });
      router.replace('/verification');
    } catch (error:any) {
      setErr(error?.response?.data?.message || error.message);
    } finally { setLoading(false); }
  };

  return (
    <Box className="grid place-items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" gutterBottom>Đăng ký</Typography>
          {err && <Alert severity="error" className="mb-3">{err}</Alert>}
          <form onSubmit={submit} className="space-y-3">
            <TextField label="Họ tên" fullWidth value={name} onChange={e=>setName(e.target.value)} />
            <TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
            <TextField label="Mật khẩu" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
