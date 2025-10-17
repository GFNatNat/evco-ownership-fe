import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';

export default function CoOwnerDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">Dashboard — CoOwner</Typography></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Tổng quan lịch sử sử dụng</Typography></CardContent></Card></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Chi phí tháng này</Typography></CardContent></Card></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Lịch đặt xe sắp tới</Typography></CardContent></Card></Grid>
    </Grid>
  );
}