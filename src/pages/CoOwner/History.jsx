import React from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Stack, Chip, Paper,
  Avatar, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, IconButton, Tooltip,
  FormControl, InputLabel, Select, MenuItem, DatePicker,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import {
  TrendingUp, TrendingDown, DirectionsCar, Schedule, Payment,
  Assessment, History, PieChart, BarChart, Download, Share,
  FilterList, CalendarToday, Visibility, Receipt, CompareArrows,
  Group, Person
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart as RechartsBarChart,
  Bar, Area, AreaChart
} from 'recharts';
import coOwnerApi from '../../api/coOwnerApi';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function History() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [selectedPeriod, setSelectedPeriod] = React.useState('6months');
  const [loading, setLoading] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  // Mock data - replace with real API calls
  const [historyData, setHistoryData] = React.useState({
    overview: {
      totalUsageHours: 156,
      totalDistance: 2400,
      totalCost: 3200000,
      averageRating: 4.5,
      growthPercent: 12.5
    },
    usageChart: [
      { month: 'T5', hours: 20, distance: 300, cost: 450000 },
      { month: 'T6', hours: 25, distance: 380, cost: 520000 },
      { month: 'T7', hours: 30, distance: 420, cost: 640000 },
      { month: 'T8', hours: 22, distance: 350, cost: 480000 },
      { month: 'T9', hours: 28, distance: 450, cost: 580000 },
      { month: 'T10', hours: 31, distance: 500, cost: 620000 }
    ],
    ownershipDistribution: [
      { name: 'Bạn', value: 25, color: '#0088FE', email: user?.email || 'you@example.com', joinDate: '2025-01-15', role: 'Owner' },
      { name: 'Nguyễn Văn A', value: 25, color: '#00C49F', email: 'nguyenvana@example.com', joinDate: '2025-01-15', role: 'Co-Owner' },
      { name: 'Trần Thị B', value: 25, color: '#FFBB28', email: 'tranthib@example.com', joinDate: '2025-02-01', role: 'Co-Owner' },
      { name: 'Lê Văn C', value: 25, color: '#FF8042', email: 'levanc@example.com', joinDate: '2025-02-15', role: 'Co-Owner' }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'usage',
        description: 'Sử dụng xe đi Đà Lạt',
        date: new Date(Date.now() - 86400000),
        duration: '4 giờ',
        distance: '120 km',
        cost: 180000,
        status: 'completed'
      },
      {
        id: 2,
        type: 'payment',
        description: 'Thanh toán phí bảo trì',
        date: new Date(Date.now() - 172800000),
        amount: 500000,
        status: 'completed'
      },
      {
        id: 3,
        type: 'booking',
        description: 'Đặt lịch sử dụng cuối tuần',
        date: new Date(Date.now() - 259200000),
        startTime: '08:00',
        endTime: '18:00',
        status: 'confirmed'
      }
    ]
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'usage': return <DirectionsCar color="primary" />;
      case 'payment': return <Payment color="success" />;
      case 'booking': return <Schedule color="info" />;
      default: return <Receipt />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'confirmed': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Grid container spacing={3}>
      {/* Header with Overview Stats */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Lịch sử & Phân tích
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Theo dõi hoạt động sử dụng và phân tích hiệu quả đầu tư
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Xuất báo cáo
                </Button>
                <IconButton sx={{ color: 'white' }}>
                  <Share />
                </IconButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Key Metrics */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Tổng giờ sử dụng
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {historyData.overview.totalUsageHours}
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUp color="success" sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    +{historyData.overview.growthPercent}% so với tháng trước
                  </Typography>
                </Box>
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
                  Quãng đường
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {historyData.overview.totalDistance.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  km
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
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
                  Chi phí
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {Math.round(historyData.overview.totalCost / 1000000)}M
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  VNĐ
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <Payment sx={{ fontSize: 30 }} />
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
                  Đánh giá TB
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {historyData.overview.averageRating}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  / 5 sao
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Assessment sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content Tabs */}
      <Grid item xs={12}>
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab icon={<History />} label="Xu hướng sử dụng" />
              <Tab icon={<PieChart />} label="Phân tích sở hữu" />
              <Tab icon={<BarChart />} label="So sánh hiệu suất" />
              <Tab icon={<Receipt />} label="Lịch sử hoạt động" />
              <Tab icon={<Group />} label="Nhóm" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
                  <Typography variant="h6">Xu hướng sử dụng theo thời gian</Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Thời gian</InputLabel>
                    <Select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                      <MenuItem value="3months">3 tháng</MenuItem>
                      <MenuItem value="6months">6 tháng</MenuItem>
                      <MenuItem value="1year">1 năm</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData.usageChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value, name) => [
                          name === 'hours' ? `${value} giờ` :
                            name === 'distance' ? `${value} km` :
                              formatCurrency(value),
                          name === 'hours' ? 'Giờ sử dụng' :
                            name === 'distance' ? 'Quãng đường' : 'Chi phí'
                        ]}
                      />
                      <Area type="monotone" dataKey="hours" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="distance" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}

            {selectedTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Tỷ lệ sở hữu hiện tại</Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={historyData.ownershipDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                        >
                          {historyData.ownershipDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Chi tiết sở hữu</Typography>
                  <Stack spacing={2}>
                    {historyData.ownershipDistribution.map((owner, index) => (
                      <Paper key={index} sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: owner.color }}>
                              {owner.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">{owner.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Thành viên từ 01/2025
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="h6" color="primary">
                              {owner.value}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={owner.value}
                              sx={{ width: 100, mt: 1 }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            )}

            {selectedTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>So sánh hiệu suất sử dụng</Typography>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={historyData.usageChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="hours" fill="#8884d8" name="Giờ sử dụng" />
                      <Bar dataKey="distance" fill="#82ca9d" name="Quãng đường (km)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}

            {selectedTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>Lịch sử hoạt động gần đây</Typography>
                <List>
                  {historyData.recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedRecord(activity);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>{getActivityIcon(activity.type)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1">
                                {activity.description}
                              </Typography>
                              <Chip
                                size="small"
                                label={activity.status}
                                color={getStatusColor(activity.status)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.date.toLocaleDateString('vi-VN')}
                              </Typography>
                              {activity.duration && (
                                <Typography variant="caption">
                                  Thời gian: {activity.duration} • Quãng đường: {activity.distance}
                                </Typography>
                              )}
                              {activity.amount && (
                                <Typography variant="caption">
                                  Số tiền: {formatCurrency(activity.amount)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <IconButton>
                          <Visibility />
                        </IconButton>
                      </ListItem>
                      {index < historyData.recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {selectedTab === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>Thành viên nhóm đồng sở hữu</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Danh sách các thành viên và tỷ lệ sở hữu trong nhóm
                </Typography>

                <Grid container spacing={2}>
                  {historyData.ownershipDistribution.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                            <Avatar
                              sx={{
                                bgcolor: member.color,
                                width: 80,
                                height: 80,
                                fontSize: '2rem',
                                mb: 2
                              }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </Avatar>

                            <Typography variant="h6" gutterBottom>
                              {member.name}
                            </Typography>

                            <Chip
                              label={member.role}
                              color={member.role === 'Owner' ? 'primary' : 'default'}
                              size="small"
                              sx={{ mb: 2 }}
                            />

                            <Box sx={{ width: '100%', mb: 2 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="body2" color="text.secondary">
                                  Tỷ lệ sở hữu
                                </Typography>
                                <Typography variant="h6" color="primary" fontWeight="bold">
                                  {member.value}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={member.value}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: 'grey.200',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: member.color,
                                    borderRadius: 4
                                  }
                                }}
                              />
                            </Box>

                            <Divider sx={{ width: '100%', my: 1 }} />

                            <Box sx={{ width: '100%', textAlign: 'left' }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                <strong>Email:</strong> {member.email}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                <strong>Tham gia:</strong> {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Group Summary */}
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Thống kê nhóm
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign="center">
                          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                            <Person sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Typography variant="h4" color="primary" fontWeight="bold">
                            {historyData.ownershipDistribution.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tổng thành viên
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign="center">
                          <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                            <PieChart sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            {historyData.ownershipDistribution.reduce((sum, m) => sum + m.value, 0)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tổng tỷ lệ sở hữu
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box textAlign="center">
                          <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                            <DirectionsCar sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Typography variant="h4" color="info.main" fontWeight="bold">
                            1
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Xe đang sở hữu
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết hoạt động</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Stack spacing={2}>
              <Typography variant="h6">{selectedRecord.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                Ngày: {selectedRecord.date.toLocaleDateString('vi-VN')}
              </Typography>
              {selectedRecord.duration && (
                <Typography>Thời gian sử dụng: {selectedRecord.duration}</Typography>
              )}
              {selectedRecord.distance && (
                <Typography>Quãng đường: {selectedRecord.distance}</Typography>
              )}
              {selectedRecord.cost && (
                <Typography>Chi phí: {formatCurrency(selectedRecord.cost)}</Typography>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}