import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  DirectionsCar,
  QrCodeScanner,
  Assignment,
  LocationOn,
  CameraAlt,
  CheckCircle,
  Cancel,
  History,
  Warning,
  Battery3Bar,
  Speed,
  CleaningServices,
  Refresh,
  ExpandMore,
  PhotoCamera,
  Add,
  Remove
} from '@mui/icons-material';
import { QrReader } from 'react-qr-reader';
import checkInCheckOutApi from '../../api/checkInCheckOutApi';
import bookingApi from '../../api/bookingApi';

const CheckInCheckOutManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // QR Scanner
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrScanMode, setQrScanMode] = useState('checkin'); // 'checkin' or 'checkout'
  
  // Check-in/out form
  const [checkInOutForm, setCheckInOutForm] = useState({
    conditionType: 1,
    cleanlinessLevel: 4,
    hasDamages: false,
    damages: [],
    notes: '',
    odometerReading: '',
    batteryLevel: '',
    locationLatitude: null,
    locationLongitude: null
  });
  
  // Damage reporting
  const [damageForm, setDamageForm] = useState({
    damageType: '',
    severity: 0,
    location: '',
    description: '',
    estimatedCost: ''
  });
  
  const [damageTypes] = useState([
    'Scratch', 'Dent', 'Crack', 'Stain', 'Tire Damage', 'Interior Damage', 'Electronic Issue'
  ]);
  
  // Dialogs
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [damageDialogOpen, setDamageDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [bookingHistory, setBookingHistory] = useState([]);

  useEffect(() => {
    loadMyBookings();
    getCurrentLocation();
  }, []);

  const loadMyBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getMyBookings({
        status: 'Confirmed',
        sortBy: 'StartTime',
        sortDirection: 'asc'
      });
      
      const today = new Date();
      const relevantBookings = response.data?.items?.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        const dayDiff = Math.abs(bookingDate - today) / (1000 * 60 * 60 * 24);
        return dayDiff <= 1; // Only show bookings within 1 day
      }) || [];
      
      setBookings(relevantBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Không thể tải danh sách đặt xe');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCheckInOutForm(prev => ({
            ...prev,
            locationLatitude: position.coords.latitude,
            locationLongitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleQrScan = async (data) => {
    if (data?.text) {
      try {
        const qrData = checkInCheckOutApi.parseQRCodeData(data.text);
        if (!qrData) {
          setError('Mã QR không hợp lệ');
          return;
        }

        const booking = bookings.find(b => b.id === qrData.bookingId);
        if (!booking) {
          setError('Không tìm thấy đặt xe tương ứng');
          return;
        }

        setSelectedBooking(booking);
        setQrScannerOpen(false);

        if (qrScanMode === 'checkin') {
          // Validate check-in eligibility
          const validation = await checkInCheckOutApi.validateCheckInEligibility(booking.id);
          if (validation.data?.canCheckIn) {
            setCheckInDialogOpen(true);
          } else {
            setError(validation.data?.message || 'Không thể check-in vào thời điểm này');
          }
        } else {
          // Validate check-out eligibility
          const validation = await checkInCheckOutApi.validateCheckOutEligibility(booking.id);
          if (validation.data?.canCheckOut) {
            setCheckOutDialogOpen(true);
          } else {
            setError(validation.data?.message || 'Không thể check-out vào thời điểm này');
          }
        }
      } catch (error) {
        console.error('Error processing QR code:', error);
        setError('Lỗi xử lý mã QR');
      }
    }
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    try {
      // Validate condition report
      const validation = checkInCheckOutApi.validateConditionReport(checkInOutForm, false);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      setLoading(true);
      setError('');

      // Generate QR code data
      const qrCodeData = JSON.stringify({
        bookingId: selectedBooking.id,
        vehicleId: selectedBooking.vehicleId,
        timestamp: new Date().toISOString()
      });

      await checkInCheckOutApi.qrCheckIn({
        qrCodeData,
        conditionReport: {
          conditionType: checkInOutForm.conditionType,
          cleanlinessLevel: checkInOutForm.cleanlinessLevel,
          hasDamages: checkInOutForm.hasDamages,
          notes: checkInOutForm.notes
        },
        notes: checkInOutForm.notes,
        locationLatitude: checkInOutForm.locationLatitude,
        locationLongitude: checkInOutForm.locationLongitude
      });

      setSuccess('Check-in thành công!');
      setCheckInDialogOpen(false);
      resetForm();
      loadMyBookings();
    } catch (error) {
      console.error('Error during check-in:', error);
      setError(error.response?.data?.message || 'Không thể check-in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedBooking) return;

    try {
      // Validate condition report for check-out (more strict)
      const validation = checkInCheckOutApi.validateConditionReport(checkInOutForm, true);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      setLoading(true);
      setError('');

      // Generate QR code data
      const qrCodeData = JSON.stringify({
        bookingId: selectedBooking.id,
        vehicleId: selectedBooking.vehicleId,
        timestamp: new Date().toISOString()
      });

      await checkInCheckOutApi.qrCheckOut({
        qrCodeData,
        conditionReport: {
          conditionType: checkInOutForm.conditionType,
          cleanlinessLevel: checkInOutForm.cleanlinessLevel,
          hasDamages: checkInOutForm.hasDamages,
          damages: checkInOutForm.damages,
          notes: checkInOutForm.notes
        },
        odometerReading: parseInt(checkInOutForm.odometerReading),
        batteryLevel: parseInt(checkInOutForm.batteryLevel),
        notes: checkInOutForm.notes
      });

      setSuccess('Check-out thành công!');
      setCheckOutDialogOpen(false);
      resetForm();
      loadMyBookings();
    } catch (error) {
      console.error('Error during check-out:', error);
      setError(error.response?.data?.message || 'Không thể check-out');
    } finally {
      setLoading(false);
    }
  };

  const addDamage = () => {
    if (!damageForm.damageType || !damageForm.location) {
      setError('Vui lòng điền đầy đủ thông tin hư hại');
      return;
    }

    const newDamage = {
      ...damageForm,
      id: Date.now(),
      estimatedCost: parseFloat(damageForm.estimatedCost) || 0
    };

    setCheckInOutForm(prev => ({
      ...prev,
      damages: [...prev.damages, newDamage],
      hasDamages: true
    }));

    setDamageForm({
      damageType: '',
      severity: 0,
      location: '',
      description: '',
      estimatedCost: ''
    });

    setDamageDialogOpen(false);
  };

  const removeDamage = (damageId) => {
    setCheckInOutForm(prev => {
      const updatedDamages = prev.damages.filter(d => d.id !== damageId);
      return {
        ...prev,
        damages: updatedDamages,
        hasDamages: updatedDamages.length > 0
      };
    });
  };

  const loadBookingHistory = async (bookingId) => {
    try {
      setLoading(true);
      const response = await checkInCheckOutApi.getHistory(bookingId);
      setBookingHistory(response.data || []);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error('Error loading booking history:', error);
      setError('Không thể tải lịch sử check-in/out');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCheckInOutForm({
      conditionType: 1,
      cleanlinessLevel: 4,
      hasDamages: false,
      damages: [],
      notes: '',
      odometerReading: '',
      batteryLevel: '',
      locationLatitude: null,
      locationLongitude: null
    });
    setSelectedBooking(null);
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'CheckedIn': return 'info';
      case 'CheckedOut': return 'success';
      case 'Confirmed': return 'warning';
      default: return 'default';
    }
  };

  const getConditionText = (type) => {
    const conditions = {
      1: 'Xuất sắc',
      2: 'Tốt',
      3: 'Khá',
      4: 'Kém',
      5: 'Rất kém'
    };
    return conditions[type] || 'Không xác định';
  };

  const getCleanlinessText = (level) => {
    const cleanliness = {
      1: 'Rất bẩn',
      2: 'Bẩn',
      3: 'Bình thường',
      4: 'Sạch',
      5: 'Rất sạch'
    };
    return cleanliness[level] || 'Không xác định';
  };

  const getSeverityText = (severity) => {
    const severities = {
      0: 'Nhẹ',
      1: 'Trung bình',
      2: 'Nặng'
    };
    return severities[severity] || 'Không xác định';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <DirectionsCar sx={{ mr: 2, verticalAlign: 'middle' }} />
          Quản lý Check-in/Check-out
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Đặt xe hôm nay" />
            <Tab label="Quét mã QR" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Đặt xe hôm nay ({bookings.length})</Typography>
            <Button
              variant="outlined"
              onClick={loadMyBookings}
              startIcon={<Refresh />}
              disabled={loading}
            >
              Làm mới
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : bookings.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Không có đặt xe nào hôm nay
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {bookings.map((booking) => (
                <Grid item xs={12} md={6} lg={4} key={booking.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {booking.vehicleName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {booking.licensePlate}
                          </Typography>
                        </Box>
                        <Chip
                          label={booking.status}
                          color={getBookingStatusColor(booking.status)}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Thời gian:</strong> {new Date(booking.startTime).toLocaleString('vi-VN')} - {new Date(booking.endTime).toLocaleString('vi-VN')}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Địa điểm:</strong> {booking.pickupLocation}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Mục đích:</strong> {booking.purpose}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {booking.status === 'Confirmed' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<CheckCircle />}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setQrScanMode('checkin');
                              setQrScannerOpen(true);
                            }}
                          >
                            Check-in
                          </Button>
                        )}
                        
                        {booking.status === 'CheckedIn' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            startIcon={<Cancel />}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setQrScanMode('checkout');
                              setQrScannerOpen(true);
                            }}
                          >
                            Check-out
                          </Button>
                        )}

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<History />}
                          onClick={() => loadBookingHistory(booking.id)}
                        >
                          Lịch sử
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quét mã QR để check-in/check-out
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Chọn chế độ quét và hướng camera vào mã QR trên xe
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant={qrScanMode === 'checkin' ? 'contained' : 'outlined'}
                onClick={() => setQrScanMode('checkin')}
                sx={{ mr: 2 }}
                startIcon={<CheckCircle />}
              >
                Check-in
              </Button>
              <Button
                variant={qrScanMode === 'checkout' ? 'contained' : 'outlined'}
                onClick={() => setQrScanMode('checkout')}
                startIcon={<Cancel />}
              >
                Check-out
              </Button>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<QrCodeScanner />}
              onClick={() => setQrScannerOpen(true)}
            >
              Bắt đầu quét mã QR
            </Button>
          </Box>
        </TabPanel>
      </Paper>

      {/* QR Scanner Dialog */}
      <Dialog
        open={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Quét mã QR để {qrScanMode === 'checkin' ? 'Check-in' : 'Check-out'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', height: 400 }}>
            <QrReader
              onResult={handleQrScan}
              style={{ width: '100%' }}
              constraints={{ facingMode: 'environment' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrScannerOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Check-in Dialog */}
      <Dialog
        open={checkInDialogOpen}
        onClose={() => setCheckInDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Check-in xe</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedBooking.vehicleName} - {selectedBooking.licensePlate}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tình trạng xe</InputLabel>
                    <Select
                      value={checkInOutForm.conditionType}
                      onChange={(e) => setCheckInOutForm(prev => ({ ...prev, conditionType: e.target.value }))}
                      label="Tình trạng xe"
                    >
                      {[1, 2, 3, 4, 5].map(type => (
                        <MenuItem key={type} value={type}>
                          {getConditionText(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mức độ sạch sẽ</InputLabel>
                    <Select
                      value={checkInOutForm.cleanlinessLevel}
                      onChange={(e) => setCheckInOutForm(prev => ({ ...prev, cleanlinessLevel: e.target.value }))}
                      label="Mức độ sạch sẽ"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <MenuItem key={level} value={level}>
                          {getCleanlinessText(level)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú"
                    value={checkInOutForm.notes}
                    onChange={(e) => setCheckInOutForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckInDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleCheckIn}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
          >
            Check-in
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog
        open={checkOutDialogOpen}
        onClose={() => setCheckOutDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Check-out xe</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedBooking.vehicleName} - {selectedBooking.licensePlate}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tình trạng xe</InputLabel>
                    <Select
                      value={checkInOutForm.conditionType}
                      onChange={(e) => setCheckInOutForm(prev => ({ ...prev, conditionType: e.target.value }))}
                      label="Tình trạng xe"
                    >
                      {[1, 2, 3, 4, 5].map(type => (
                        <MenuItem key={type} value={type}>
                          {getConditionText(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mức độ sạch sẽ</InputLabel>
                    <Select
                      value={checkInOutForm.cleanlinessLevel}
                      onChange={(e) => setCheckInOutForm(prev => ({ ...prev, cleanlinessLevel: e.target.value }))}
                      label="Mức độ sạch sẽ"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <MenuItem key={level} value={level}>
                          {getCleanlinessText(level)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số km hiện tại"
                    value={checkInOutForm.odometerReading}
                    onChange={(e) => setCheckInOutForm(prev => ({ ...prev, odometerReading: e.target.value }))}
                    InputProps={{
                      startAdornment: <Speed sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Mức pin (%)"
                    value={checkInOutForm.batteryLevel}
                    onChange={(e) => setCheckInOutForm(prev => ({ ...prev, batteryLevel: e.target.value }))}
                    inputProps={{ min: 0, max: 100 }}
                    InputProps={{
                      startAdornment: <Battery3Bar sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Báo cáo hư hại ({checkInOutForm.damages.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => setDamageDialogOpen(true)}
                    >
                      Thêm hư hại
                    </Button>
                  </Box>

                  {checkInOutForm.damages.length > 0 && (
                    <List>
                      {checkInOutForm.damages.map((damage, index) => (
                        <ListItem key={damage.id} divider>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${damage.damageType} - ${getSeverityText(damage.severity)}`}
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  Vị trí: {damage.location}
                                </Typography>
                                {damage.description && (
                                  <Typography variant="body2">
                                    Mô tả: {damage.description}
                                  </Typography>
                                )}
                                <Typography variant="body2">
                                  Chi phí ước tính: {formatCurrency(damage.estimatedCost)}
                                </Typography>
                              </Box>
                            }
                          />
                          <IconButton
                            edge="end"
                            onClick={() => removeDamage(damage.id)}
                          >
                            <Remove />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú"
                    value={checkInOutForm.notes}
                    onChange={(e) => setCheckInOutForm(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckOutDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleCheckOut}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Cancel />}
          >
            Check-out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Damage Dialog */}
      <Dialog
        open={damageDialogOpen}
        onClose={() => setDamageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Báo cáo hư hại</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Loại hư hại</InputLabel>
                <Select
                  value={damageForm.damageType}
                  onChange={(e) => setDamageForm(prev => ({ ...prev, damageType: e.target.value }))}
                  label="Loại hư hại"
                >
                  {damageTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mức độ nghiêm trọng</InputLabel>
                <Select
                  value={damageForm.severity}
                  onChange={(e) => setDamageForm(prev => ({ ...prev, severity: e.target.value }))}
                  label="Mức độ nghiêm trọng"
                >
                  <MenuItem value={0}>Nhẹ</MenuItem>
                  <MenuItem value={1}>Trung bình</MenuItem>
                  <MenuItem value={2}>Nặng</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vị trí hư hại"
                value={damageForm.location}
                onChange={(e) => setDamageForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ví dụ: Cản trước bên trái"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả chi tiết"
                value={damageForm.description}
                onChange={(e) => setDamageForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết về hư hại"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Chi phí ước tính (VNĐ)"
                value={damageForm.estimatedCost}
                onChange={(e) => setDamageForm(prev => ({ ...prev, estimatedCost: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDamageDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={addDamage}
            variant="contained"
            startIcon={<Add />}
          >
            Thêm hư hại
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Lịch sử Check-in/Check-out</DialogTitle>
        <DialogContent>
          {bookingHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Chưa có lịch sử check-in/out
              </Typography>
            </Box>
          ) : (
            <List>
              {bookingHistory.map((history, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: history.type === 'CheckIn' ? 'primary.main' : 'secondary.main' }}>
                        {history.type === 'CheckIn' ? <CheckCircle /> : <Cancel />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={history.type === 'CheckIn' ? 'Check-in' : 'Check-out'}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Thời gian: {new Date(history.timestamp).toLocaleString('vi-VN')}
                          </Typography>
                          <Typography variant="body2">
                            Tình trạng: {getConditionText(history.conditionType)}
                          </Typography>
                          {history.notes && (
                            <Typography variant="body2">
                              Ghi chú: {history.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < bookingHistory.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckInCheckOutManagement;