import React from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Box, Stack, TextField,
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, List, ListItem, ListItemAvatar, ListItemText, Divider,
  IconButton, Tooltip, Badge, Alert, Snackbar, FormControl,
  InputLabel, Select, MenuItem, Stepper, Step, StepLabel,
  LinearProgress, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  DirectionsCar, CheckCircle, Cancel, QrCodeScanner, Person,
  LocationOn, Schedule, Warning, Info, LocalGasStation,
  Speed, Build, Camera, Assignment, Verified
} from '@mui/icons-material';
import bookingApi from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';

export default function CheckInOut() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [bookingCode, setBookingCode] = React.useState('');
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [activeBookings, setActiveBookings] = React.useState([]);
  const [checkInDialogOpen, setCheckInDialogOpen] = React.useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // Vehicle condition form
  const [vehicleCondition, setVehicleCondition] = React.useState({
    fuelLevel: 100,
    mileage: '',
    damage: '',
    cleanliness: 'good',
    notes: ''
  });

  // Mock data for active bookings
  const [mockBookings] = React.useState([
    {
      id: 'BK001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0901234567',
      vehicle: 'Honda City 2023',
      plate: '29A-12345',
      startTime: new Date(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      status: 'confirmed',
      checkInTime: null,
      checkOutTime: null
    },
    {
      id: 'BK002',
      customerName: 'Trần Thị B',
      customerPhone: '0907654321',
      vehicle: 'Toyota Camry 2022',
      plate: '30B-67890',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'in_progress',
      checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      checkOutTime: null
    }
  ]);

  React.useEffect(() => {
    setActiveBookings(mockBookings);
  }, []);

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    try {
      await bookingApi.checkIn({
        bookingId: selectedBooking.id,
        staffId: user?.id,
        vehicleCondition: vehicleCondition,
        checkInTime: new Date().toISOString()
      });

      setActiveBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, status: 'in_progress', checkInTime: new Date() }
          : booking
      ));

      setMessage('Check-in thành công!');
      setCheckInDialogOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      setError('Check-in thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedBooking) return;

    setLoading(true);
    try {
      await bookingApi.checkOut({
        bookingId: selectedBooking.id,
        staffId: user?.id,
        vehicleCondition: vehicleCondition,
        checkOutTime: new Date().toISOString()
      });

      setActiveBookings(prev => prev.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, status: 'completed', checkOutTime: new Date() }
          : booking
      ));

      setMessage('Check-out thành công!');
      setCheckOutDialogOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      setError('Check-out thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'in_progress': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Chờ check-in';
      case 'in_progress': return 'Đang sử dụng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quản lý Check-in/Out
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Xử lý giao nhận xe và kiểm tra tình trạng phương tiện
                </Typography>
              </Box>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Assignment sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Chờ check-in
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {activeBookings.filter(b => b.status === 'confirmed').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Schedule sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Đang sử dụng
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {activeBookings.filter(b => b.status === 'in_progress').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <DirectionsCar sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Hoàn thành hôm nay
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {activeBookings.filter(b => b.status === 'completed').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <CheckCircle sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Tổng giao dịch
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {activeBookings.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Assignment sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<Schedule />} label="Đặt lịch hôm nay" />
            <Tab icon={<QrCodeScanner />} label="Quét mã QR" />
            <Tab icon={<DirectionsCar />} label="Xe đang hoạt động" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Danh sách đặt lịch hôm nay ({activeBookings.length})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đặt chỗ</TableCell>
                        <TableCell>Khách hàng</TableCell>
                        <TableCell>Xe</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <Typography variant="subtitle2" color="primary">
                              {booking.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">{booking.customerName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.customerPhone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">{booking.vehicle}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.plate}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">
                                {booking.startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
                                {booking.endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {Math.round((booking.endTime - booking.startTime) / (1000 * 60 * 60))} giờ
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(booking.status)}
                              color={getStatusColor(booking.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              {booking.status === 'confirmed' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setCheckInDialogOpen(true);
                                  }}
                                >
                                  Check-in
                                </Button>
                              )}
                              {booking.status === 'in_progress' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setCheckOutDialogOpen(true);
                                  }}
                                >
                                  Check-out
                                </Button>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {selectedTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Quét mã QR để check-in/out nhanh
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <QrCodeScanner sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Tính năng đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sử dụng camera để quét mã QR trên xe hoặc booking code
                  </Typography>
                  <TextField
                    label="Hoặc nhập mã booking"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    sx={{ mt: 2, minWidth: 300 }}
                  />
                </Paper>
              </Box>
            )}

            {selectedTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Xe đang được sử dụng
                </Typography>
                <Grid container spacing={2}>
                  {activeBookings.filter(b => b.status === 'in_progress').map((booking) => (
                    <Grid item xs={12} md={6} key={booking.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <DirectionsCar />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {booking.vehicle}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {booking.plate} • {booking.customerName}
                              </Typography>
                            </Box>
                            <Chip label="Đang sử dụng" color="success" size="small" />
                          </Box>

                          <Divider sx={{ my: 1 }} />

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Check-in: {booking.checkInTime?.toLocaleTimeString('vi-VN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Dự kiến trả: {booking.endTime.toLocaleTimeString('vi-VN')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Check-in Dialog */}
      <Dialog open={checkInDialogOpen} onClose={() => setCheckInDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle color="primary" />
            Check-in xe: {selectedBooking?.vehicle}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số km hiện tại"
                type="number"
                value={vehicleCondition.mileage}
                onChange={(e) => setVehicleCondition(prev => ({ ...prev, mileage: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mức xăng (%)"
                type="number"
                value={vehicleCondition.fuelLevel}
                onChange={(e) => setVehicleCondition(prev => ({ ...prev, fuelLevel: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tình trạng vệ sinh</InputLabel>
                <Select
                  value={vehicleCondition.cleanliness}
                  onChange={(e) => setVehicleCondition(prev => ({ ...prev, cleanliness: e.target.value }))}
                >
                  <MenuItem value="excellent">Rất sạch</MenuItem>
                  <MenuItem value="good">Sạch</MenuItem>
                  <MenuItem value="fair">Bình thường</MenuItem>
                  <MenuItem value="poor">Cần vệ sinh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú tình trạng xe"
                value={vehicleCondition.notes}
                onChange={(e) => setVehicleCondition(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Mô tả tình trạng xe, hư hỏng (nếu có)..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCheckIn} variant="contained" disabled={loading}>
            Xác nhận Check-in
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog open={checkOutDialogOpen} onClose={() => setCheckOutDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Assignment color="success" />
            Check-out xe: {selectedBooking?.vehicle}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số km kết thúc"
                type="number"
                value={vehicleCondition.mileage}
                onChange={(e) => setVehicleCondition(prev => ({ ...prev, mileage: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mức xăng còn lại (%)"
                type="number"
                value={vehicleCondition.fuelLevel}
                onChange={(e) => setVehicleCondition(prev => ({ ...prev, fuelLevel: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Tình trạng xe khi trả"
                value={vehicleCondition.damage}
                onChange={(e) => setVehicleCondition(prev => ({ ...prev, damage: e.target.value }))}
                placeholder="Ghi chú về tình trạng xe, hư hỏng, vệ sinh..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckOutDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCheckOut} variant="contained" disabled={loading}>
            Xác nhận Check-out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
        <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Grid>
  );
}