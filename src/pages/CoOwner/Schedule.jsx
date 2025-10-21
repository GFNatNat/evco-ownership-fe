import React from 'react';
import {
  Card, CardContent, Typography, Stack, Button, Grid, TextField, MenuItem,
  Snackbar, Alert, Box, Paper, Avatar, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, Divider, List, ListItem, ListItemAvatar,
  ListItemText, Badge, Fab, ToggleButton, ToggleButtonGroup,
  FormControlLabel, Switch, Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import {
  Schedule as ScheduleIcon, DirectionsCar, Add, CalendarToday, ViewWeek, ViewDay,
  Person, CheckCircle, Cancel, Edit, Delete, Notifications,
  AccessTime, LocationOn, Route, Speed, LocalGasStation,
  Warning, Info, Event, ViewList, Refresh
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import scheduleApi from '../../api/scheduleApi';
import { useAuth } from '../../context/AuthContext';

export default function Schedule() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = React.useState('calendar');
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [bookings, setBookings] = React.useState([]);
  const [myVehicles, setMyVehicles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // Booking form state
  const [bookingDialogOpen, setBookingDialogOpen] = React.useState(false);
  const [bookingForm, setBookingForm] = React.useState({
    vehicleId: '',
    startTime: dayjs().add(1, 'hour').startOf('hour'),
    endTime: dayjs().add(3, 'hour').startOf('hour'),
    purpose: '',
    estimatedDistance: '',
    notes: ''
  });

  // Mock data
  const [mockData] = React.useState({
    vehicles: [
      {
        id: 1,
        name: 'Honda City 2023',
        plate: '29A-12345',
        type: 'Sedan',
        available: true,
        nextBooking: dayjs().add(2, 'days').hour(14)
      },
      {
        id: 2,
        name: 'Toyota Camry 2022',
        plate: '30B-67890',
        type: 'Sedan',
        available: false,
        nextBooking: dayjs().add(1, 'hour')
      }
    ],
    upcomingBookings: [
      {
        id: 1,
        vehicleId: 1,
        vehicleName: 'Honda City 2023',
        startTime: dayjs().add(2, 'hours'),
        endTime: dayjs().add(4, 'hours'),
        bookedBy: user?.name || 'Bạn',
        purpose: 'Đi công tác',
        status: 'confirmed',
        canCancel: true
      },
      {
        id: 2,
        vehicleId: 1,
        vehicleName: 'Honda City 2023',
        startTime: dayjs().add(1, 'day').hour(9),
        endTime: dayjs().add(1, 'day').hour(17),
        bookedBy: 'Nguyễn Văn A',
        purpose: 'Du lịch cuối tuần',
        status: 'pending',
        canCancel: false
      },
      {
        id: 3,
        vehicleId: 2,
        vehicleName: 'Toyota Camry 2022',
        startTime: dayjs().add(3, 'days').hour(14),
        endTime: dayjs().add(3, 'days').hour(18),
        bookedBy: 'Trần Thị B',
        purpose: 'Đưa đón gia đình',
        status: 'confirmed',
        canCancel: false
      }
    ]
  });

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setMyVehicles(mockData.vehicles);
      setBookings(mockData.upcomingBookings);
      if (mockData.vehicles.length > 0 && !bookingForm.vehicleId) {
        setBookingForm(prev => ({ ...prev, vehicleId: mockData.vehicles[0].id }));
      }
    } catch (err) {
      setError('Không thể tải dữ liệu lịch trình');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!bookingForm.vehicleId || !bookingForm.startTime || !bookingForm.endTime) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!bookingForm.endTime.isAfter(bookingForm.startTime)) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    try {
      // Mock booking creation
      const newBooking = {
        id: Date.now(),
        vehicleId: bookingForm.vehicleId,
        vehicleName: myVehicles.find(v => v.id === bookingForm.vehicleId)?.name || 'Unknown',
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        bookedBy: user?.name || 'Bạn',
        purpose: bookingForm.purpose,
        status: 'confirmed',
        canCancel: true
      };

      setBookings(prev => [...prev, newBooking]);
      setMessage('Đặt lịch thành công!');
      setBookingDialogOpen(false);

      // Reset form
      setBookingForm({
        vehicleId: myVehicles[0]?.id || '',
        startTime: dayjs().add(1, 'hour').startOf('hour'),
        endTime: dayjs().add(3, 'hour').startOf('hour'),
        purpose: '',
        estimatedDistance: '',
        notes: ''
      });
    } catch (err) {
      setError('Đặt lịch thất bại. Vui lòng thử lại.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ duyệt';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };

  const columns = [
    {
      field: 'vehicleName',
      headerName: 'Xe',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <DirectionsCar color="action" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'startTime',
      headerName: 'Thời gian bắt đầu',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.value.format('DD/MM/YYYY')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.value.format('HH:mm')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'endTime',
      headerName: 'Thời gian kết thúc',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.value.format('DD/MM/YYYY')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.value.format('HH:mm')}
          </Typography>
        </Box>
      )
    },
    {
      field: 'bookedBy',
      headerName: 'Người đặt',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 24, height: 24 }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.canCancel && (
            <Button size="small" color="error" variant="outlined">
              Hủy
            </Button>
          )}
          <IconButton size="small">
            <Edit />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #8e24aa 0%, #7b1fa2 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Lịch trình & Đặt xe
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Quản lý lịch sử dụng xe và đặt lịch theo nhu cầu
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, mode) => mode && setViewMode(mode)}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
                >
                  <ToggleButton value="calendar" sx={{ color: 'white' }}>
                    <CalendarToday />
                  </ToggleButton>
                  <ToggleButton value="list" sx={{ color: 'white' }}>
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setBookingDialogOpen(true)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Đặt lịch mới
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Vehicle Status Cards */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Trạng thái xe hiện tại</Typography>
        <Grid container spacing={2}>
          {myVehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: vehicle.available ? 'success.main' : 'error.main' }}>
                      <DirectionsCar />
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {vehicle.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.plate} • {vehicle.type}
                      </Typography>
                    </Box>
                    <Chip
                      label={vehicle.available ? 'Khả dụng' : 'Đang bận'}
                      color={vehicle.available ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box display="flex" alignItems="center" gap={1}>
                    <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.available
                        ? `Có thể đặt từ ${dayjs().format('HH:mm')}`
                        : `Bận đến ${vehicle.nextBooking.format('DD/MM HH:mm')}`
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {viewMode === 'calendar' ? (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Lịch trình tháng {selectedDate.format('MM/YYYY')}</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      views={['year', 'month']}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Calendar View - Simplified */}
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <CalendarToday sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Giao diện lịch đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sử dụng chế độ danh sách để xem chi tiết lịch trình
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setViewMode('list')}
                    sx={{ mt: 2 }}
                  >
                    Chuyển sang danh sách
                  </Button>
                </Paper>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Lịch trình sắp tới ({bookings.length} lịch hẹn)
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <DataGrid
                    rows={bookings}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <ScheduleIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {bookings.filter(b => b.bookedBy === (user?.name || 'Bạn')).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lịch của bạn
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {myVehicles.filter(v => v.available).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Xe khả dụng
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <AccessTime />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {bookings.filter(b => b.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chờ duyệt
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <Event />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {bookings.filter(b => b.startTime.isSame(dayjs(), 'day')).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hôm nay
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Add color="primary" />
            Đặt lịch sử dụng xe
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Chọn xe</InputLabel>
                <Select
                  value={bookingForm.vehicleId}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                >
                  {myVehicles.map(vehicle => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DirectionsCar fontSize="small" />
                        {vehicle.name} ({vehicle.plate})
                        {!vehicle.available && (
                          <Chip label="Bận" color="error" size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mục đích sử dụng"
                value={bookingForm.purpose}
                onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="Ví dụ: Đi công tác, du lịch..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Thời gian bắt đầu"
                  value={bookingForm.startTime}
                  onChange={(value) => setBookingForm(prev => ({ ...prev, startTime: value }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Thời gian kết thúc"
                  value={bookingForm.endTime}
                  onChange={(value) => setBookingForm(prev => ({ ...prev, endTime: value }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quãng đường dự kiến (km)"
                type="number"
                value={bookingForm.estimatedDistance}
                onChange={(e) => setBookingForm(prev => ({ ...prev, estimatedDistance: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Ghi chú thêm..."
              />
            </Grid>

            {bookingForm.startTime && bookingForm.endTime && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
                  <Typography variant="body2" color="primary">
                    <strong>Tóm tắt đặt lịch:</strong><br />
                    Thời gian: {bookingForm.startTime.format('DD/MM/YYYY HH:mm')} - {bookingForm.endTime.format('DD/MM/YYYY HH:mm')}<br />
                    Thời lượng: {Math.round(bookingForm.endTime.diff(bookingForm.startTime, 'hours', true) * 10) / 10} giờ
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateBooking} variant="contained">
            Xác nhận đặt lịch
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