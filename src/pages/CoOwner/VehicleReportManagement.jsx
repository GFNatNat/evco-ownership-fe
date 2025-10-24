import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Assessment,
  GetApp,
  DateRange,
  TrendingUp,
  PictureAsPdf,
  TableView,
  ExpandMore,
  Visibility,
  CalendarToday,
  AttachMoney,
  DirectionsCar,
  Build,
  Group,
  Timeline
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

import vehicleReportApi from '../../api/vehicleReportApi';
import vehicleApi from '../../api/vehicleApi';

const VehicleReportManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [reportData, setReportData] = useState(null);
  const [availablePeriods, setAvailablePeriods] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [reportForm, setReportForm] = useState({
    vehicleId: '',
    year: new Date().getFullYear(),
    month: '',
    quarter: '',
    exportFormat: 'PDF'
  });

  // Dialog states
  const [detailDialog, setDetailDialog] = useState({ open: false, data: null });
  const [exportDialog, setExportDialog] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      loadAvailablePeriods();
    }
  }, [selectedVehicle]);

  const loadVehicles = async () => {
    try {
      const response = await vehicleApi.getAllVehicles().catch(() => ({ data: { data: [] } }));
      const vehiclesData = response?.data?.data || [];
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
    } catch (error) {
      console.error('Lỗi tải danh sách xe:', error);
      setVehicles([]);
    }
  };

  const loadAvailablePeriods = async () => {
    try {
      setLoading(true);
      const response = await vehicleReportApi.getAvailablePeriods(selectedVehicle).catch(() => ({ data: { data: null } }));
      setAvailablePeriods(response?.data?.data || null);
    } catch (error) {
      console.error('Lỗi tải kỳ báo cáo:', error);
      setAvailablePeriods(null);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    try {
      setLoading(true);
      setError('');
      
      const { vehicleId, year, month, quarter } = reportForm;
      
      if (!vehicleId) {
        setError('Vui lòng chọn xe');
        return;
      }

      let response;
      
      switch (reportType) {
        case 'monthly':
          if (!month) {
            setError('Vui lòng chọn tháng');
            return;
          }
          response = await vehicleReportApi.generateMonthlyReport({
            vehicleId: parseInt(vehicleId),
            year,
            month: parseInt(month)
          });
          break;
        case 'quarterly':
          if (!quarter) {
            setError('Vui lòng chọn quý');
            return;
          }
          response = await vehicleReportApi.generateQuarterlyReport({
            vehicleId: parseInt(vehicleId),
            year,
            quarter: parseInt(quarter)
          });
          break;
        case 'yearly':
          response = await vehicleReportApi.generateYearlyReport({
            vehicleId: parseInt(vehicleId),
            year
          });
          break;
        case 'current-month':
          response = await vehicleReportApi.getCurrentMonthReport(vehicleId);
          break;
        case 'current-quarter':
          response = await vehicleReportApi.getCurrentQuarterReport(vehicleId);
          break;
        case 'current-year':
          response = await vehicleReportApi.getCurrentYearReport(vehicleId);
          break;
        default:
          throw new Error('Loại báo cáo không hợp lệ');
      }

      setReportData(response.data.data);
      setSuccess('Tạo báo cáo thành công');
    } catch (error) {
      console.error('Lỗi tạo báo cáo:', error);
      setError(error.response?.data?.message || 'Không thể tạo báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      setLoading(true);
      
      const { vehicleId, year, month, quarter, exportFormat } = reportForm;
      
      await vehicleReportApi.downloadReport(
        vehicleId, 
        year, 
        month ? parseInt(month) : null, 
        quarter ? parseInt(quarter) : null, 
        exportFormat
      );
      
      setSuccess(`Xuất báo cáo ${exportFormat} thành công`);
      setExportDialog(false);
    } catch (error) {
      console.error('Lỗi xuất báo cáo:', error);
      setError(error.response?.data?.message || 'Không thể xuất báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setReportData(null);
    setError('');
    setSuccess('');
  };

  const handleFormChange = (field) => (event) => {
    setReportForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Reset dependent fields
    if (field === 'vehicleId') {
      setSelectedVehicle(event.target.value);
      setReportData(null);
    }
    if (field === 'month') {
      setReportForm(prev => ({ ...prev, quarter: '' }));
    }
    if (field === 'quarter') {
      setReportForm(prev => ({ ...prev, month: '' }));
    }
  };

  const renderReportSummary = () => {
    if (!reportData) return null;

    const isMonthly = reportData.reportPeriod?.month;
    const isQuarterly = reportData.quarter;
    const isYearly = reportData.year && !isMonthly && !isQuarterly;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Thông tin báo cáo
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><DirectionsCar /></ListItemIcon>
                  <ListItemText 
                    primary="Xe" 
                    secondary={`${reportData.vehicleName} (${reportData.licensePlate})`} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CalendarToday /></ListItemIcon>
                  <ListItemText 
                    primary="Kỳ báo cáo" 
                    secondary={
                      isMonthly ? `${reportData.reportPeriod.monthName} ${reportData.reportPeriod.year}` :
                      isQuarterly ? `${reportData.quarterName} ${reportData.year}` :
                      `Năm ${reportData.year || reportData.yearSummary?.year}`
                    } 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Assessment /></ListItemIcon>
                  <ListItemText 
                    primary="Tạo lúc" 
                    secondary={vehicleReportApi.formatReportDate(reportData.generatedAt)} 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Tóm tắt chỉ số
              </Typography>
              {renderKeyMetrics()}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderKeyMetrics = () => {
    if (!reportData) return null;

    const summary = reportData.usageStatistics || reportData.quarterSummary || reportData.yearSummary;
    
    const metrics = [
      { 
        label: 'Tổng đặt xe', 
        value: summary?.totalBookings || 0, 
        icon: <DirectionsCar />,
        color: '#4caf50'
      },
      { 
        label: 'Tổng thu nhập', 
        value: vehicleReportApi.formatCurrency(summary?.totalIncome || 0), 
        icon: <AttachMoney />,
        color: '#2196f3'
      },
      { 
        label: 'Lợi nhuận', 
        value: vehicleReportApi.formatCurrency(summary?.netProfit || 0), 
        icon: <TrendingUp />,
        color: '#ff9800'
      },
      { 
        label: 'Tỷ lệ sử dụng', 
        value: `${summary?.utilizationRate || summary?.averageMonthlyUtilization || 0}%`, 
        icon: <Timeline />,
        color: '#9c27b0'
      }
    ];

    return (
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={6} key={index}>
            <Card sx={{ 
              textAlign: 'center', 
              p: 1,
              border: `2px solid ${metric.color}`,
              borderRadius: 2
            }}>
              <Box sx={{ color: metric.color, mb: 1 }}>
                {metric.icon}
              </Box>
              <Typography variant="body2" color="textSecondary">
                {metric.label}
              </Typography>
              <Typography variant="h6" sx={{ color: metric.color }}>
                {metric.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderUsageChart = () => {
    if (!reportData) return null;

    const chartData = vehicleReportApi.prepareChartData(reportData);
    if (!chartData) return null;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Biểu đồ xu hướng
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.months?.map((month, index) => ({
              month,
              bookings: chartData.bookings?.[index] || 0,
              income: (chartData.income?.[index] || 0) / 1000000,
              profit: (chartData.profit?.[index] || 0) / 1000000
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'bookings' ? value : `${value}M VND`,
                  name === 'bookings' ? 'Số đặt xe' :
                  name === 'income' ? 'Thu nhập' : 'Lợi nhuận'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="bookings" fill="#4caf50" name="Số đặt xe" />
              <Line yAxisId="right" type="monotone" dataKey="income" stroke="#2196f3" name="Thu nhập (M VND)" />
              <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#ff9800" name="Lợi nhuận (M VND)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderExpenseBreakdown = () => {
    if (!reportData?.costBreakdown?.expenses) return null;

    const pieData = reportData.costBreakdown.expenses.map((expense, index) => ({
      name: expense.category,
      value: expense.amount,
      percentage: expense.percentage,
      color: ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'][index % 5]
    }));

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Phân tích chi phí
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => vehicleReportApi.formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại chi phí</TableCell>
                      <TableCell align="right">Số tiền</TableCell>
                      <TableCell align="right">%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.costBreakdown.expenses.map((expense, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip 
                            size="small" 
                            label={expense.category}
                            sx={{ 
                              backgroundColor: pieData[index].color + '20',
                              color: pieData[index].color
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {vehicleReportApi.formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell align="right">
                          {vehicleReportApi.formatPercentage(expense.percentage)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCoOwnerBreakdown = () => {
    if (!reportData?.coOwnerBreakdown) return null;

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Phân tích theo chủ sở hữu chung
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chủ sở hữu</TableCell>
                  <TableCell align="center">Quyền sở hữu</TableCell>
                  <TableCell align="center">Tỷ lệ sử dụng</TableCell>
                  <TableCell align="center">Số đặt xe</TableCell>
                  <TableCell align="center">Giờ sử dụng</TableCell>
                  <TableCell align="center">Đóng góp</TableCell>
                  <TableCell align="center">Chênh lệch</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.coOwnerBreakdown.map((coOwner) => (
                  <TableRow key={coOwner.coOwnerId}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {coOwner.coOwnerName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        size="small" 
                        label={`${coOwner.ownershipPercentage}%`}
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        size="small" 
                        label={`${coOwner.usagePercentage}%`}
                        color="secondary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">{coOwner.bookingCount}</TableCell>
                    <TableCell align="center">{coOwner.hoursUsed}h</TableCell>
                    <TableCell align="center">
                      {vehicleReportApi.formatCurrency(coOwner.contributionAmount)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        size="small"
                        label={`${coOwner.usageVsOwnership > 0 ? '+' : ''}${coOwner.usageVsOwnership}%`}
                        color={coOwner.usageVsOwnership > 0 ? 'error' : 'success'}
                        variant={coOwner.usageVsOwnership === 0 ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  const renderMaintenanceSummary = () => {
    if (!reportData?.maintenanceSummary) return null;

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Build />
            <Typography>Tóm tắt bảo dưỡng</Typography>
            <Chip 
              size="small" 
              label={`${reportData.maintenanceSummary.scheduledMaintenances + reportData.maintenanceSummary.emergencyRepairs} lần`}
              color="info"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {reportData.maintenanceSummary.scheduledMaintenances}
                  </Typography>
                  <Typography variant="body2">
                    Bảo dưỡng định kỳ
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main">
                    {reportData.maintenanceSummary.emergencyRepairs}
                  </Typography>
                  <Typography variant="body2">
                    Sửa chữa khẩn cấp
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="error">
                    {vehicleReportApi.formatCurrency(reportData.maintenanceSummary.totalMaintenanceCost)}
                  </Typography>
                  <Typography variant="body2">
                    Tổng chi phí
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h5" color="info.main">
                    {vehicleReportApi.formatCurrency(reportData.maintenanceSummary.averageMaintenanceCost)}
                  </Typography>
                  <Typography variant="body2">
                    Chi phí trung bình
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {reportData.maintenanceSummary.maintenanceItems && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Chi tiết bảo dưỡng
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Loại</TableCell>
                      <TableCell>Ngày</TableCell>
                      <TableCell align="right">Chi phí</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.maintenanceSummary.maintenanceItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{vehicleReportApi.formatReportDate(item.date)}</TableCell>
                        <TableCell align="right">
                          {vehicleReportApi.formatCurrency(item.cost)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small"
                            label={item.status}
                            color={item.status === 'Hoàn thành' ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderReportForm = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tạo báo cáo mới
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Chọn xe"
              value={reportForm.vehicleId}
              onChange={handleFormChange('vehicleId')}
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Năm"
              type="number"
              value={reportForm.year}
              onChange={handleFormChange('year')}
              inputProps={{
                min: 2020,
                max: new Date().getFullYear() + 1
              }}
            />
          </Grid>

          {tabValue === 0 && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                label="Tháng"
                value={reportForm.month}
                onChange={handleFormChange('month')}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                label="Quý"
                value={reportForm.quarter}
                onChange={handleFormChange('quarter')}
              >
                {[1, 2, 3, 4].map((q) => (
                  <MenuItem key={q} value={q}>
                    {vehicleReportApi.getQuarterName(q)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Assessment />}
                onClick={() => generateReport(
                  tabValue === 0 ? 'monthly' :
                  tabValue === 1 ? 'quarterly' : 'yearly'
                )}
                disabled={loading}
              >
                Tạo báo cáo
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => setExportDialog(true)}
                disabled={loading || !reportForm.vehicleId}
              >
                Xuất
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Quick actions for current period */}
        {reportForm.vehicleId && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Báo cáo nhanh:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => generateReport('current-month')}
                disabled={loading}
              >
                Tháng hiện tại
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => generateReport('current-quarter')}
                disabled={loading}
              >
                Quý hiện tại
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => generateReport('current-year')}
                disabled={loading}
              >
                Năm hiện tại
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderExportDialog = () => (
    <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Xuất báo cáo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Định dạng"
              value={reportForm.exportFormat}
              onChange={handleFormChange('exportFormat')}
            >
              <MenuItem value="PDF">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdf /> PDF
                </Box>
              </MenuItem>
              <MenuItem value="Excel">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TableView /> Excel
                </Box>
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              Báo cáo sẽ được tải về với tên file tự động dựa trên loại báo cáo và thời gian.
            </Alert>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExportDialog(false)}>Hủy</Button>
        <Button 
          variant="contained" 
          onClick={exportReport}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <GetApp />}
        >
          Xuất báo cáo
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assessment /> Quản lý báo cáo xe
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab 
          icon={<DateRange />} 
          label="Báo cáo tháng"
          iconPosition="start"
        />
        <Tab 
          icon={<Timeline />} 
          label="Báo cáo quý" 
          iconPosition="start"
        />
        <Tab 
          icon={<TrendingUp />} 
          label="Báo cáo năm" 
          iconPosition="start"
        />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {renderReportForm()}

      {reportData && (
        <Box>
          {renderReportSummary()}
          {renderUsageChart()}
          {renderExpenseBreakdown()}
          {renderCoOwnerBreakdown()}
          {renderMaintenanceSummary()}
        </Box>
      )}

      {renderExportDialog()}

      {/* Available Periods Info */}
      {availablePeriods && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin dữ liệu có sẵn
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Khoảng thời gian: {vehicleReportApi.formatReportDate(availablePeriods.dataRange?.earliestDate)} - {vehicleReportApi.formatReportDate(availablePeriods.dataRange?.latestDate)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tổng số tháng có dữ liệu: {availablePeriods.dataRange?.totalMonths}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Các năm có dữ liệu: {availablePeriods.availableYears?.join(', ')}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default VehicleReportManagement;