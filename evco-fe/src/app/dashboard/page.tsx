'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import { Grid, Paper, Typography } from '@mui/material';
import OwnershipCard from '@/components/OwnershipCard';
import CostSummary from '@/components/CostSummary';

export default function Dashboard() {
  return (
    <>
      <Topbar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">
          <Typography variant="h5" className="mb-4">Tổng quan cá nhân</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><Paper className="p-4"><OwnershipCard /></Paper></Grid>
            <Grid item xs={12} md={8}><Paper className="p-4"><CostSummary /></Paper></Grid>
          </Grid>
        </main>
      </div>
    </>
  );
}
