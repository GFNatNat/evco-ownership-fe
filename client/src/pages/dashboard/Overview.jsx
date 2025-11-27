import { Card, CardContent, Typography, Grid } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Overview() {
  const { user } = useAuth();

  const stats = [
    { label: "Your Ownership (%)", value: user?.ownership || 0 },
    { label: "Total Trips", value: user?.totalTrips || 0 },
    { label: "Outstanding Costs", value: `$${user?.outstandingCosts || 0}` },
    { label: "Group Count", value: user?.groups?.length || 0 },
  ];

  // dummy data for chart (should be replaced with real API data)
  const usageData = [
    { month: "Jan", trips: 5 },
    { month: "Feb", trips: 8 },
    { month: "Mar", trips: 6 },
    { month: "Apr", trips: 12 },
    { month: "May", trips: 9 },
    { month: "Jun", trips: 14 },
  ];

  const ownershipPie = (user?.groups || []).map((g, i) => ({
    name: g.name,
    value: g.ownershipPercent || 0,
  }));
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-6 font-bold">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={3}>
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4" className="font-bold mt-2">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card className="shadow-lg p-4">
            <CardContent>
              <Typography variant="h6">Usage (last 6 months)</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={usageData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="trips"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorTrips)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="shadow-lg p-4">
            <CardContent>
              <Typography variant="h6">Ownership Distribution</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ownershipPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {ownershipPie.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
