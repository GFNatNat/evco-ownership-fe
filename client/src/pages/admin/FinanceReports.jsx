import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function FinanceReports() {
  const [financial, setFinancial] = useState([]);
  const [usage, setUsage] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("all");

  const load = async () => {
    const resF = await adminApi.financialReport({ year, month });
    const resU = await adminApi.usageReport({ year, month });
    setFinancial(resF.data || []);
    setUsage(resU.data || []);
  };

  useEffect(() => load(), []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Financial Reports
      </Typography>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-end">
        <TextField
          select
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {[2024, 2023, 2022, 2021].map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={load}>
          Apply
        </Button>
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card className="shadow p-4">
            <CardContent>
              <Typography variant="h6" className="mb-4">
                Financial Breakdown
              </Typography>
              <BarChart width={450} height={300} data={financial}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="shadow p-4">
            <CardContent>
              <Typography variant="h6" className="mb-4">
                Usage Stats
              </Typography>
              <LineChart width={450} height={300} data={usage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="km" stroke="#82ca9d" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
