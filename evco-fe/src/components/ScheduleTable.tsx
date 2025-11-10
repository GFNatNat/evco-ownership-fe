/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { scheduleApi } from '@/api/scheduleApi';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Stack, TextField } from '@mui/material';

export default function ScheduleTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');

  const load = async () => {
    const res = await scheduleApi.getAll({ from, to });
    setRows(res.data || []);
  };
  useEffect(() => { load(); }, []);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 180 },
    { field: 'vehicle', headerName: 'Xe', flex: 1 },
    { field: 'from', headerName: 'Từ', width: 180 },
    { field: 'to', headerName: 'Đến', width: 180 },
    { field: 'status', headerName: 'Trạng thái', width: 140 },
  ];

  return (
    <div>
      <Stack direction="row" spacing={2} className="mb-3">
        <TextField size="small" label="Từ" value={from} onChange={e=>setFrom(e.target.value)} />
        <TextField size="small" label="Đến" value={to} onChange={e=>setTo(e.target.value)} />
        <Button variant="contained" onClick={load}>Lọc</Button>
        <Button variant="outlined" onClick={() => { setFrom(''); setTo(''); load(); }}>Làm mới</Button>
      </Stack>
      <div style={{ height: 520 }}><DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id} /></div>
    </div>
  );
}
