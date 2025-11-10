/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/api/authApi';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res.data?.accessToken || res.data?.token;
      if (!token) throw new Error('Không nhận được access token');
      Cookies.set(process.env.NEXT_PUBLIC_AUTH_COOKIE ?? 'accessToken', token, { sameSite: 'lax' });
      router.replace(next);
    } catch (error: any) {
      setErr(error?.response?.data?.message || error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="grid place-items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" gutterBottom>Đăng nhập</Typography>
          {err && <Alert severity="error" className="mb-3">{err}</Alert>}
          <form onSubmit={onSubmit} className="space-y-3">
            <TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
            <TextField label="Mật khẩu" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
