import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import paymentApi from '../../api/paymentApi';
import dayjs from 'dayjs';

export default function Payments() {
  const [rows, setRows] = React.useState([]);
  const [summary, setSummary] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [error, setError] = React.useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [invoices, sum] = await Promise.all([
        paymentApi.listInvoices(),
        paymentApi.getSummary({ period: 'month', at: dayjs().toISOString() })
      ]);
      const data = Array.isArray(invoices.data) ? invoices.data : [];
      setRows(data.map((r, idx)=>({ id: r.id ?? idx, ...r })));
      setSummary(sum.data);
    } catch (e) {
      setError(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e));
    } finally { setLoading(false); }
  };
  React.useEffect(()=>{ load(); }, []);

  const pay = async (id) => {
    setMsg(''); setError('');
    try {
      await paymentApi.payInvoice(id, {});
      setMsg('Thanh toán thành công');
      await load();
    } catch (e) {
      setError(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e));
    }
  };

  const columns = [
    { field: 'code', headerName: 'Mã hoá đơn', flex: 1 },
    { field: 'type', headerName: 'Loại phí', flex: 1 },
    { field: 'amount', headerName: 'Số tiền', flex: 0.8, valueFormatter: ({value}) => new Intl.NumberFormat().format(value) + ' ₫' },
    { field: 'status', headerName: 'Trạng thái', flex: 0.8 },
    { field: 'dueDate', headerName: 'Hạn', flex: 1, valueGetter: (v,r)=> r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '' },
    { field: 'actions', headerName: 'Hành động', flex: 0.8, renderCell: (params) => (
      params.row.status === 'Unpaid' ? <Button size="small" variant="contained" onClick={()=>pay(params.row.id)}>Thanh toán</Button> : null
    )},
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card><CardContent>
          <Typography variant="h5">Chi phí & Thanh toán</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Tự động chia theo tỉ lệ sở hữu hoặc theo mức độ sử dụng (tuỳ cấu hình BE).
          </Typography>
        </CardContent></Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card><CardContent>
          <Typography variant="subtitle1">Tổng kết tháng</Typography>
          <Typography sx={{ mt: 1 }}>
            Tổng chi: <b>{summary?.total ? new Intl.NumberFormat().format(summary.total) : '-'}</b> ₫
          </Typography>
          <Typography>Đã thanh toán: <b>{summary?.paid ? new Intl.NumberFormat().format(summary.paid) : '-'}</b> ₫</Typography>
          <Typography>Còn nợ: <b>{summary?.unpaid ? new Intl.NumberFormat().format(summary.unpaid) : '-'}</b> ₫</Typography>
        </CardContent></Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card><CardContent>
          <div style={{ height: 520, width: '100%' }}>
            <DataGrid loading={loading} rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
          </div>
        </CardContent></Card>
      </Grid>

      <Snackbar open={!!msg} autoHideDuration={3000} onClose={()=>setMsg('')}>
        <Alert severity="success" onClose={()=>setMsg('')}>{msg}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={5000} onClose={()=>setError('')}>
        <Alert severity="error" onClose={()=>setError('')} sx={{ whiteSpace: 'pre-wrap' }}>{error}</Alert>
      </Snackbar>
    </Grid>
  );
}