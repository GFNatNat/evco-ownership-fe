import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
export default function AdminDashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">Dashboard — Admin</Typography></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Người dùng mới</Typography></CardContent></Card></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Nhóm đồng sở hữu</Typography></CardContent></Card></Grid>
      <Grid item xs={12} md={4}><Card><CardContent><Typography>Báo cáo tài chính</Typography></CardContent></Card></Grid>
    </Grid>
  );
}