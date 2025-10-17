import React from 'react';
import { Card, CardContent, Typography, Button, TextField, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import contractApi from '../../api/contractApi';

export default function Contracts() {
  const [rows, setRows] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await contractApi.list();
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data.map((r,i)=>({ id: r.id ?? i, ...r })));
    } finally { setLoading(false); }
  };
  React.useEffect(()=>{ load(); }, []);

  const create = async () => {
    const fd = new FormData();
    if (file) fd.append('file', file);
    fd.append('title', title);
    await contractApi.create(fd);
    await load();
  };

  const columns = [
    { field: 'title', headerName: 'Hợp đồng', flex: 1 },
    { field: 'status', headerName: 'Trạng thái', flex: 1 },
  ];

  return (
    <Card><CardContent>
      <Typography variant="h5" sx={{ mb: 2 }}>Hợp đồng điện tử</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField label="Tiêu đề" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <Button component="label" variant="outlined">Chọn file
          <input type="file" hidden onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        </Button>
        <Button variant="contained" onClick={create}>Tạo hợp đồng</Button>
      </Stack>
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid loading={loading} rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
      </div>
    </CardContent></Card>
  );
}