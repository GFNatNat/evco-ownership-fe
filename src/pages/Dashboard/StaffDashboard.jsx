import React from 'react';
import {
  Typography, Grid, Card, CardContent, Box, Avatar, Chip, Paper,
  LinearProgress, List, ListItem, ListItemText, ListItemAvatar, Divider,
  Button, IconButton, Tooltip, Stack, Badge
} from '@mui/material';
import {
  DirectionsCar, Assignment, Build, CheckCircle, Schedule, Warning,
  Person, LocalGasStation, Speed, Notifications, TrendingUp,
  ArrowUpward, ArrowDownward, Visibility, QrCodeScanner
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for staff analytics
  const [stats] = React.useState({
    checkInsToday: 12,
    checkOutsToday: 8,
    pendingCheckIns: 4,
    activeServices: 5,
    completedServices: 18,
    pendingServices: 3,
    vehiclesInMaintenance: 2,
    totalVehicles: 45,
    notifications: 7
  });

  const [todayBookings] = React.useState([
    {
      id: 'BK001',
      customerName: 'Nguyễn Văn A',
      vehicle: 'Honda City 2023',
      plate: '29A-12345',
      time: '09:00',
      type: 'check-in',
      status: 'pending'
    },
    {
      id: 'BK002',
      customerName: 'Trần Thị B',
      vehicle: 'Toyota Camry 2022',
      plate: '30B-67890',
      time: '10:30',
      type: 'check-out',
      status: 'pending'
    },
    {
      id: 'BK003',
      customerName: 'Lê Văn C',
      vehicle: 'Mazda CX-5',
      plate: '31C-54321',
      time: '14:00',
      type: 'check-in',
      status: 'pending'
    }
  ]);

  const [activeServiceRequests] = React.useState([
    {
      id: 'SV001',
      vehicle: 'Honda City 29A-12345',
      service: 'Bảo dưỡng định kỳ',
      status: 'in-progress',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'SV002',
      vehicle: 'Toyota Camry 30B-67890',
      service: 'Thay dầu động cơ',
      status: 'in-progress',
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'SV003',
      vehicle: 'Mazda CX-5 31C-54321',
      service: 'Rửa xe',
      status: 'pending',
      startTime: null
    }
  ]);

  const [systemNotifications] = React.useState([
    { id: 1, message: 'Xe 29A-12345 cần bảo trì trong 3 ngày', priority: 'high', unread: true },
    { id: 2, message: 'Hợp đồng CT004 cần xác nhận', priority: 'medium', unread: true },
    { id: 3, message: 'Tranh chấp DP005 đã được giải quyết', priority: 'low', unread: false }
  ]);

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Xin chào, {user?.name || 'Staff'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Tổng quan công việc hôm nay
                </Typography>
              </Box>
              <Badge badgeContent={stats.notifications} color="error">
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Notifications sx={{ fontSize: 30 }} />
                </Avatar>
              </Badge>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Check-ins */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CheckCircle sx={{ fontSize: 30 }} />
              </Avatar>
              <Badge badgeContent={stats.pendingCheckIns} color="warning">
                <Chip label="Hôm nay" color="primary" size="small" />
              </Badge>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Check-in/Check-out
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.checkInsToday + stats.checkOutsToday}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.checkInsToday} check-in • {stats.checkOutsToday} check-out
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Services */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <Build sx={{ fontSize: 30 }} />
              </Avatar>
              <Badge badgeContent={stats.pendingServices} color="warning">
                <Chip label="Đang xử lý" color="primary" size="small" />
              </Badge>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Dịch vụ
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.activeServices}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.completedServices} đã hoàn thành hôm nay
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Maintenance */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <DirectionsCar sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Xe bảo trì
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.vehiclesInMaintenance}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng {stats.totalVehicles} xe trong hệ thống
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Notifications */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                <Notifications sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Thông báo
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.notifications}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {systemNotifications.filter(n => n.unread).length} chưa đọc
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Today's Bookings */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Check-in/Check-out hôm nay
            </Typography>
            <List>
              {todayBookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: booking.type === 'check-in' ? 'success.main' : 'info.main'
                      }}>
                        <QrCodeScanner />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${booking.customerName} - ${booking.vehicle}`}
                      secondary={`${booking.plate} • ${booking.time}`}
                    />
                    <Chip
                      label={booking.type === 'check-in' ? 'Check-in' : 'Check-out'}
                      color={booking.type === 'check-in' ? 'success' : 'info'}
                      size="small"
                    />
                  </ListItem>
                  {index < todayBookings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/staff/checkinout')}>
              Xem tất cả
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Active Services */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dịch vụ đang thực hiện
            </Typography>
            <List>
              {activeServiceRequests.map((service, index) => (
                <React.Fragment key={service.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: service.status === 'in-progress' ? 'info.main' : 'warning.main'
                      }}>
                        <Build />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${service.vehicle} - ${service.service}`}
                      secondary={service.startTime ?
                        `Bắt đầu: ${service.startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` :
                        'Chưa bắt đầu'}
                    />
                    <Chip
                      label={service.status === 'in-progress' ? 'Đang xử lý' : 'Chờ xử lý'}
                      color={service.status === 'in-progress' ? 'info' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                  {index < activeServiceRequests.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/staff/services')}>
              Xem tất cả dịch vụ
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* System Notifications */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông báo hệ thống
            </Typography>
            <List>
              {systemNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: notification.priority === 'high' ? 'error.main' :
                          notification.priority === 'medium' ? 'warning.main' : 'info.main'
                      }}>
                        <Notifications />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.priority === 'high' ? 'Ưu tiên cao' :
                        notification.priority === 'medium' ? 'Ưu tiên trung bình' : 'Thông tin'}
                      primaryTypographyProps={{ fontWeight: notification.unread ? 'bold' : 'normal' }}
                    />
                    {notification.unread && <Chip label="Mới" color="primary" size="small" />}
                  </ListItem>
                  {index < systemNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hành động nhanh
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              <Button variant="contained" startIcon={<QrCodeScanner />} onClick={() => navigate('/staff/checkinout')}>
                Check-in/Check-out
              </Button>
              <Button variant="contained" startIcon={<Build />} onClick={() => navigate('/staff/services')}>
                Quản lý dịch vụ
              </Button>
              <Button variant="contained" startIcon={<Assignment />} onClick={() => navigate('/staff/contracts')}>
                Quản lý hợp đồng
              </Button>
              <Button variant="outlined" startIcon={<DirectionsCar />} onClick={() => navigate('/staff/fleet')}>
                Quản lý xe
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}