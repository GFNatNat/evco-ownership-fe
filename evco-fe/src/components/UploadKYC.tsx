'use client';
import { useState } from 'react';
import { userApi } from '@/api/userApi';
import { Alert, Button, Stack } from '@mui/material';

export default function UploadKYC({ onDone }: { onDone?: () => void }) {
  const [idCard, setIdCard] = useState<File|null>(null);
  const [dl, setDl] = useState<File|null>(null);
  const [msg, setMsg] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);

  const submit = async () => {
    if(!idCard || !dl) { setErr('Vui lòng tải lên CMND/CCCD và GPLX'); return; }
    setErr(null); setMsg(null);
    try {
      await userApi.uploadKyc({ idCard, driverLicense: dl });
      setMsg('Đã gửi hồ sơ, vui lòng chờ xác minh từ nhân viên.');
      onDone?.();
    } catch (e:any) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  return (
    <Stack spacing={2}>
      {msg && <Alert severity="success">{msg}</Alert>}
      {err && <Alert severity="error">{err}</Alert>}
      <label className="block">
        <span className="text-sm">CMND/CCCD</span>
        <input type="file" accept="image/*,application/pdf" onChange={e=>setIdCard(e.target.files?.[0]||null)} />
      </label>
      <label className="block">
        <span className="text-sm">Giấy phép lái xe</span>
        <input type="file" accept="image/*,application/pdf" onChange={e=>setDl(e.target.files?.[0]||null)} />
      </label>
      <Button variant="contained" onClick={submit}>Gửi xác minh</Button>
    </Stack>
  );
}
