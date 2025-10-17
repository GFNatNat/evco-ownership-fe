import React from 'react';
import { Card, CardContent, Typography, Stack, Button, Grid, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import scheduleApi from '../../api/scheduleApi';
import { DataGrid } from '@mui/x-data-grid';

export default function Schedule() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [ok, setOk] = React.useState('');
  const [vehicleId, setVehicleId] = React.useState('1'); // TODO: load from API / user vehicles
  const [start, setStart] = React.useState(dayjs().add(1,'hour').startOf('hour'));
  const [end, setEnd] = React.useState(dayjs().add(2,'hour').startOf('hour'));

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await scheduleApi.list({ vehicleId });
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data.map((r, idx)=>({ id: r.id ?? idx, ...r })));
    } catch (e) {
      setError(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e));
    } finally { setLoading(false); }
  };
  React.useEffect(()=>{ load(); /* load again when vehicle changes */ }, [vehicleId]);

  const createBooking = async () => {
    setError(''); setOk('');
    try {
      if (!start || !end || !end.isAfter(start)) {
        setError('Khoảng thời gian không hợp lệ'); return;
      }
      const body = {
        vehicleId,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      };
      await scheduleApi.book(body);
      setOk('Đặt lịch thành công');
      await load();
    } catch (e) {
      setError(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e));
    }
  };

  const columns = [
    { field: 'vehicleId', headerName: 'Xe', flex: 0.6 },
    { field: 'ownerName', headerName: 'Người đặt', flex: 1 },
    { field: 'startTime', headerName: 'Bắt đầu', flex: 1, valueGetter: (v, r)=> r.startTime ? new Date(r.startTime).toLocaleString() : '' },
    { field: 'endTime', headerName: 'Kết thúc', flex: 1, valueGetter: (v, r)=> r.endTime ? new Date(r.endTime).toLocaleString() : '' },
    { field: 'status', headerName: 'Trạng thái', flex: 0.8 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Lịch & Đặt xe</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Xe"
              fullWidth
              select
              value={vehicleId}
              onChange={(e)=>setVehicleId(e.target.value)}>
              {/* TODO: load vehicles from API */}
              <MenuItem value="1">Vehicle #1</MenuItem>
              <MenuItem value="2">Vehicle #2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker label="Bắt đầu" value={start} onChange={setStart} slotProps={{ textField: { fullWidth: true } }} />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker label="Kết thúc" value={end} onChange={setEnd} slotProps={{ textField: { fullWidth: true } }} />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'stretch' }}>
            <Button fullWidth variant="contained" onClick={createBooking} sx={{ height: '100%' }}>Đặt</Button>
          </Grid>
        </Grid>

        <Stack sx={{ mt: 3 }}>
          <div style={{ height: 520, width: '100%' }}>
            <DataGrid loading={loading} rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
          </div>
        </Stack>

        <Snackbar open={!!ok} autoHideDuration={3000} onClose={()=>setOk('')}>
          <Alert severity="success" onClose={()=>setOk('')}>{ok}</Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={5000} onClose={()=>setError('')}>
          <Alert severity="error" onClose={()=>setError('')} sx={{ whiteSpace: 'pre-wrap' }}>{error}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}