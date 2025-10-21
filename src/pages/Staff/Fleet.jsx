
import React from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Chip, Avatar, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab,
  Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton,
  Tooltip, Snackbar, Alert
} from '@mui/material';
import {
  DirectionsCar, Build, Verified, Edit, Delete, Add, Speed, LocalGasStation, Warning, CheckCircle
} from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';
import { useAuth } from '../../context/AuthContext';

export default function Fleet() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [vehicles, setVehicles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState(null);

  // Mock data for demo
  const [mockData] = React.useState([
    {
      id: 1,
      make: 'Honda',
      model: 'City 2023',
      vin: '1HGCM82633A123456',
      plate: '29A-12345',
      status: 'active',
      mileage: 12000,
      fuel: 80,
      lastService: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      owner: 'Nguyễn Văn A'
    },
    {
      id: 2,
      make: 'Toyota',
      model: 'Camry 2022',
      vin: '4T1BF1FK7GU123456',
      plate: '30B-67890',
      status: 'maintenance',
      mileage: 25000,
      fuel: 50,
      lastService: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      owner: 'Trần Thị B'
    },
    {
      id: 3,
      make: 'Mazda',
      model: 'CX-5',
      vin: 'JM3KFBDM7J1234567',
      plate: '31C-54321',
      status: 'inactive',
      mileage: 5000,
      fuel: 100,
      lastService: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      owner: 'Lê Văn C'
    }
  ]);

  React.useEffect(() => {
    setVehicles(mockData);
  }, []);

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
                            <Avatar sx={{ bgcolor: getStatusColor(vehicle.status) }}>
                              <DirectionsCar />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {vehicle.make} {vehicle.model}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {vehicle.plate} • {vehicle.owner}
                              </Typography>
                            </Box>
                            <Chip label={getStatusLabel(vehicle.status)} color={getStatusColor(vehicle.status)} size="small" />
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box display="flex" alignItems="center" gap={2}>
                            <Speed sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {vehicle.mileage.toLocaleString()} km
                            </Typography>
                            <LocalGasStation sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {vehicle.fuel}% xăng
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Build sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              Bảo trì gần nhất: {vehicle.lastService.toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} mt={2}>
                            <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => { setSelectedVehicle(vehicle); setDetailDialogOpen(true); }}>
                              Sửa
                            </Button>
                            <Button size="small" variant="contained" color="error" startIcon={<Delete />}>
                              Xóa
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
                label="Biển số xe"
                value={selectedVehicle.plate}
                disabled
              />
              <TextField
                fullWidth
                label="Hãng xe"
                value={selectedVehicle.make}
                disabled
              />
              <TextField
                fullWidth
                label="Dòng xe"
                value={selectedVehicle.model}
                disabled
              />
              <TextField
                fullWidth
                label="VIN"
                value={selectedVehicle.vin}
                disabled
              />
              <TextField
                fullWidth
                label="Số km"
                type="number"
                value={selectedVehicle.mileage}
                disabled
              />
              <TextField
                fullWidth
                label="Mức xăng (%)"
                type="number"
                value={selectedVehicle.fuel}
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