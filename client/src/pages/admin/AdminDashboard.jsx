import { useEffect, useState } from "react";
import reportApi from "../../api/reportApi";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    reportApi.adminStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6">
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {[
          { label: "Total Groups", value: stats.groups },
          { label: "Total Vehicles", value: stats.vehicles },
          { label: "Total Users", value: stats.users },
          { label: "Active Staff", value: stats.staff },
        ].map((s, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={3}>
            <Card className="shadow-lg">
              <CardContent>
                <Typography>{s.label}</Typography>
                <Typography variant="h4" className="font-bold">
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card className="shadow-lg p-4">
            <Typography variant="h6">Monthly Financial Overview</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.monthlyFinance}>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
