'use client';
import { Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import OwnershipCard from '@/components/OwnershipCard';
import CostSummary from '@/components/CostSummary';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Typography variant="h5" className="font-semibold text-gray-100">
        Tổng quan cá nhân
      </Typography>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Xe đang sử dụng', value: '3' },
          { title: 'Tổng chi phí tháng này', value: '12.5M₫' },
          { title: 'Số km trung bình / tháng', value: '410 km' },
        ].map((item, idx) => (
          <Card key={idx} className="bg-neutral-900 text-white shadow-lg hover:shadow-cyan-500/20 transition-shadow">
            <CardContent>
              <Typography variant="subtitle1" className="opacity-75">
                {item.title}
              </Typography>
              <Typography variant="h3" className="text-cyan-400 font-bold">
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ownership & Cost Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="p-4 bg-neutral-900 text-white shadow-lg rounded-2xl">
            <OwnershipCard />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper className="p-4 bg-neutral-900 text-white shadow-lg rounded-2xl">
            <CostSummary />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
