import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Chip, Tabs, Tab, CircularProgress, Avatar, TextField, LinearProgress } from '@mui/material';
import {
  TrendingUp, People, DirectionsCar, AttachMoney, Warning,
  PersonAdd, Settings as SettingsIcon, ExitToApp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminApi from '../../api/admin';
// import disputeApi from '../../api/disputeApi'; // Removed - use adminApi
// import vehicleApi from '../../api/vehicleApi'; // Removed - use adminApi

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 847,
    totalGroups: 124,
    activeVehicles: 89,
    revenue: 12450000,
    growthRate: 12.5,
    users: [
      { name: "Nguyễn Văn A", email: "nguyenvana@email.com", role: "CoOwner", status: "active", joined: "2 tháng trước" },
      { name: "Trần Thị B", email: "tranthib@email.com", role: "Staff", status: "active", joined: "3 tháng trước" },
      { name: "Lê Văn C", email: "levanc@email.com", role: "CoOwner", status: "inactive", joined: "1 tháng trước" }
    ],
    vehicles: [
      {
        name: "Toyota Camry Hybrid",
        licensePlate: "30A-12345",
        status: "active",
        ownership: 4,
        utilization: 85
      },
      {
        name: "Honda Accord Hybrid",
        licensePlate: "30B-67890",
        status: "maintenance",
        ownership: 3,
        utilization: 45
      },
      {
        name: "Tesla Model 3",
        licensePlate: "30C-11111",
        status: "active",
        ownership: 5,
        utilization: 92
      }
    ],
    finance: {
      totalRevenue: 12450000,
      expenses: 4200000,
      profit: 8250000,
      breakdown: [
        { category: "Phí đăng ký", amount: 5200000, percentage: 42 },
        { category: "Phí bảo dưỡng", amount: 3800000, percentage: 31 },
        { category: "Phí dịch vụ", amount: 2400000, percentage: 19 },
        { category: "Khác", amount: 1050000, percentage: 8 }
      ]
    },
    disputes: [
      {
        title: "Tranh chấp về thời gian sử dụng",
        group: "Nhóm Toyota Camry #1",
        status: "pending",
        priority: "high",
        created: "1 ngày trước"
      },
      {
        title: "Chi phí bảo dưỡng không đúng",
        group: "Nhóm Honda Accord #2",
        status: "resolved",
        priority: "medium",
        created: "3 ngày trước"
      }
    ]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API lấy thống kê dashboard
      const statsRes = await adminApi.getDashboardStats();
      const stats = statsRes?.data || {};

      // Gọi API lấy danh sách tranh chấp
      const disputesRes = await adminApi.getDisputes();
      const disputes = disputesRes?.data || [];

      // Gọi API lấy danh sách xe
      const vehiclesRes = await adminApi.getVehicles();
      const vehicles = vehiclesRes?.data || [];

      // Đếm xe đang hoạt động
      const activeVehicles = vehicles.filter(v => v.status === 'active').length;

      // Cập nhật state với data thật từ API
      setDashboardData(prev => ({
        ...prev,
        totalUsers: stats.totalUsers || prev.totalUsers,
        totalGroups: stats.totalGroups || prev.totalGroups,
        activeVehicles: activeVehicles || prev.activeVehicles,
        revenue: stats.revenue || prev.revenue,
        growthRate: stats.growthRate || prev.growthRate,
        // Giữ nguyên các field khác (users, vehicles, finance, disputes) vì là mock data chi tiết
      }));
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // This is now handled by the Layout component
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#ef4444' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Main Content */}
      <Box>
        {/* Stats Overview */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Tổng người dùng
                  </Typography>
                  <People sx={{ fontSize: 18, color: '#10b981' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {dashboardData.totalUsers.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  +{dashboardData.growthRate}% so với tháng trước
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Nhóm hoạt động
                  </Typography>
                  <People sx={{ fontSize: 18, color: '#0ea5e9' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#0ea5e9">
                  {dashboardData.totalGroups}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nhóm đồng sở hữu
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Xe hoạt động
                  </Typography>
                  <DirectionsCar sx={{ fontSize: 18, color: '#f59e0b' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                  {dashboardData.activeVehicles}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Xe điện trong hệ thống
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Doanh thu
                  </Typography>
                  <AttachMoney sx={{ fontSize: 18, color: '#10b981' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {(dashboardData.revenue / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  VNĐ trong tháng này
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Tabs */}
        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, v) => setCurrentTab(v)}
            sx={{
              '& .MuiTabs-flexContainer': {
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500
              },
              '& .Mui-selected': {
                color: '#10b981'
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#10b981'
              }
            }}
          >
            <Tab label="Tổng quan" />
            <Tab label="Người dùng" />
            <Tab label="Xe" />
            <Tab label="Tài chính" />
            <Tab label="Tranh chấp" />
          </Tabs>
        </Card>

        {/* Tab 0: Overview */}
        {currentTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Hoạt động gần đây
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid #e5e7eb',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Nhóm mới được tạo
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nhóm Toyota Camry #5 • 2 giờ trước
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid #e5e7eb',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Người dùng mới đăng ký
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nguyễn Văn D • 4 giờ trước
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid #e5e7eb',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Xe mới được thêm
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tesla Model Y • 1 ngày trước
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Thống kê nhanh
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Tỷ lệ sử dụng xe</Typography>
                        <Typography variant="body2" fontWeight={600}>78%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={78}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': { bgcolor: '#10b981' }
                        }}
                      />
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Mức độ hài lòng</Typography>
                        <Typography variant="body2" fontWeight={600}>92%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={92}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': { bgcolor: '#0ea5e9' }
                        }}
                      />
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Tỷ lệ tranh chấp</Typography>
                        <Typography variant="body2" fontWeight={600}>5%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={5}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' }
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Users */}
        {currentTab === 1 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Quản lý người dùng
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  sx={{
                    bgcolor: '#10b981',
                    textTransform: 'none',
                    boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  Thêm người dùng
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {dashboardData.users.map((userItem, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      border: '1px solid #e5e7eb',
                      borderRadius: 2
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(16, 185, 129, 0.1)' }}>
                        <People sx={{ fontSize: 20, color: '#10b981' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {userItem.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {userItem.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={userItem.role === "CoOwner" ? "Đồng sở hữu" : "Nhân viên"}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={userItem.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        size="small"
                        color={userItem.status === "active" ? "success" : "default"}
                      />
                      <Button size="small" variant="outlined">Chi tiết</Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Vehicles */}
        {currentTab === 2 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Quản lý xe
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DirectionsCar />}
                  sx={{
                    bgcolor: '#10b981',
                    textTransform: 'none',
                    boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  Thêm xe
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {dashboardData.vehicles.map((vehicle, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid #e5e7eb',
                      borderRadius: 2
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {vehicle.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Biển số: {vehicle.licensePlate} • {vehicle.ownership} đồng sở hữu
                        </Typography>
                      </Box>
                      <Chip
                        label={vehicle.status === "active" ? "Hoạt động" : "Bảo dưỡng"}
                        size="small"
                        color={vehicle.status === "active" ? "success" : "warning"}
                      />
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Tỷ lệ sử dụng
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {vehicle.utilization}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={vehicle.utilization}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: vehicle.utilization > 80 ? '#10b981' : '#f59e0b'
                          }
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Finance */}
        {currentTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Tổng quan tài chính
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        Tổng doanh thu
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="#10b981">
                        {(dashboardData.finance.totalRevenue / 1000000).toFixed(1)}M ₫
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        Chi phí
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="#ef4444">
                        {(dashboardData.finance.expenses / 1000000).toFixed(1)}M ₫
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        Lợi nhuận
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color="#0ea5e9">
                        {(dashboardData.finance.profit / 1000000).toFixed(1)}M ₫
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Phân bổ doanh thu
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {dashboardData.finance.breakdown.map((item, index) => (
                      <Box key={index}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">{item.category}</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {(item.amount / 1000000).toFixed(1)}M ₫
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            bgcolor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: index === 0 ? '#10b981' : index === 1 ? '#0ea5e9' : index === 2 ? '#f59e0b' : '#6b7280'
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tab 4: Disputes */}
        {currentTab === 4 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quản lý tranh chấp
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                {dashboardData.disputes.map((dispute, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid #e5e7eb',
                      borderRadius: 2
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {dispute.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dispute.group}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={dispute.priority === "high" ? "Cao" : "Trung bình"}
                          size="small"
                          sx={{
                            bgcolor: dispute.priority === "high" ? '#ef4444' : '#6b7280',
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                        <Chip
                          label={dispute.status === "pending" ? "Chưa xử lý" : "Đã giải quyết"}
                          size="small"
                          color={dispute.status === "pending" ? "warning" : "success"}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Được tạo {dispute.created}
                      </Typography>
                      <Button
                        size="small"
                        variant={dispute.status === "pending" ? "contained" : "outlined"}
                        sx={dispute.status === "pending" ? {
                          bgcolor: '#10b981',
                          '&:hover': { bgcolor: '#059669' }
                        } : {}}
                      >
                        {dispute.status === "pending" ? "Xử lý ngay" : "Xem chi tiết"}
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
