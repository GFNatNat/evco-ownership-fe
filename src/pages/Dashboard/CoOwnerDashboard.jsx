import React from 'react';
import {
  Typography, Grid, Card, CardContent, Box, Avatar, Chip, Paper,
  LinearProgress, List, ListItem, ListItemText, ListItemAvatar, Divider,
  Button, IconButton, Tooltip, Stack
} from '@mui/material';
import {
  DirectionsCar, Payment, Schedule, History, AttachMoney, TrendingUp,
  Warning, CheckCircle, Group, Person, CalendarToday, Notifications,
  ArrowUpward, ArrowDownward, Visibility
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CoOwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for co-owner analytics
  const [stats] = React.useState({
    totalUsage: 45,
    usageThisMonth: 8,
    usageGrowth: -5.2,
    totalCost: 12500000,
    costThisMonth: 2100000,
    costGrowth: 8.5,
    nextBooking: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    vehicleShares: 2,
    groupMembers: 4
  });

  const [upcomingSchedule] = React.useState([
    {
      id: 1,
      vehicle: 'Honda City 2023',
      plate: '29A-12345',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '09:00 - 12:00',
      status: 'confirmed'
    },
    {
      id: 2,
      vehicle: 'Toyota Camry 2022',
      plate: '30B-67890',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '14:00 - 18:00',
      status: 'pending'
    }
  ]);

  const [recentPayments] = React.useState([
    {
      id: 1,
      description: 'Phí bảo trì xe Honda City',
      amount: 500000,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'paid'
    },
    {
      id: 2,
      description: 'Phí sử dụng tháng 10',
      amount: 1600000,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'paid'
    },
    {
      id: 3,
      description: 'Phí bảo hiểm',
      amount: 800000,
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'pending'
    }
  ]);

  const [notifications] = React.useState([
    { id: 1, message: 'Lịch đặt xe của bạn đã được xác nhận', time: '2 giờ trước', unread: true },
    { id: 2, message: 'Phí bảo trì tháng 11 sắp đến hạn', time: '1 ngày trước', unread: true },
    { id: 3, message: 'Cuộc họp nhóm vào 25/10', time: '2 ngày trước', unread: false }
  ]);

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Xin chào, {user?.name || 'Đồng sở hữu'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Tổng quan tài khoản sở hữu chung của bạn
                </Typography>
              </Box>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Person sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Usage */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <History sx={{ fontSize: 30 }} />
              </Avatar>
              <Chip
                icon={stats.usageGrowth >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                label={`${Math.abs(stats.usageGrowth)}%`}
                color={stats.usageGrowth >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Lịch sử sử dụng
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.totalUsage} lần
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.usageThisMonth} lần tháng này
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Cost */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <AttachMoney sx={{ fontSize: 30 }} />
              </Avatar>
              <Chip
                icon={stats.costGrowth >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                label={`${Math.abs(stats.costGrowth)}%`}
                color={stats.costGrowth >= 0 ? 'warning' : 'success'}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Chi phí tháng này
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {(stats.costThisMonth / 1000000).toFixed(1)}M
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng: {(stats.totalCost / 1000000).toFixed(1)}M VNĐ
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Next Booking */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CalendarToday sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Lịch đặt xe tiếp theo
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.nextBooking.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {upcomingSchedule[0]?.time || 'Chưa có lịch'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Groups */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <Group sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Nhóm đồng sở hữu
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.vehicleShares}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.groupMembers} thành viên
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Schedule */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Lịch đặt xe sắp tới
            </Typography>
            <List>
              {upcomingSchedule.map((schedule, index) => (
                <React.Fragment key={schedule.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: schedule.status === 'confirmed' ? 'success.main' : 'warning.main' }}>
                        <DirectionsCar />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${schedule.vehicle} (${schedule.plate})`}
                      secondary={`${schedule.date.toLocaleDateString('vi-VN')} • ${schedule.time}`}
                    />
                    <Chip
                      label={schedule.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                      color={schedule.status === 'confirmed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                  {index < upcomingSchedule.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/coowner/schedule')}>
              Xem tất cả lịch đặt
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Payments */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thanh toán gần đây
            </Typography>
            <List>
              {recentPayments.map((payment, index) => (
                <React.Fragment key={payment.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: payment.status === 'paid' ? 'success.main' : 'warning.main' }}>
                        <Payment />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={payment.description}
                      secondary={payment.date.toLocaleDateString('vi-VN')}
                    />
                    <Box textAlign="right">
                      <Typography variant="body2" fontWeight="bold">
                        {payment.amount.toLocaleString()}đ
                      </Typography>
                      <Chip
                        label={payment.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        color={payment.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </ListItem>
                  {index < recentPayments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/coowner/payments')}>
              Xem tất cả thanh toán
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Notifications */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông báo
            </Typography>
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: notification.unread ? 'primary.main' : 'grey.400' }}>
                        <Notifications />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.time}
                      primaryTypographyProps={{ fontWeight: notification.unread ? 'bold' : 'normal' }}
                    />
                    {notification.unread && <Chip label="Mới" color="primary" size="small" />}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
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
              <Button variant="contained" startIcon={<Schedule />} onClick={() => navigate('/coowner/schedule')}>
                Đặt lịch xe
              </Button>
              <Button variant="contained" startIcon={<Payment />} onClick={() => navigate('/coowner/payments')}>
                Thanh toán
              </Button>
              <Button variant="contained" startIcon={<History />} onClick={() => navigate('/coowner/history')}>
                Lịch sử sử dụng
              </Button>
              <Button variant="outlined" startIcon={<Group />} onClick={() => navigate('/coowner/group')}>
                Nhóm của tôi
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}