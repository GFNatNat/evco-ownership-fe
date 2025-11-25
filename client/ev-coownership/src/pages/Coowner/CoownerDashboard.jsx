import React from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";

export default function CoownerDashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Co-owner Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Tỉ lệ sở hữu</Typography>
              <Typography variant="h3" fontWeight={700} mt={1}>
                40%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Lịch sử sử dụng tháng này</Typography>
              <Typography variant="h3" fontWeight={700} mt={1}>
                12 giờ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Chi phí tháng này</Typography>
              <Typography variant="h3" fontWeight={700} mt={1}>
                1.200.000₫
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Lịch sử nhanh
            </Typography>

            <Button variant="contained" sx={{ mr: 2 }}>
              Đặt lịch
            </Button>
            <Button variant="outlined">Xem chi tiết lịch</Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
