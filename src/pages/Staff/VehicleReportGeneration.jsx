import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import {
  Assessment as ReportIcon, GetApp as DownloadIcon, Visibility as ViewIcon,
  PictureAsPdf as PdfIcon, TableView as ExcelIcon, CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon, AttachMoney as MoneyIcon
} from '@mui/icons-material';
import vehicleReportApi from '../../api/vehicleReportApi';

const VehicleReportGeneration = () => {
  const [vehicles, setVehicles] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.floor((new Date().getMonth() + 3) / 3));
  const [format, setFormat] = useState('pdf');
  const [currentReports, setCurrentReports] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load vehicles (mock data for now)
      setVehicles([
        { id: 1, name: 'Toyota Camry 2023', licensePlate: '30A-12345' },
        { id: 2, name: 'Honda Civic 2022', licensePlate: '29B-67890' },
        { id: 3, name: 'Mazda CX-5 2023', licensePlate: '51C-11111' }
      ]);
      
      // Load current reports for each vehicle
      const currentReportsData = {};
      for (const vehicle of vehicles) {
        try {
          const [monthlyRes, quarterlyRes, yearlyRes] = await Promise.all([
            vehicleReportApi.getCurrentMonthReport(vehicle.id),
            vehicleReportApi.getCurrentQuarterReport(vehicle.id),
            vehicleReportApi.getCurrentYearReport(vehicle.id)
          ]);
          currentReportsData[vehicle.id] = {
            monthly: monthlyRes.data,
            quarterly: quarterlyRes.data,
            yearly: yearlyRes.data
          };
        } catch (error) {
          console.error(`Error loading reports for vehicle ${vehicle.id}:`, error);
        }
      }
      setCurrentReports(currentReportsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const reportData = {
        vehicleId: parseInt(selectedVehicle),
        year: year
      };

      if (reportType === 'monthly') {
        reportData.month = month;
        await vehicleReportApi.generateMonthlyReport(reportData);
      } else if (reportType === 'quarterly') {
        reportData.quarter = quarter;
        await vehicleReportApi.generateQuarterlyReport(reportData);
      } else {
        await vehicleReportApi.generateYearlyReport(reportData);
      }

      alert('Báo cáo đã được tạo thành công!');
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo');
    }
  };

  const handleDownloadReport = async (vehicleId, reportYear, reportMonth, reportQuarter, downloadFormat) => {
    try {
      await vehicleReportApi.downloadReport(vehicleId, reportYear, reportMonth, reportQuarter, downloadFormat);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Có lỗi xảy ra khi tải báo cáo');
    }
  };

  const getCurrentPeriodText = () => {
    const now = new Date();
    const currentMonth = now.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    const currentQuarter = `Quý ${Math.floor((now.getMonth() + 3) / 3)} ${now.getFullYear()}`;
    const currentYear = now.getFullYear();
    
    return { currentMonth, currentQuarter, currentYear };
  };

  const periods = getCurrentPeriodText();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const getReportSummary = (report) => {
    if (!report) return null;
    return {
      totalBookings: report.totalBookings || 0,
      totalIncome: report.totalIncome || 0,
      totalExpenses: report.totalExpenses || 0,
      profit: (report.totalIncome || 0) - (report.totalExpenses || 0)
    };
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Báo cáo xe
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ReportIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Tạo báo cáo mới
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Báo cáo hiện tại" />
        <Tab label="Tạo báo cáo tùy chỉnh" />
        <Tab label="Lịch sử báo cáo" />
      </Tabs>

      {/* Tab: Current Reports */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => {
            const vehicleReports = currentReports[vehicle.id] || {};
            const monthlyReport = getReportSummary(vehicleReports.monthly);
            const quarterlyReport = getReportSummary(vehicleReports.quarterly);
            const yearlyReport = getReportSummary(vehicleReports.yearly);

            return (
              <Grid item xs={12} key={vehicle.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {vehicle.name} ({vehicle.licensePlate})
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {/* Monthly Report */}
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              Báo cáo tháng ({periods.currentMonth})
                            </Typography>
                            {monthlyReport ? (
                              <>
                                <Typography variant="body2">
                                  Booking: {monthlyReport.totalBookings}
                                </Typography>
                                <Typography variant="body2">
                                  Thu nhập: {formatCurrency(monthlyReport.totalIncome)}
                                </Typography>
                                <Typography variant="body2">
                                  Chi phí: {formatCurrency(monthlyReport.totalExpenses)}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  Lợi nhuận: {formatCurrency(monthlyReport.profit)}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                  <IconButton 
                                    onClick={() => handleDownloadReport(vehicle.id, new Date().getFullYear(), new Date().getMonth() + 1, null, 'pdf')}
                                  >
                                    <PdfIcon />
                                  </IconButton>
                                  <IconButton 
                                    onClick={() => handleDownloadReport(vehicle.id, new Date().getFullYear(), new Date().getMonth() + 1, null, 'excel')}
                                  >
                                    <ExcelIcon />
                                  </IconButton>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Chưa có dữ liệu
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Quarterly Report */}
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              Báo cáo quý ({periods.currentQuarter})
                            </Typography>
                            {quarterlyReport ? (
                              <>
                                <Typography variant="body2">
                                  Booking: {quarterlyReport.totalBookings}
                                </Typography>
                                <Typography variant="body2">
                                  Thu nhập: {formatCurrency(quarterlyReport.totalIncome)}
                                </Typography>
                                <Typography variant="body2">
                                  Chi phí: {formatCurrency(quarterlyReport.totalExpenses)}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  Lợi nhuận: {formatCurrency(quarterlyReport.profit)}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                  <IconButton 
                                    onClick={() => handleDownloadReport(vehicle.id, new Date().getFullYear(), null, Math.floor((new Date().getMonth() + 3) / 3), 'pdf')}
                                  >
                                    <PdfIcon />
                                  </IconButton>
                                  <IconButton 
                                    onClick={() => handleDownloadReport(vehicle.id, new Date().getFullYear(), null, Math.floor((new Date().getMonth() + 3) / 3), 'excel')}
                                  >
                                    <ExcelIcon />
                                  </IconButton>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Chưa có dữ liệu
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Yearly Report */}
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              Báo cáo năm ({periods.currentYear})
                            </Typography>
                            {yearlyReport ? (
                              <>
                                <Typography variant="body2">
                                  Booking: {yearlyReport.totalBookings}
                                </Typography>
                                <Typography variant="body2">
                                  Thu nhập: {formatCurrency(yearlyReport.totalIncome)}
                                </Typography>
                                <Typography variant="body2">
                                  Chi phí: {formatCurrency(yearlyReport.totalExpenses)}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  Lợi nhuận: {formatCurrency(yearlyReport.profit)}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                  <IconButton 
                                    onClick={() => handleDownloadReport(vehicle.id, new Date().getFullYear(), null, null, 'pdf')}
                                  >
                                    <PdfIcon />
                                  </IconButton>
                                  <IconButton 
                                    onClick={() => handleDownloadReport(vehicle.id, new Date().getFullYear(), null, null, 'excel')}
                                  >
                                    <ExcelIcon />
                                  </IconButton>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Chưa có dữ liệu
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Tab: Custom Reports */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tạo báo cáo tùy chỉnh
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Chọn xe</InputLabel>
                  <Select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                  >
                    {vehicles.map(vehicle => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.licensePlate})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Loại báo cáo</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="monthly">Báo cáo tháng</MenuItem>
                    <MenuItem value="quarterly">Báo cáo quý</MenuItem>
                    <MenuItem value="yearly">Báo cáo năm</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Năm"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                />
              </Grid>

              {reportType === 'monthly' && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tháng</InputLabel>
                    <Select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      {Array.from({length: 12}, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          Tháng {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {reportType === 'quarterly' && (
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Quý</InputLabel>
                    <Select
                      value={quarter}
                      onChange={(e) => setQuarter(e.target.value)}
                    >
                      <MenuItem value={1}>Quý 1</MenuItem>
                      <MenuItem value={2}>Quý 2</MenuItem>
                      <MenuItem value={3}>Quý 3</MenuItem>
                      <MenuItem value={4}>Quý 4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Định dạng</InputLabel>
                  <Select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={handleGenerateReport}
                  disabled={!selectedVehicle}
                  startIcon={<ReportIcon />}
                >
                  Tạo báo cáo
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab: Report History */}
      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Lịch sử báo cáo
            </Typography>
            <Alert severity="info">
              Tính năng lịch sử báo cáo sẽ được triển khai trong phiên bản tiếp theo
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo báo cáo mới</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chọn xe</InputLabel>
                <Select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  {vehicles.map(vehicle => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Loại báo cáo</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="monthly">Báo cáo tháng</MenuItem>
                  <MenuItem value="quarterly">Báo cáo quý</MenuItem>
                  <MenuItem value="yearly">Báo cáo năm</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Năm"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </Grid>

            {reportType === 'monthly' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tháng</InputLabel>
                  <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        Tháng {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {reportType === 'quarterly' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Quý</InputLabel>
                  <Select
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                  >
                    <MenuItem value={1}>Quý 1</MenuItem>
                    <MenuItem value={2}>Quý 2</MenuItem>
                    <MenuItem value={3}>Quý 3</MenuItem>
                    <MenuItem value={4}>Quý 4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleGenerateReport} variant="contained" disabled={!selectedVehicle}>
            Tạo báo cáo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleReportGeneration;