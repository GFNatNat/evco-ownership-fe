import React from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Box, Stack,
  FormControl, InputLabel, Select, MenuItem, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, CircularProgress
} from '@mui/material';
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
import { Download, TrendingUp, AccountBalance, DirectionsCar, Group } from '@mui/icons-material';
import adminApi from '../../api/admin';

export default function Reports() {
  const [selectedReport, setSelectedReport] = React.useState('overview');
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = React.useState(false);
  const [reportData, setReportData] = React.useState({
    overview: null,
    financial: null,
    users: null,
    vehicles: null
  });

  React.useEffect(() => {
    loadReportData();
  }, [selectedReport, dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      switch (selectedReport) {
        case 'overview':
          await loadOverviewData();
          break;
        case 'financial':
          await loadFinancialData();
          break;
        case 'users':
          await loadUserData();
          break;
        case 'vehicles':
          await loadVehicleData();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewData = async () => {
    try {
      // Use proper admin reports API from documentation
      const systemReports = await adminApi.reports.getSystemReports();
      const dashboardStats = await adminApi.reports.getDashboardStats();

      setReportData(prev => ({
        ...prev,
        overview: {
          systemReports: systemReports.data,
          dashboardStats: dashboardStats.data
        }
      }));
      console.log('✅ Loaded system reports successfully');
    } catch (err) {
      console.error('❌ Failed to load overview data:', err);
    }
  };

  const loadFinancialData = async () => {
    try {
      const [monthlyReport, revenueReport] = await Promise.all([
        paymentApi.getMonthlyReport(new Date().getFullYear(), new Date().getMonth() + 1),
        paymentApi.getRevenueReport(dateRange.startDate, dateRange.endDate)
      ]);

      setReportData(prev => ({
        ...prev,
        financial: {
          monthly: monthlyReport.data,
          revenue: revenueReport.data
        }
      }));
    } catch (err) {
      console.error('Failed to load financial data:', err);
    }
  };

  const loadUserData = async () => {
    try {
      const userStats = await userApi.getStatistics();
      setReportData(prev => ({
        ...prev,
        users: userStats.data
      }));
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const loadVehicleData = async () => {
    try {
      const vehicleStats = await vehicleApi.getStatistics();
      setReportData(prev => ({
        ...prev,
        vehicles: vehicleStats.data
      }));
    } catch (err) {
      console.error('Failed to load vehicle data:', err);
    }
  };

  const exportReport = async () => {
    try {
      const format = 'excel';
      const response = await reportApi.export({
        type: selectedReport,
        ...dateRange,
        format
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const renderOverviewReport = () => {
    if (!reportData.overview) return null;

    const { users, vehicles, payments } = reportData.overview;

    return (
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Group color="primary" />
                <Box>
                  <Typography variant="h4">{users?.totalUsers || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng người dùng
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <DirectionsCar color="success" />
                <Box>
                  <Typography variant="h4">{vehicles?.totalVehicles || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số xe
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountBalance color="info" />
                <Box>
                  <Typography variant="h4">
                    {payments?.totalRevenue?.toLocaleString('vi-VN') || 0}đ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng doanh thu
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp color="warning" />
                <Box>
                  <Typography variant="h4">{payments?.totalTransactions || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng giao dịch
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Phân bố người dùng theo vai trò</Typography>
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box>
                  <Group sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Biểu đồ đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cài đặt thư viện recharts để hiển thị biểu đồ
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Doanh thu theo tháng</Typography>
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box>
                  <TrendingUp sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Biểu đồ đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cài đặt thư viện recharts để hiển thị biểu đồ
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderFinancialReport = () => {
    if (!reportData.financial) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Báo cáo tài chính chi tiết</Typography>
              <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box>
                  <AccountBalance sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Biểu đồ đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cài đặt thư viện recharts để hiển thị biểu đồ
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Báo cáo và thống kê
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Theo dõi, phân tích và xuất báo cáo hệ thống
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                startIcon={<Download />}
                onClick={exportReport}
                disabled={loading}
              >
                Xuất báo cáo
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Filter Options */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bộ lọc và tùy chọn
            </Typography>

            <Stack direction="row" spacing={2}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Loại báo cáo</InputLabel>
                <Select
                  value={selectedReport}
                  label="Loại báo cáo"
                  onChange={(e) => setSelectedReport(e.target.value)}
                >
                  <MenuItem value="overview">Tổng quan</MenuItem>
                  <MenuItem value="financial">Tài chính</MenuItem>
                  <MenuItem value="users">Người dùng</MenuItem>
                  <MenuItem value="vehicles">Phương tiện</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Từ ngày"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Đến ngày"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Report Content */}
      <Grid item xs={12}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {selectedReport === 'overview' && renderOverviewReport()}
            {selectedReport === 'financial' && renderFinancialReport()}
            {selectedReport === 'users' && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Báo cáo người dùng</Typography>
                  <Typography>Đang phát triển...</Typography>
                </CardContent>
              </Card>
            )}
            {selectedReport === 'vehicles' && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Báo cáo phương tiện</Typography>
                  <Typography>Đang phát triển...</Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
}