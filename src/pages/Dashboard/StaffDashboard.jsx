import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
export default function StaffDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">Dashboard — Staff</Typography></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Check-in/Check-out hôm nay</Typography></CardContent></Card></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Dịch vụ đang thực hiện</Typography></CardContent></Card></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Thông báo hệ thống</Typography></CardContent></Card></Grid>
    </Grid>
  );
}