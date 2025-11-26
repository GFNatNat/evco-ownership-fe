import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import api from "../api/axiosClient";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    api
      .get("/reports/dashboard")
      .then((r) => setSummary(r.data))
      .catch(() => {});
  }, []);
  return (
    <Box p={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Tổng chi (tháng)</Typography>
            <Typography variant="h6">{summary?.monthTotal || 0} VND</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Lịch sử sử dụng</Typography>
            <Typography variant="h6">{summary?.usageCount || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="h6">{summary?.notifications || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
