
import React from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Chip, Avatar, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab,
  Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton,
  Tooltip, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  DirectionsCar, Build, Verified, Edit, Delete, Add, Speed, LocalGasStation, Warning, CheckCircle,
  Battery90, Place, Schedule
} from '@mui/icons-material';
import staffApi from '../../api/staff';
import { useAuth } from '../../context/AuthContext';
import {
  VEHICLE_STATUS,
  VEHICLE_VERIFICATION_STATUS,
  getVehicleStatusLabel,
  getVehicleStatusColor,
  getVerificationStatusLabel,
  getVerificationStatusColor,
  formatVehicleName,
  formatBatteryCapacity,
  formatRange,
  formatDistance,
  formatWarranty,
  hasLocation,
  formatLocation
} from '../../types/vehicle';

export default function Fleet() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [vehicles, setVehicles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState(null);

  // Enhanced mock data with database schema fields
  const [mockData] = React.useState([
    {
      id: 1,
      name: 'Honda City Hybrid 2023',
      description: 'Xe hybrid tiết kiệm nhiên liệu',
      brand: 'Honda',
      model: 'City',
      year: 2023,
      vin: '1HGCM82633A123456',
      license_plate: '29A-12345',
      color: 'Trắng',
      battery_capacity: 1.5, // kWh for hybrid
      range_km: 600,
      purchase_date: '2023-01-15',
      purchase_price: 650000000, // 650M VND
      warranty_until: '2026-01-15',
      distance_travelled: 12000,
      status_enum: VEHICLE_STATUS.AVAILABLE,
      verification_status_enum: VEHICLE_VERIFICATION_STATUS.VERIFIED,
      location_latitude: 10.762622,
      location_longitude: 106.660172,
      created_by: 1,
      fund_id: 1
    },
    {
      id: 2,
      name: 'Toyota Camry 2022',
      description: 'Sedan cao cấp',
      brand: 'Toyota',
      model: 'Camry',
      year: 2022,
      vin: '4T1BF1FK7GU123456',
      license_plate: '30B-67890',
      color: 'Đen',
      battery_capacity: null, // Not electric
      range_km: 800,
      purchase_date: '2022-06-10',
      purchase_price: 1200000000, // 1.2B VND
      warranty_until: '2025-06-10',
      distance_travelled: 25000,
      status_enum: VEHICLE_STATUS.MAINTENANCE,
      verification_status_enum: VEHICLE_VERIFICATION_STATUS.VERIFIED,
      location_latitude: 10.768239,
      location_longitude: 106.681885,
      created_by: 1,
      fund_id: 2
    },
    {
      id: 3,
      name: 'VinFast VF8 2024',
      description: 'SUV điện của Việt Nam',
      brand: 'VinFast',
      model: 'VF8',
      year: 2024,
      vin: '2VFVF8AAXP0000123',
      license_plate: '51F-99999',
      color: 'Xanh',
      battery_capacity: 87.7, // kWh
      range_km: 450,
      purchase_date: '2024-03-01',
      purchase_price: 1800000000, // 1.8B VND
      warranty_until: '2029-03-01',
      distance_travelled: 5000,
      status_enum: VEHICLE_STATUS.AVAILABLE,
      verification_status_enum: VEHICLE_VERIFICATION_STATUS.PENDING,
      location_latitude: null,
      location_longitude: null,
      created_by: 2,
      fund_id: 1
    }
  ]);

  React.useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await staffApi.vehicles.getAll();
      setVehicles(response.data || []);
    } catch (err) {
      setError('Không thể tải dữ liệu xe từ database');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'maintenance': return 'Bảo trì';
      case 'inactive': return 'Ngừng hoạt động';
      default: return status;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quản lý nhóm xe
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Theo dõi, kiểm tra và cập nhật trạng thái xe trong hệ thống
                </Typography>
              </Box>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <DirectionsCar sx={{ fontSize: 30 }} />
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
                  Đang hoạt động
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {vehicles.filter(v => v.status === 'active').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
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
                  Bảo trì
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Build sx={{ fontSize: 30 }} />
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
                  Ngừng hoạt động
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {vehicles.filter(v => v.status === 'inactive').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'default.main', width: 56, height: 56 }}>
                <Warning sx={{ fontSize: 30 }} />
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
                  Tổng số xe
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {vehicles.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <DirectionsCar sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<DirectionsCar />} label="Danh sách xe" />
            <Tab icon={<Build />} label="Bảo trì" />
            <Tab icon={<Verified />} label="Kiểm tra VIN" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Danh sách xe ({vehicles.length})
                </Typography>
                <Grid container spacing={2}>
                  {vehicles.map((vehicle) => (
                    <Grid item xs={12} md={4} key={vehicle.id}>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: getVehicleStatusColor(vehicle.status_enum) }}>
                              <DirectionsCar />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {formatVehicleName(vehicle)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {vehicle.license_plate} • VIN: {vehicle.vin}
                              </Typography>
                            </Box>
                            <Chip
                              label={getVehicleStatusLabel(vehicle.status_enum)}
                              sx={{
                                backgroundColor: getVehicleStatusColor(vehicle.status_enum),
                                color: 'white'
                              }}
                              size="small"
                            />
                          </Box>

                          {/* Enhanced vehicle info with new DB fields */}
                          <Divider sx={{ my: 1 }} />

                          {/* Basic specs */}
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Speed sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDistance(vehicle.distance_travelled)}
                            </Typography>
                            {vehicle.battery_capacity && (
                              <>
                                <Battery90 sx={{ fontSize: 18, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {formatBatteryCapacity(vehicle.battery_capacity)}
                                </Typography>
                              </>
                            )}
                          </Box>

                          {/* Range and warranty */}
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <LocalGasStation sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              Tầm hoạt động: {formatRange(vehicle.range_km)}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              Bảo hành: {formatWarranty(vehicle.warranty_until)}
                            </Typography>
                          </Box>

                          {/* Location if available */}
                          {hasLocation(vehicle) && (
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Place sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                Vị trí: {formatLocation(vehicle)}
                              </Typography>
                            </Box>
                          )}

                          {/* Verification status */}
                          <Box display="flex" alignItems="center" gap={1} mt={2}>
                            <Verified sx={{
                              fontSize: 16,
                              color: getVerificationStatusColor(vehicle.verification_status_enum)
                            }} />
                            <Typography
                              variant="caption"
                              sx={{ color: getVerificationStatusColor(vehicle.verification_status_enum) }}
                            >
                              {getVerificationStatusLabel(vehicle.verification_status_enum)}
                            </Typography>
                          </Box>

                          {/* Action buttons */}
                          <Stack direction="row" spacing={1} mt={2}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setDetailDialogOpen(true);
                              }}
                            >
                              Chi tiết
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<Verified />}
                              disabled={vehicle.verification_status_enum === VEHICLE_VERIFICATION_STATUS.VERIFIED}
                            >
                              {vehicle.verification_status_enum === VEHICLE_VERIFICATION_STATUS.VERIFIED ? 'Đã xác minh' : 'Xác minh'}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {selectedTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Lịch sử bảo trì
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Build sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Tính năng đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý lịch sử bảo trì, cập nhật trạng thái bảo trì xe
                  </Typography>
                </Paper>
              </Box>
            )}

            {selectedTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Kiểm tra VIN
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Verified sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Tính năng đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kiểm tra thông tin VIN, xác thực nguồn gốc xe
                  </Typography>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Edit color="primary" />
            Sửa thông tin xe
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVehicle && (
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Tên xe"
                value={selectedVehicle.name}
                disabled
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Biển số xe"
                    value={selectedVehicle.license_plate}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="VIN"
                    value={selectedVehicle.vin}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Hãng xe"
                    value={selectedVehicle.brand}
                    disabled
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Dòng xe"
                    value={selectedVehicle.model}
                    disabled
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Năm sản xuất"
                    value={selectedVehicle.year}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Màu sắc"
                    value={selectedVehicle.color}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Dung lượng pin/Động cơ"
                    value={selectedVehicle.battery_capacity ? formatBatteryCapacity(selectedVehicle.battery_capacity) : 'Xe xăng'}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tầm hoạt động"
                    value={formatRange(selectedVehicle.range_km)}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Quãng đường đã đi"
                    value={formatDistance(selectedVehicle.distance_travelled)}
                    disabled
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Ngày mua"
                    value={new Date(selectedVehicle.purchase_date).toLocaleDateString('vi-VN')}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Giá mua"
                    value={`${(selectedVehicle.purchase_price / 1000000).toLocaleString()} triệu VND`}
                    disabled
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Bảo hành"
                value={formatWarranty(selectedVehicle.warranty_until)}
                disabled
              />

              {hasLocation(selectedVehicle) && (
                <TextField
                  fullWidth
                  label="Vị trí hiện tại"
                  value={formatLocation(selectedVehicle)}
                  disabled
                />
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={selectedVehicle.status_enum}
                      disabled
                    >
                      {Object.entries(VEHICLE_STATUS).map(([key, value]) => (
                        <MenuItem key={value} value={value}>
                          {getVehicleStatusLabel(value)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Xác minh</InputLabel>
                    <Select
                      value={selectedVehicle.verification_status_enum}
                      disabled
                    >
                      {Object.entries(VEHICLE_VERIFICATION_STATUS).map(([key, value]) => (
                        <MenuItem key={value} value={value}>
                          {getVerificationStatusLabel(value)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả"
                value={selectedVehicle.description || 'Không có mô tả'}
                disabled
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          <Button variant="contained" color="primary">Lưu thay đổi</Button>
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