/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, startTransition, useState } from 'react';
import { adminApi } from '@/api/adminApi';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function AdminSettings(){
  const [settings,setSettings]=useState<any>({});
  const [msg,setMsg]=useState<string|null>(null);

  const load = useCallback(async()=>{
    const r = await adminApi.settings.get();
    startTransition(()=>setSettings(r.data||{}));
  },[]);
  useEffect(()=>{ let a=true; Promise.resolve().then(()=>{ if(a) load();}); return()=>{a=false}; },[load]);

  const save = async()=>{
    await adminApi.settings.update(settings);
    setMsg('Đã lưu cấu hình');
    setTimeout(()=>setMsg(null), 3000);
  };

  return (
    <Box className="p-6 max-w-2xl">
      <Typography variant="h6" className="mb-4">Cài đặt hệ thống</Typography>
      {msg && <Alert severity="success" className="mb-3">{msg}</Alert>}
      <Stack spacing={2}>
        <TextField label="Tên hệ thống" value={settings.appName||''} onChange={e=>setSettings({...settings, appName:e.target.value})}/>
        <TextField label="Email support" value={settings.supportEmail||''} onChange={e=>setSettings({...settings, supportEmail:e.target.value})}/>
        <div><Button variant="contained" onClick={save}>Lưu</Button></div>
      </Stack>
    </Box>
  );
}
