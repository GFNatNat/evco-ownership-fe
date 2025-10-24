import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  Assessment as ReportIcon, GetApp as DownloadIcon, Visibility as ViewIcon,
  PictureAsPdf as PdfIcon, TableView as ExcelIcon, SupervisorAccount as SupervisorIcon,
  TrendingUp as TrendingIcon, MonetizationOn as MoneyIcon, Schedule as ScheduleIcon
} from '@mui/icons-material';
import vehicleReportApi from '../../api/vehicleReportApi';

const VehicleReportsManagement = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [systemReports, setSystemReports] = useState([]);
  const [reportStatistics, setReportStatistics] = useState(null);
  const [reportSchedules, setReportSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [timeRange, setTimeRange] = useState('current_month');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin overview
      const mockVehicles = [
        { id: 1, name: 'Toyota Camry 2023', licensePlate: '30A-12345', coOwnersCount: 3 },
        { id: 2, name: 'Honda Civic 2022', licensePlate: '29B-67890', coOwnersCount: 2 },
        { id: 3, name: 'Mazda CX-5 2023', licensePlate: '51C-11111', coOwnersCount: 4 },
        { id: 4, name: 'Tesla Model 3 2024', licensePlate: '60D-22222', coOwnersCount: 2 }
      ];

      const mockSystemReports = [
        {
          reportId: 1,
          vehicleId: 1,
          vehicleName: 'Toyota Camry 2023',
          reportType: 'monthly',
          period: 'October 2024',
          generatedAt: '2024-10-24T09:00:00Z',
          generatedBy: 'System Auto',
          status: 'completed',
          fileSize: '2.3 MB',
          downloadCount: 5,
          summary: {
            totalBookings: 25,
            totalIncome: 15000000,
            totalExpenses: 8000000,
            profit: 7000000
          }
        },
        {
          reportId: 2,
          vehicleId: 2,
          vehicleName: 'Honda Civic 2022',
          reportType: 'quarterly',
          period: 'Q3 2024',
          generatedAt: '2024-10-01T10:30:00Z',
          generatedBy: 'Admin',
          status: 'completed',
          fileSize: '4.1 MB',
          downloadCount: 12,
          summary: {
            totalBookings: 68,
            totalIncome: 42000000,
            totalExpenses: 23000000,
            profit: 19000000
          }
        },
        {
          reportId: 3,
          vehicleId: 3,
          vehicleName: 'Mazda CX-5 2023',
          reportType: 'yearly',
          period: '2024',
          generatedAt: '2024-10-23T15:45:00Z',
          generatedBy: 'Staff',
          status: 'processing',
          fileSize: null,
          downloadCount: 0,
          summary: null
        }
      ];

      const mockStatistics = {
        totalReportsGenerated: 156,
        reportsThisMonth: 28,
        totalDownloads: 234,
        averageGenerationTime: 4.2,
        topPerformingVehicles: [
          { vehicleId: 1, vehicleName: 'Toyota Camry 2023', totalProfit: 85000000, profitGrowth: 15.2 },
          { vehicleId: 2, vehicleName: 'Honda Civic 2022', totalProfit: 72000000, profitGrowth: 8.7 },
          { vehicleId: 3, vehicleName: 'Mazda CX-5 2023', totalProfit: 68000000, profitGrowth: -3.1 }
        ],
        reportTypeDistribution: {
          monthly: 89,
          quarterly: 42,
          yearly: 25
        },
        systemHealth: {
          successRate: 96.8,
          averageFileSize: '3.2 MB',
          storageUsed: '1.2 GB'
        }
      };

      const mockSchedules = [
        {
          scheduleId: 1,
          vehicleId: 'all',
          vehicleName: 'Tất cả xe',
          reportType: 'monthly',
          schedule: 'first_day_of_month',
          nextRun: '2024-11-01T00:00:00Z',
          isActive: true,
          emailRecipients: ['admin@company.com', 'manager@company.com']
        },
        {
          scheduleId: 2,
          vehicleId: 1,
          vehicleName: 'Toyota Camry 2023',
          reportType: 'quarterly',
          schedule: 'first_day_of_quarter',
          nextRun: '2025-01-01T00:00:00Z',
          isActive: true,
          emailRecipients: ['owner1@email.com']
        }
      ];

      setAllVehicles(mockVehicles);
      setSystemReports(mockSystemReports);
      setReportStatistics(mockStatistics);
      setReportSchedules(mockSchedules);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSystemReport = async () => {
    try {
      console.log('Generating system-wide report...');
      alert('Báo cáo hệ thống đang được tạo. Bạn sẽ nhận được thông báo khi hoàn tất.');
      setReportDialogOpen(false);
      // Reload data to show new report
      setTimeout(() => {
        loadData();
      }, 2000);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo');
    }
  };

  const handleDownloadReport = async (reportId, reportType) => {
    try {
      console.log('Downloading report:', reportId);
      alert('Báo cáo đang được tải xuống...');
      // In real implementation, this would trigger the download
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      console.log('Creating report schedule...');
      alert('Lịch báo cáo đã được tạo thành công!');
      setScheduleDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'processing': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatPercentage = (value) => {
    const color = value >= 0 ? 'success.main' : 'error.main';
    const sign = value >= 0 ? '+' : '';
    return (
      <Typography component="span" color={color}>
        {sign}{value.toFixed(1)}%
      </Typography>
    );
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý Báo cáo Hệ thống
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<ReportIcon />}
            onClick={() => setReportDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Tạo báo cáo
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ScheduleIcon />}
            onClick={() => setScheduleDialogOpen(true)}
          >
            Lập lịch
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {reportStatistics?.totalReportsGenerated || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng báo cáo đã tạo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {reportStatistics?.reportsThisMonth || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Báo cáo tháng này
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                {reportStatistics?.totalDownloads || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lượt tải xuống
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {reportStatistics?.systemHealth?.successRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tỷ lệ thành công
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Báo cáo hệ thống" />
        <Tab label="Top xe hiệu quả" />
        <Tab label="Lịch trình tự động" />
        <Tab label="Thống kê chi tiết" />
      </Tabs>

      {/* Tab: System Reports */}
      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Chọn xe</InputLabel>
              <Select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <MenuItem value="all">Tất cả xe</MenuItem>
                {allVehicles.map(vehicle => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.licensePlate})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="current_month">Tháng hiện tại</MenuItem>
                <MenuItem value="last_month">Tháng trước</MenuItem>
                <MenuItem value="current_quarter">Quý hiện tại</MenuItem>
                <MenuItem value="current_year">Năm hiện tại</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Xe</TableCell>
                  <TableCell>Loại báo cáo</TableCell>
                  <TableCell>Kỳ báo cáo</TableCell>
                  <TableCell>Người tạo</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Tóm tắt</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemReports
                  .filter(report => selectedVehicle === 'all' || report.vehicleId === selectedVehicle)
                  .map((report) => (
                    <TableRow key={report.reportId}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {report.vehicleName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(report.generatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            report.reportType === 'monthly' ? 'Tháng' :
                            report.reportType === 'quarterly' ? 'Quý' : 'Năm'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(report.status)}
                          color={getStatusColor(report.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {report.summary ? (
                          <Box>
                            <Typography variant="caption">
                              Booking: {report.summary.totalBookings}
                            </Typography><br />
                            <Typography variant="caption">
                              Lợi nhuận: {formatCurrency(report.summary.profit)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Đang xử lý...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.status === 'completed' && (
                          <>
                            <IconButton onClick={() => handleDownloadReport(report.reportId, 'pdf')}>
                              <PdfIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDownloadReport(report.reportId, 'excel')}>
                              <ExcelIcon />
                            </IconButton>
                          </>
                        )}
                        <IconButton>
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab: Top Performing Vehicles */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top xe hiệu quả nhất
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Xe</TableCell>
                        <TableCell>Tổng lợi nhuận</TableCell>
                        <TableCell>Tăng trưởng</TableCell>
                        <TableCell>Số đồng sở hữu</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportStatistics?.topPerformingVehicles?.map((vehicle, index) => (
                        <TableRow key={vehicle.vehicleId}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ mr: 2, color: 'primary.main' }}>
                                #{index + 1}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {vehicle.vehicleName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6" color="success.main">
                              {formatCurrency(vehicle.totalProfit)}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatPercentage(vehicle.profitGrowth)}</TableCell>
                          <TableCell>
                            {allVehicles.find(v => v.id === vehicle.vehicleId)?.coOwnersCount || 0} người
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab: Automated Schedules */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Xe</TableCell>
                <TableCell>Loại báo cáo</TableCell>
                <TableCell>Lịch trình</TableCell>
                <TableCell>Lần chạy tiếp theo</TableCell>
                <TableCell>Người nhận email</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportSchedules.map((schedule) => (
                <TableRow key={schedule.scheduleId}>
                  <TableCell>{schedule.vehicleName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        schedule.reportType === 'monthly' ? 'Hàng tháng' :
                        schedule.reportType === 'quarterly' ? 'Hàng quý' : 'Hàng năm'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {schedule.schedule === 'first_day_of_month' ? 'Đầu tháng' :
                     schedule.schedule === 'first_day_of_quarter' ? 'Đầu quý' : 'Đầu năm'}
                  </TableCell>
                  <TableCell>{formatDateTime(schedule.nextRun)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {schedule.emailRecipients.length} người nhận
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={schedule.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                      color={schedule.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: Detailed Statistics */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân bố loại báo cáo
                </Typography>
                {Object.entries(reportStatistics?.reportTypeDistribution || {}).map(([type, count]) => (
                  <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {type === 'monthly' ? 'Hàng tháng' :
                       type === 'quarterly' ? 'Hàng quý' : 'Hàng năm'}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} báo cáo
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sức khỏe hệ thống
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Tỷ lệ thành công: <strong>{reportStatistics?.systemHealth?.successRate}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Kích thước TB: <strong>{reportStatistics?.systemHealth?.averageFileSize}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Dung lượng đã dùng: <strong>{reportStatistics?.systemHealth?.storageUsed}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Thời gian tạo TB: <strong>{reportStatistics?.averageGenerationTime}s</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo báo cáo hệ thống</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Báo cáo sẽ bao gồm tất cả xe trong hệ thống với dữ liệu chi tiết về hiệu suất và tài chính.
          </Alert>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Loại báo cáo</InputLabel>
                <Select defaultValue="monthly">
                  <MenuItem value="monthly">Báo cáo tháng</MenuItem>
                  <MenuItem value="quarterly">Báo cáo quý</MenuItem>
                  <MenuItem value="yearly">Báo cáo năm</MenuItem>
                  <MenuItem value="custom">Tùy chỉnh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phạm vi</InputLabel>
                <Select defaultValue="all">
                  <MenuItem value="all">Tất cả xe</MenuItem>
                  <MenuItem value="top_performers">Top xe hiệu quả</MenuItem>
                  <MenuItem value="specific_group">Nhóm cụ thể</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleGenerateSystemReport} variant="contained">
            Tạo báo cáo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lập lịch báo cáo tự động</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Xe</InputLabel>
                <Select defaultValue="all">
                  <MenuItem value="all">Tất cả xe</MenuItem>
                  {allVehicles.map(vehicle => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tần suất</InputLabel>
                <Select defaultValue="monthly">
                  <MenuItem value="monthly">Hàng tháng</MenuItem>
                  <MenuItem value="quarterly">Hàng quý</MenuItem>
                  <MenuItem value="yearly">Hàng năm</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email người nhận"
                placeholder="admin@company.com, manager@company.com"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateSchedule} variant="contained">
            Tạo lịch
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleReportsManagement;