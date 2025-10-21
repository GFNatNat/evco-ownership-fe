import React from 'react';
import {
  Typography, Grid, Card, CardContent, Box, Avatar, Chip, Paper,
  LinearProgress, List, ListItem, ListItemText, ListItemAvatar, Divider,
  Button, IconButton, Tooltip
} from '@mui/material';
import {
  People, Group, AttachMoney, TrendingUp, Warning, CheckCircle,
  DirectionsCar, Assignment, ReportProblem, ArrowUpward, ArrowDownward,
  Visibility, Settings
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for analytics
  const [stats] = React.useState({
    totalUsers: 1245,
    newUsersThisMonth: 87,
    userGrowth: 12.5,
    totalGroups: 156,
    activeGroups: 142,
    groupGrowth: 8.3,
    totalRevenue: 2450000000,
    revenueThisMonth: 185000000,
    revenueGrowth: 15.2,
    totalVehicles: 324,
    activeVehicles: 298,
    vehicleUtilization: 92
  });

  const [recentActivities] = React.useState([
    {
      id: 1,
      type: 'user',
      message: 'Người dùng mới: Nguyễn Văn A đã đăng ký',
      time: '5 phút trước',
      icon: <People />
    },
    {
      id: 2,
      type: 'group',
      message: 'Nhóm "Honda City Owners" đã được tạo',
      time: '15 phút trước',
      icon: <Group />
    },
    {
      id: 3,
      type: 'dispute',
      message: 'Tranh chấp mới: DP004 cần xử lý',
      time: '30 phút trước',
      icon: <ReportProblem />
    },
    {
      id: 4,
      type: 'vehicle',
      message: 'Xe Toyota Camry 30B-67890 đã hoàn tất bảo trì',
      time: '1 giờ trước',
      icon: <DirectionsCar />
    }
  ]);

  const [alerts] = React.useState([
    { id: 1, message: '3 tranh chấp đang chờ xử lý', severity: 'warning' },
    { id: 2, message: '5 hợp đồng cần phê duyệt', severity: 'info' },
    { id: 3, message: 'Doanh thu tháng này tăng 15.2%', severity: 'success' }
  ]);

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Xin chào, {user?.name || 'Admin'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Tổng quan hệ thống quản lý sở hữu chung xe
                </Typography>
              </Box>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Settings sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Users */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <People sx={{ fontSize: 30 }} />
              </Avatar>
              <Chip
                icon={stats.userGrowth >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                label={`${Math.abs(stats.userGrowth)}%`}
                color={stats.userGrowth >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Tổng người dùng
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.totalUsers.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              +{stats.newUsersThisMonth} người dùng mới tháng này
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Groups */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <Group sx={{ fontSize: 30 }} />
              </Avatar>
              <Chip
                icon={stats.groupGrowth >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                label={`${Math.abs(stats.groupGrowth)}%`}
                color={stats.groupGrowth >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Nhóm đồng sở hữu
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.totalGroups}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.activeGroups} nhóm đang hoạt động
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Revenue */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <AttachMoney sx={{ fontSize: 30 }} />
              </Avatar>
              <Chip
                icon={stats.revenueGrowth >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                label={`${Math.abs(stats.revenueGrowth)}%`}
                color={stats.revenueGrowth >= 0 ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Doanh thu tháng này
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {(stats.revenueThisMonth / 1000000).toFixed(0)}M
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tổng: {(stats.totalRevenue / 1000000000).toFixed(1)}B VNĐ
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats - Vehicles */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <DirectionsCar sx={{ fontSize: 30 }} />
              </Avatar>
              <Chip
                label={`${stats.vehicleUtilization}%`}
                color="success"
                size="small"
              />
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Phương tiện
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stats.totalVehicles}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stats.activeVehicles} xe đang hoạt động
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* System Alerts */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cảnh báo hệ thống
            </Typography>
            <List>
              {alerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: alert.severity === 'warning' ? 'warning.main' :
                          alert.severity === 'info' ? 'info.main' : 'success.main'
                      }}>
                        {alert.severity === 'warning' ? <Warning /> :
                          alert.severity === 'info' ? <Assignment /> : <CheckCircle />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={alert.message}
                      secondary={alert.severity === 'warning' ? 'Cần xử lý' : 'Thông tin'}
                    />
                    <IconButton edge="end" onClick={() => navigate(alert.severity === 'warning' ? '/admin/disputes' : '/admin/reports')}>
                      <Visibility />
                    </IconButton>
                  </ListItem>
                  {index < alerts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hoạt động gần đây
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
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
              <Button variant="contained" startIcon={<People />} onClick={() => navigate('/admin/users')}>
                Quản lý người dùng
              </Button>
              <Button variant="contained" startIcon={<Group />} onClick={() => navigate('/admin/groups')}>
                Quản lý nhóm
              </Button>
              <Button variant="contained" startIcon={<DirectionsCar />} onClick={() => navigate('/admin/fleet')}>
                Quản lý xe
              </Button>
              <Button variant="contained" startIcon={<Assignment />} onClick={() => navigate('/admin/reports')}>
                Xem báo cáo
              </Button>
              <Button variant="outlined" startIcon={<Settings />} onClick={() => navigate('/admin/settings')}>
                Cài đặt
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}