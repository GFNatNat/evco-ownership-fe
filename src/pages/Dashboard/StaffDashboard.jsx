import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Chip, Tabs, Tab, CircularProgress, Avatar } from '@mui/material';
import {
  Warning, CheckCircle, Build, QrCode, Description, DirectionsCar,
  FiberManualRecord, Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import disputeApi from '../../api/disputeApi';
import vehicleApi from '../../api/vehicleApi';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    pendingVerifications: 8,
    activeDisputes: 3,
    vehiclesInService: 2,
    completedToday: 12,
    documents: [
      { user: "Nguyễn Văn X", type: "GPLX", status: "pending", uploaded: "2 giờ trước" },
      { user: "Trần Thị Y", type: "CCCD", status: "pending", uploaded: "5 giờ trước" },
      { user: "Lê Văn Z", type: "Hợp đồng", status: "reviewing", uploaded: "1 ngày trước" }
    ],
    checkInActivities: [
      { user: "Nguyễn Văn A", action: "Check-out", vehicle: "Toyota Camry", time: "30 phút trước" },
      { user: "Trần Thị B", action: "Check-in", vehicle: "Honda Accord", time: "2 giờ trước" }
    ],
    disputes: [
      {
        title: "Tranh chấp về thời gian sử dụng",
        reporter: "Nguyễn Văn A",
        priority: "high",
        created: "1 ngày trước",
        description: "Thành viên B sử dụng xe quá giờ quy định"
      },
      {
        title: "Chi phí bảo dưỡng không đúng",
        reporter: "Trần Thị C",
        priority: "medium",
        created: "2 ngày trước",
        description: "Yêu cầu làm rõ chi phí thay lốp xe"
      }
    ],
    maintenance: [
      {
        vehicle: "Toyota Camry Hybrid",
        service: "Thay dầu động cơ",
        status: "in-progress",
        scheduled: "Hôm nay 10:00",
        estimatedCost: "500,000₫"
      },
      {
        vehicle: "Honda Accord Hybrid",
        service: "Kiểm tra pin",
        status: "scheduled",
        scheduled: "Ngày mai 14:00",
        estimatedCost: "300,000₫"
      },
      {
        vehicle: "Tesla Model 3",
        service: "Thay lốp xe",
        status: "completed",
        scheduled: "Hôm qua 15:00",
        estimatedCost: "2,000,000₫"
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

      // Gọi API lấy danh sách tranh chấp
      const disputesRes = await disputeApi.list({ status: 'pending' });
      const disputes = disputesRes?.data || [];

      // Gọi API lấy danh sách xe
      const vehiclesRes = await vehicleApi.getAll();
      const vehicles = vehiclesRes?.data || [];

      // Lọc xe đang bảo dưỡng
      const vehiclesInService = vehicles.filter(v => v.status === 'maintenance').length;

      // Cập nhật state với data thật
      setDashboardData(prev => ({
        ...prev,
        activeDisputes: disputes.length || prev.activeDisputes,
        vehiclesInService: vehiclesInService || prev.vehiclesInService,
        // Giữ nguyên các field khác vì chưa có API tương ứng
      }));
    } catch (err) {
      console.error('Error fetching staff dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <DirectionsCar sx={{ fontSize: 32, color: '#10b981' }} />
                <Typography variant="h5" fontWeight="bold" sx={{
                  background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  EV Share
                </Typography>
              </Box>
              <Chip label="Nhân viên" size="small" variant="outlined" />
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                {user?.name || 'Nguyễn Thị Staff'}
              </Typography>
              <Button variant="outlined" size="small" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 3 }}>
        {/* Stats Overview */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Chờ xác thực
                  </Typography>
                  <Warning sx={{ fontSize: 18, color: '#f59e0b' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                  {dashboardData.pendingVerifications}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tài liệu cần duyệt
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Tranh chấp
                  </Typography>
                  <Warning sx={{ fontSize: 18, color: '#ef4444' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#ef4444">
                  {dashboardData.activeDisputes}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cần xử lý
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Xe bảo dưỡng
                  </Typography>
                  <Build sx={{ fontSize: 18, color: '#0ea5e9' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#0ea5e9">
                  {dashboardData.vehiclesInService}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Đang thực hiện
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="caption" fontWeight={500} color="text.secondary">
                    Hoàn thành hôm nay
                  </Typography>
                  <CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {dashboardData.completedToday}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Công việc
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
                gridTemplateColumns: 'repeat(4, 1fr)'
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
            <Tab label="Xác thực" />
            <Tab label="Check-in/out" />
            <Tab label="Tranh chấp" />
            <Tab label="Bảo dưỡng" />
          </Tabs>
        </Card>

        {/* Tab 0: Verification */}
        {currentTab === 0 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Description sx={{ fontSize: 24, color: '#10b981' }} />
                <Typography variant="h6" fontWeight="bold">
                  Tài liệu chờ xác thực
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Xem xét và phê duyệt giấy tờ từ người dùng
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                {dashboardData.documents.map((doc, index) => (
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
                        <Description sx={{ fontSize: 20, color: '#10b981' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {doc.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doc.type} • {doc.uploaded}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={doc.status === "pending" ? "Chờ duyệt" : "Đang xem xét"}
                        size="small"
                        variant={doc.status === "pending" ? "outlined" : "filled"}
                      />
                      <Button size="small" variant="outlined">Xem xét</Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 1: Check-in/out */}
        {currentTab === 1 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <QrCode sx={{ fontSize: 24, color: '#10b981' }} />
                <Typography variant="h6" fontWeight="bold">
                  Check-in/Check-out
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Quản lý việc nhận và trả xe
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 8,
                  border: '2px dashed #d1d5db',
                  borderRadius: 2,
                  mb: 4
                }}
              >
                <Box textAlign="center">
                  <QrCode sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Quét mã QR để check-in/out
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Hướng camera vào mã QR trên xe
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<QrCode />}
                    sx={{
                      bgcolor: '#10b981',
                      textTransform: 'none',
                      boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                      '&:hover': { bgcolor: '#059669' }
                    }}
                  >
                    Bắt đầu quét
                  </Button>
                </Box>
              </Box>

              <Typography variant="subtitle2" fontWeight={600} mb={2}>
                Hoạt động gần đây
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                {dashboardData.checkInActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1
                    }}
                  >
                    <FiberManualRecord
                      sx={{
                        fontSize: 8,
                        color: activity.action === "Check-out" ? '#10b981' : '#0ea5e9'
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {activity.user} - {activity.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.vehicle} • {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Disputes */}
        {currentTab === 2 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Warning sx={{ fontSize: 24, color: '#ef4444' }} />
                <Typography variant="h6" fontWeight="bold">
                  Xử lý tranh chấp
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Giải quyết các vấn đề phát sinh giữa đồng sở hữu
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
                      <Typography variant="subtitle1" fontWeight={600}>
                        {dispute.title}
                      </Typography>
                      <Chip
                        label={dispute.priority === "high" ? "Cao" : "Trung bình"}
                        size="small"
                        sx={{
                          bgcolor: dispute.priority === "high" ? '#ef4444' : '#6b7280',
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {dispute.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Báo cáo bởi {dispute.reporter} • {dispute.created}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button size="small" variant="outlined">Xem chi tiết</Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                        >
                          Xử lý
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Maintenance */}
        {currentTab === 3 && (
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Build sx={{ fontSize: 24, color: '#10b981' }} />
                <Typography variant="h6" fontWeight="bold">
                  Quản lý bảo dưỡng
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Theo dõi và thực hiện các dịch vụ bảo dưỡng xe
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                {dashboardData.maintenance.map((service, index) => (
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
                          {service.vehicle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.service}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          service.status === "completed" ? "Hoàn thành" :
                            service.status === "in-progress" ? "Đang thực hiện" : "Đã lên lịch"
                        }
                        variant={service.status === "completed" ? "outlined" : "filled"}
                        color={
                          service.status === "completed" ? "default" :
                            service.status === "in-progress" ? "primary" : "default"
                        }
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={service.status !== "completed" ? 2 : 0}>
                      <Typography variant="body2" color="text.secondary">
                        {service.scheduled}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {service.estimatedCost}
                      </Typography>
                    </Box>
                    {service.status !== "completed" && (
                      <Box display="flex" gap={1}>
                        <Button size="small" variant="outlined">Cập nhật</Button>
                        <Button size="small" variant="contained">
                          {service.status === "in-progress" ? "Hoàn thành" : "Bắt đầu"}
                        </Button>
                      </Box>
                    )}
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
