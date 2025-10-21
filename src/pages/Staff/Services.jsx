
import React from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Chip, Avatar, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab,
  Paper, Divider, IconButton, Tooltip, Snackbar, Alert
} from '@mui/material';
import {
  MiscellaneousServices, Add, Edit, Delete, CheckCircle, HourglassEmpty, Block
} from '@mui/icons-material';
import serviceApi from '../../api/serviceApi';
import { useAuth } from '../../context/AuthContext';

export default function Services() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [services, setServices] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  // Mock data for demo
  const [mockData] = React.useState([
    {
      id: 1,
      name: 'Bảo dưỡng định kỳ',
      price: 500000,
      status: 'active',
      description: 'Bảo dưỡng xe định kỳ, kiểm tra tổng thể',
    },
    {
      id: 2,
      name: 'Thay dầu động cơ',
      price: 350000,
      status: 'active',
      description: 'Thay dầu động cơ, kiểm tra lọc dầu',
    },
    {
      id: 3,
      name: 'Sửa chữa hệ thống điện',
      price: 1200000,
      status: 'inactive',
      description: 'Sửa chữa, thay thế linh kiện hệ thống điện',
    },
    {
      id: 4,
      name: 'Rửa xe',
      price: 80000,
      status: 'active',
      description: 'Rửa xe, làm sạch nội ngoại thất',
    }
  ]);

  React.useEffect(() => {
    setServices(mockData);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Ngừng';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quản lý dịch vụ
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Theo dõi, cập nhật và quản lý các dịch vụ xe
                </Typography>
              </Box>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <MiscellaneousServices sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Dịch vụ hoạt động
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {services.filter(s => s.status === 'active').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CheckCircle sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Dịch vụ ngừng
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {services.filter(s => s.status === 'inactive').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'default.main', width: 56, height: 56 }}>
                <Block sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Tổng số dịch vụ
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {services.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <MiscellaneousServices sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<MiscellaneousServices />} label="Danh sách dịch vụ" />
            <Tab icon={<HourglassEmpty />} label="Chờ duyệt" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" gutterBottom>
                    Danh sách dịch vụ ({services.length})
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setAddDialogOpen(true)}>
                    Thêm dịch vụ
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {services.map((service) => (
                    <Grid item xs={12} md={6} key={service.id}>
                      <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: getStatusColor(service.status) }}>
                              <MiscellaneousServices />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {service.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.description}
                              </Typography>
                            </Box>
                            <Chip label={getStatusLabel(service.status)} color={getStatusColor(service.status)} size="small" />
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="caption" color="text.secondary">
                              Giá: {service.price.toLocaleString()}đ
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} mt={2}>
                            <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => { setSelectedService(service); setDetailDialogOpen(true); }}>
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
                  Dịch vụ chờ duyệt
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <HourglassEmpty sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Tính năng đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý dịch vụ chờ duyệt, cập nhật trạng thái dịch vụ
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
            Sửa thông tin dịch vụ
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Tên dịch vụ"
                value={selectedService.name}
                disabled
              />
              <TextField
                fullWidth
                label="Giá"
                type="number"
                value={selectedService.price}
                disabled
              />
              <TextField
                fullWidth
                label="Mô tả"
                value={selectedService.description}
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

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Add color="primary" />
            Thêm dịch vụ mới
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField fullWidth label="Tên dịch vụ" />
            <TextField fullWidth label="Giá" type="number" />
            <TextField fullWidth label="Mô tả" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="primary">Thêm</Button>
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