/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { authApi } from '@/api/authApi';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setMsg(null); setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setMsg('Đã gửi email khôi phục mật khẩu.');
    } catch (error:any) {
      setErr(error?.response?.data?.message || error.message);
    } finally { setLoading(false); }
  };

  return (
    <Box className="grid place-items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" gutterBottom>Quên mật khẩu</Typography>
          {msg && <Alert severity="success" className="mb-3">{msg}</Alert>}
          {err && <Alert severity="error" className="mb-3">{err}</Alert>}
          <form onSubmit={submit} className="space-y-3">
            <TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
