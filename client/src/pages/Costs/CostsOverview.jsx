import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import CostBreakdownTable from "../../components/CostBreakdownTable";

export default function CostsOverview({ groupId }) {
  const [summary, setSummary] = useState(null);
  const [costs, setCosts] = useState([]);

  useEffect(() => {
    if (!groupId) return;
    api
      .get(`/groups/${groupId}/costs/summary`)
      .then((r) => setSummary(r.data))
      .catch(() => {});
    api
      .get(`/groups/${groupId}/costs`)
      .then((r) => setCosts(r.data))
      .catch(() => {});
  }, [groupId]);

  return (
    <Box p={2}>
      <Typography variant="h4">Chi phí & Thanh toán</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tổng chi (Tháng)</Typography>
            <Typography variant="h5">{summary?.monthTotal ?? 0} VND</Typography>
            <Typography sx={{ mt: 1 }}>
              Đã thanh toán: {summary?.paid ?? 0} VND
            </Typography>
            <Typography>
              Chưa thanh toán: {summary?.outstanding ?? 0} VND
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" href={`/groups/${groupId}/costs/add`}>
                Thêm khoản chi
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Gần đây</Typography>
            <CostBreakdownTable
              costs={costs}
              onRefresh={() => {
                api
                  .get(`/groups/${groupId}/costs`)
                  .then((r) => setCosts(r.data));
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
