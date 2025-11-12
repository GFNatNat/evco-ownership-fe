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
    // BE trả BaseResponse { statusCode, message, data: LoginResponse }
    // LoginResponse.AccessToken nằm ở res.data.data.accessToken (case-sensitive)
    const token =
      res?.data?.data?.accessToken ??
      res?.data?.data?.token ??
      res?.data?.accessToken ??
      res?.data?.token;

    if (!token) throw new Error('Không nhận được access token từ server');

    // lấy expires nếu BE trả về accessTokenExpiresAt để set cookie expiration
    const expiresAt = res?.data?.data?.accessTokenExpiresAt
      ? new Date(res.data.data.accessTokenExpiresAt)
      : undefined;

    // Lưu cookie với tên từ env (nếu có) hoặc fallback 'accessToken'
    const cookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE ?? 'accessToken';

    // set cookie: nếu expiresAt có thì dùng, thêm secure/path
    if (expiresAt) {
      Cookies.set(cookieName, token, {
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
      });
    } else {
      Cookies.set(cookieName, token, { sameSite: 'lax', path: '/' });
    }

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
