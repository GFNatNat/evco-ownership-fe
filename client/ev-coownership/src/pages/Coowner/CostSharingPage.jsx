import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CostSharingPage() {
  const [totalCost, setTotalCost] = useState(0);
  const [ownership] = useState([
    { name: "A", percent: 40 },
    { name: "B", percent: 30 },
    { name: "C", percent: 30 },
  ]);

  const calculated = ownership.map((o) => ({
    name: o.name,
    value: ((totalCost * o.percent) / 100).toFixed(0),
  }));

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Chi phí & Chia sẻ chi phí
      </Typography>

      <Grid container spacing={3}>
        {/* Cost Input */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Calculator chia chi phí
              </Typography>

              <TextField
                label="Tổng chi phí"
                type="number"
                fullWidth
                value={totalCost}
                onChange={(e) => setTotalCost(Number(e.target.value))}
                sx={{ mb: 2 }}
              />

              <Typography variant="body1" fontWeight={600} mb={1}>
                Kết quả chia theo tỷ lệ sở hữu:
              </Typography>

              {calculated.map((c) => (
                <Typography key={c.name}>
                  {c.name}: <strong>{c.value}₫</strong>
                </Typography>
              ))}

              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                Lưu bản ghi chi phí
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Biểu đồ chia chi phí
              </Typography>

              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={calculated}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
