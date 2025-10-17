import React from 'react';
import { Card, CardContent, Typography, Stack, TextField, Button } from '@mui/material';
import bookingApi from '../../api/bookingApi';

export default function CheckInOut() {
  const [bookingCode, setBookingCode] = React.useState('');
  const [msg, setMsg] = React.useState('');

  const checkIn = async () => {
    await bookingApi.checkIn({ code: bookingCode });
    setMsg('Check-in thành công');
  };
  const checkOut = async () => {
    await bookingApi.checkOut({ code: bookingCode });
    setMsg('Check-out thành công');
  };

  return (
    <Card><CardContent>
      <Typography variant="h5" sx={{ mb: 2 }}>Check-in / Check-out</Typography>
      <Stack direction="row" spacing={2}>
        <TextField label="Booking code" value={bookingCode} onChange={(e)=>setBookingCode(e.target.value)} />
        <Button variant="contained" onClick={checkIn}>Check-in</Button>
        <Button variant="outlined" onClick={checkOut}>Check-out</Button>
      </Stack>
      {msg && <Typography sx={{ mt: 2 }} color="primary">{msg}</Typography>}
    </CardContent></Card>
  );
}