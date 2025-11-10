'use client';
import { adminApi } from '@/api/adminApi';
import { useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

export default function AdminReports(){
  const [period,setPeriod]=useState('month');
  const [type,setType]=useState('financial');
  const onExport=async()=>{
    const r = await adminApi.reports.export(type, period);
    const blob = new Blob([r.data], { type: r.headers['content-type'] || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`${type}-${period}.xlsx`; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <Box className="p-6">
      <Typography variant="h6" className="mb-4">Báo cáo</Typography>
      <Stack direction="row" spacing={2} className="mb-4">
        <TextField select size="small" label="Kỳ" value={period} onChange={e=>setPeriod(e.target.value)}>
          <MenuItem value="month">Tháng này</MenuItem>
          <MenuItem value="quarter">Quý này</MenuItem>
          <MenuItem value="year">Năm nay</MenuItem>
        </TextField>
        <TextField select size="small" label="Loại" value={type} onChange={e=>setType(e.target.value)}>
          <MenuItem value="financial">Tài chính</MenuItem>
          <MenuItem value="usage">Sử dụng</MenuItem>
          <MenuItem value="revenue">Doanh thu</MenuItem>
        </TextField>
        <Button variant="contained" onClick={onExport}>Xuất báo cáo</Button>
      </Stack>
    </Box>
  );
}
