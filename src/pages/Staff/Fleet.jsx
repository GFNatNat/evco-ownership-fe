import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import vehicleApi from '../../api/vehicleApi';

export default function Fleet() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try {
        const res = await vehicleApi.list();
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data.map((r, i)=>({ id: r.id ?? i, ...r })));
      } finally { setLoading(false); }
    })();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'make', headerName: 'Make', flex: 1 },
    { field: 'model', headerName: 'Model', flex: 1 },
    { field: 'vin', headerName: 'VIN', flex: 1 },
  ];

  return (
    <Card><CardContent>
      <Typography variant="h5" sx={{ mb: 2 }}>Quản lý nhóm xe</Typography>
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid loading={loading} rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
      </div>
    </CardContent></Card>
  );
}