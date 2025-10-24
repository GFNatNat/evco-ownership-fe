import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  Visibility as ViewIcon, Edit as EditIcon, CheckCircle as CheckIcon,
  Cancel as CancelIcon, SupervisorAccount as SupervisorIcon,
  Assessment as ReportIcon, TrendingUp as TrendingIcon
} from '@mui/icons-material';
import checkInCheckOutApi from '../../api/checkInCheckOutApi';

const CheckInCheckOutOversight = () => {
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('today');

  useEffect(() => {
    loadData();
  }, [filterStatus, filterTimeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - in real app, this would be admin oversight data
      const mockActivities = [
        {
          id: 1,
          bookingId: 'BK001',
          vehicleName: 'Toyota Camry 2023',
          licensePlate: '30A-12345',
          userName: 'Nguyễn Văn A',
          activityType: 'checkin',
          timestamp: '2024-10-24T08:30:00Z',
          location: 'Trạm 1 - Quận 1',
          status: 'completed',
          method: 'qr_code',
          conditionReport: {
            conditionType: 1,
            cleanlinessLevel: 4,
            hasDamages: false,
            notes: 'Xe trong tình trạng tốt'
          },
          odometerReading: 15000,
          batteryLevel: 85,
          staffNotes: 'Check-in thành công, không có vấn đề'
        },
        {
          id: 2,
          bookingId: 'BK002',
          vehicleName: 'Honda Civic 2022',
          licensePlate: '29B-67890',
          userName: 'Trần Thị B',
          activityType: 'checkout',
          timestamp: '2024-10-24T10:15:00Z',
          location: 'Trạm 2 - Quận 3',
          status: 'completed',
          method: 'manual',
          conditionReport: {
            conditionType: 3,
            cleanlinessLevel: 2,
            hasDamages: true,
            damages: [
              { damageType: 'Scratch', severity: 1, location: 'Cửa trước bên phải' }
            ],
            notes: 'Có vết xước nhỏ ở cửa xe'
          },
          odometerReading: 12500,
          batteryLevel: 45,
          staffNotes: 'Cần kiểm tra vết hư hỏng'
        },
        {
          id: 3,
          bookingId: 'BK003',
          vehicleName: 'Mazda CX-5 2023',
          licensePlate: '51C-11111',
          userName: 'Lê Văn C',
          activityType: 'checkin',
          timestamp: '2024-10-24T14:20:00Z',
          location: 'Trạm 3 - Quận 7',
          status: 'failed',
          method: 'qr_code',
          errorReason: 'QR code không hợp lệ',
          staffNotes: 'Cần hỗ trợ check-in thủ công'
        }
      ];

      const mockStatistics = {
        totalActivitiesToday: 25,
        successfulActivities: 22,
        failedActivities: 3,
        checkInCount: 15,
        checkOutCount: 10,
        qrCodeUsage: 18,
        manualProcessing: 7,
        damageReports: 2,
        averageProcessingTime: 3.5,
        topIssues: [
          { issue: 'QR code không đọc được', count: 2 },
          { issue: 'Hư hỏng xe nhỏ', count: 2 },
          { issue: 'Pin yếu', count: 1 }
        ]
      };

      setActivities(mockActivities);
      setStatistics(mockStatistics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setDetailDialogOpen(true);
  };

  const handleResolveIssue = async (activityId) => {
    try {
      // In real implementation, this would update the activity status
      console.log('Resolving issue for activity:', activityId);
      alert('Vấn đề đã được giải quyết');
      loadData();
    } catch (error) {
      console.error('Error resolving issue:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'failed': return 'Thất bại';
      case 'pending': return 'Đang xử lý';
      default: return status;
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case 'qr_code': return 'QR Code';
      case 'manual': return 'Thủ công';
      default: return method;
    }
  };

  const getConditionLabel = (conditionType) => {
    const labels = {
      1: 'Tuyệt vời',
      2: 'Tốt',
      3: 'Trung bình',
      4: 'Kém',
      5: 'Nghiêm trọng'
    };
    return labels[conditionType] || 'Không xác định';
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const filteredActivities = activities.filter(activity => {
    if (filterStatus !== 'all' && activity.status !== filterStatus) return false;
    
    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    
    switch (filterTimeRange) {
      case 'today':
        return activityDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return activityDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return activityDate >= monthAgo;
      default:
        return true;
    }
  });

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Giám sát Check-in/Check-out
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {statistics?.totalActivitiesToday || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoạt động hôm nay
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {statistics?.successfulActivities || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thành công
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {statistics?.failedActivities || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thất bại
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {statistics?.damageReports || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Báo cáo hư hỏng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Hoạt động gần đây" />
        <Tab label="Thống kê chi tiết" />
        <Tab label="Vấn đề cần xử lý" />
        <Tab label="Báo cáo hiệu suất" />
      </Tabs>

      {/* Tab: Recent Activities */}
      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="failed">Thất bại</MenuItem>
                <MenuItem value="pending">Đang xử lý</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Thời gian</InputLabel>
              <Select
                value={filterTimeRange}
                onChange={(e) => setFilterTimeRange(e.target.value)}
              >
                <MenuItem value="today">Hôm nay</MenuItem>
                <MenuItem value="week">7 ngày qua</MenuItem>
                <MenuItem value="month">30 ngày qua</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Booking</TableCell>
                  <TableCell>Xe</TableCell>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Phương thức</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{formatDateTime(activity.timestamp)}</TableCell>
                    <TableCell>{activity.bookingId}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {activity.vehicleName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.licensePlate}
                      </Typography>
                    </TableCell>
                    <TableCell>{activity.userName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={activity.activityType === 'checkin' ? 'Check-in' : 'Check-out'}
                        color={activity.activityType === 'checkin' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{getMethodLabel(activity.method)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(activity.status)}
                        color={getStatusColor(activity.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(activity)}>
                        <ViewIcon />
                      </IconButton>
                      {activity.status === 'failed' && (
                        <IconButton 
                          color="success"
                          onClick={() => handleResolveIssue(activity.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab: Detailed Statistics */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê theo phương thức
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>QR Code:</Typography>
                  <Typography fontWeight="bold">{statistics?.qrCodeUsage || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Thủ công:</Typography>
                  <Typography fontWeight="bold">{statistics?.manualProcessing || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê theo loại hoạt động
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Check-in:</Typography>
                  <Typography fontWeight="bold">{statistics?.checkInCount || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Check-out:</Typography>
                  <Typography fontWeight="bold">{statistics?.checkOutCount || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vấn đề phổ biến
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Vấn đề</TableCell>
                        <TableCell>Số lần xảy ra</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statistics?.topIssues?.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell>{issue.issue}</TableCell>
                          <TableCell>{issue.count}</TableCell>
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

      {/* Tab: Issues to Resolve */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {activities
            .filter(activity => activity.status === 'failed')
            .map((activity) => (
              <Grid item xs={12} key={activity.id}>
                <Alert 
                  severity="error"
                  action={
                    <Button 
                      color="inherit" 
                      size="small"
                      onClick={() => handleResolveIssue(activity.id)}
                    >
                      Giải quyết
                    </Button>
                  }
                >
                  <Typography variant="body2" fontWeight="bold">
                    {activity.bookingId} - {activity.vehicleName}
                  </Typography>
                  <Typography variant="body2">
                    Lỗi: {activity.errorReason}
                  </Typography>
                  <Typography variant="caption">
                    {formatDateTime(activity.timestamp)} - {activity.userName}
                  </Typography>
                </Alert>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Tab: Performance Report */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hiệu suất xử lý
                </Typography>
                <Typography variant="h4" color="primary">
                  {statistics?.averageProcessingTime || 0} phút
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thời gian xử lý trung bình
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tỷ lệ thành công
                </Typography>
                <Typography variant="h4" color="success.main">
                  {statistics ? ((statistics.successfulActivities / statistics.totalActivitiesToday) * 100).toFixed(1) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hoạt động thành công
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết hoạt động</DialogTitle>
        <DialogContent>
          {selectedActivity && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Booking ID:</Typography>
                <Typography variant="body2" paragraph>
                  {selectedActivity.bookingId}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Xe:</Typography>
                <Typography variant="body2" paragraph>
                  {selectedActivity.vehicleName} ({selectedActivity.licensePlate})
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Người dùng:</Typography>
                <Typography variant="body2" paragraph>
                  {selectedActivity.userName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Thời gian:</Typography>
                <Typography variant="body2" paragraph>
                  {formatDateTime(selectedActivity.timestamp)}
                </Typography>
              </Grid>

              {selectedActivity.conditionReport && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Báo cáo tình trạng:</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      Tình trạng: {getConditionLabel(selectedActivity.conditionReport.conditionType)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      Độ sạch: {selectedActivity.conditionReport.cleanlinessLevel}/5
                    </Typography>
                  </Grid>
                  {selectedActivity.conditionReport.hasDamages && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="error">
                        Có hư hỏng: {selectedActivity.conditionReport.damages?.length || 0} vấn đề
                      </Typography>
                    </Grid>
                  )}
                </>
              )}

              {selectedActivity.odometerReading && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Số km:</Typography>
                  <Typography variant="body2">
                    {selectedActivity.odometerReading.toLocaleString()} km
                  </Typography>
                </Grid>
              )}

              {selectedActivity.batteryLevel && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Mức pin:</Typography>
                  <Typography variant="body2">
                    {selectedActivity.batteryLevel}%
                  </Typography>
                </Grid>
              )}

              {selectedActivity.staffNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Ghi chú của staff:</Typography>
                  <Typography variant="body2">
                    {selectedActivity.staffNotes}
                  </Typography>
                </Grid>
              )}

              {selectedActivity.errorReason && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    <Typography variant="body2">
                      {selectedActivity.errorReason}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          {selectedActivity?.status === 'failed' && (
            <Button 
              color="success" 
              onClick={() => {
                handleResolveIssue(selectedActivity.id);
                setDetailDialogOpen(false);
              }}
            >
              Giải quyết vấn đề
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckInCheckOutOversight;