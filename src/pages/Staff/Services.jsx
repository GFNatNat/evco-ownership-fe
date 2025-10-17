import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import serviceApi from '../../api/serviceApi';

export default function Services() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(()=>{
    (async ()=>{
      const res = await serviceApi.list();
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data.map((r,i)=>({ id: r.id ?? i, ...r })));
    })();
  }, []);
  const columns = [
    { field: 'name', headerName: 'Dịch vụ', flex: 1 },
    { field: 'status', headerName: 'Trạng thái', flex: 1 },
  ];
  return (
    <Card><CardContent>
      <Typography variant="h5" sx={{ mb: 2 }}>Dịch vụ xe</Typography>
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
      </div>
    </CardContent></Card>
  );
}