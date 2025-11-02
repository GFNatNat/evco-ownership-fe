import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Button, Chip, CircularProgress, Alert, Tabs, Tab, TextField, Divider, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem as SelectMenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import {
  DirectionsCar, TrendingUp, AttachMoney, Schedule, Battery80,
  AccessTime, Group, CalendarToday, ExitToApp, PeopleOutline,
  Build, Assessment, Notifications, HowToVote, Handyman,
  Payment, AccountBalance, Gavel, Analytics, History,
  CreditCard, Upload, PhotoCamera, Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coOwnerApi from '../../api/coowner';
import { debugAPI, testSpecificEndpoint } from '../../utils/apiTestHelper';

// Import management components
import PaymentManagement from '../CoOwner/PaymentManagement';
import FundManagement from '../CoOwner/FundManagement';
import BackendStatusChecker from '../../components/common/BackendStatusChecker';
// import MaintenanceManagement from '../CoOwner/MaintenanceManagement'; // Removed - not in 7-controller
// import ReportsManagement from '../CoOwner/ReportsManagement'; // Removed - not in 7-controller
// import VotingManagement from '../CoOwner/VotingManagement'; // Removed - replaced by Group
// import UsageAnalyticsManagement from '../CoOwner/UsageAnalyticsManagement'; // Removed - simplified
// import OwnershipHistoryManagement from '../CoOwner/OwnershipHistoryManagement'; // Removed - not in 7-controller
// import VehicleReportManagement from '../CoOwner/VehicleReportManagement'; // Removed - not in 7-controller
// import VehicleUpgradeManagement from '../CoOwner/VehicleUpgradeManagement'; // Removed - not in 7-controller
// import MaintenanceVoteManagement from '../CoOwner/MaintenanceVoteManagement'; // Removed - not in 7-controller

export default function CoOwnerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    console.log('👤 Current User:', user);
    console.log('🔑 Access Token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');

    if (!user) {
      console.warn('⚠️ No user found, redirecting to login...');
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Modal states
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openVoteModal, setOpenVoteModal] = useState(false);
  const [openLicenseModal, setOpenLicenseModal] = useState(false);
  const [openVehicleModal, setOpenVehicleModal] = useState(false);

  // Form states
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });
  const [inviteForm, setInviteForm] = useState({
    email: '',
    ownershipPercentage: 10
  });
  const [voteForm, setVoteForm] = useState({
    topic: '',
    description: '',
    options: ['Đồng ý', 'Không đồng ý']
  });
  const [licenseForm, setLicenseForm] = useState({
    licenseNumber: '',
    fullName: '',
    dateOfBirth: '',
    issueDate: '',
    expiryDate: '',
    licenseClass: 'B1',
    issuePlace: '',
    frontImage: null,
    backImage: null
  });
  const [vehicleForm, setVehicleForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    engineNumber: '',
    fuelType: 'Gasoline',
    registrationDocument: null,
    insuranceDocument: null,
    inspectionDocument: null
  });
  const [dashboardData, setDashboardData] = useState({
    ownership: 0,
    groupFund: 0,
    monthlyUsage: 0,
    nextBooking: null,
    costThisMonth: 0,
    availableBalance: 0,
    vehicle: null,
    vehicles: [], // Real vehicles from database
    bookings: [], // Real bookings from database
    costs: [], // Real costs from database
    groupMembers: [] // Real group members from database
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const token = localStorage.getItem('accessToken');
      console.log('🔑 Access Token:', token ? 'Present' : 'Missing');

      if (!token) {
        setError('⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dashboard.');
        return;
      }

      console.log('🔄 Fetching dashboard data...');

      // Run API debug test first
      const debugResults = await debugAPI();
      console.log('🧪 API Debug Results:', debugResults);

      // Test individual endpoints
      console.log('🧪 Testing individual Vehicle API endpoint...');
      const vehicleTest = await testSpecificEndpoint('/api/Vehicle');
      console.log('🚗 Vehicle API Test:', vehicleTest);

      if (!vehicleTest.success && vehicleTest.statusCode === 401) {
        setError('❌ Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      // Call multiple API endpoints to get complete dashboard data
      const [statsRes, vehiclesRes, groupsRes, bookingsRes, fundsRes] = await Promise.all([
        coOwnerApi.getDashboardStats().catch(err => {
          console.error('❌ Dashboard stats API failed:', err);
          return null;
        }),
        coOwnerApi.vehicles.getAvailable().catch(err => {
          console.error('❌ Vehicles API failed:', err);
          return null;
        }),
        coOwnerApi.groups.getMyGroups().catch(err => {
          console.error('❌ Groups API failed:', err);
          return null;
        }),
        coOwnerApi.bookings.getMyBookings().catch(err => {
          console.error('❌ Bookings API failed:', err);
          return null;
        }),
        coOwnerApi.funds.getInfo().catch(err => {
          console.error('❌ Funds API failed:', err);
          return null;
        })
      ]);

      // Debug: Log all API responses
      console.log('📊 API Responses:', {
        stats: statsRes,
        vehicles: vehiclesRes,
        groups: groupsRes,
        bookings: bookingsRes,
        funds: fundsRes
      });

      // Check if backend is completely down
      if (!statsRes && !vehiclesRes && !groupsRes && !bookingsRes && !fundsRes) {
        throw new Error('Backend API không phản hồi. Kiểm tra kết nối backend tại http://localhost:5215');
      }

      // Extract data from successful API calls - ensure arrays
      const stats = statsRes?.data || {
        totalVehicles: 0,
        activeBookings: 0,
        totalGroups: 0,
        monthlyUsage: 0
      };

      // Handle vehicles response structure according to OpenAPI spec
      let vehicles = [];
      if (vehiclesRes?.data?.items) {
        vehicles = Array.isArray(vehiclesRes.data.items) ? vehiclesRes.data.items : [];
      } else if (vehiclesRes?.data) {
        vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
      } else {
        vehicles = [];
      }

      const groups = Array.isArray(groupsRes?.data) ? groupsRes.data : [];
      const bookings = Array.isArray(bookingsRes?.data?.items) ? bookingsRes.data.items :
        Array.isArray(bookingsRes?.data) ? bookingsRes.data : [];
      const funds = Array.isArray(fundsRes?.data) ? fundsRes.data : [];

      // Calculate derived data
      const groupFund = funds.length > 0 ? funds[0]?.currentBalance || 0 : 0;
      const nextBooking = bookings.length > 0 ? bookings[0] : null;
      const recentCosts = funds.length > 0 ? funds[0]?.recentTransactions?.filter(t => t.type === 'usage')?.slice(0, 3) || [] : [];

      // Update state with ONLY real API data
      setDashboardData({
        ownership: stats.ownershipPercentage || 0,
        groupFund,
        monthlyUsage: stats.monthlyUsage || 0,
        nextBooking: nextBooking ? `${new Date(nextBooking.startTime).toLocaleDateString()} ${new Date(nextBooking.startTime).toLocaleTimeString()}` : null,
        costThisMonth: stats.costThisMonth || 0,
        availableBalance: stats.availableBalance || 0,
        vehicle: vehicles.length > 0 ? vehicles[0] : null,
        vehicles: vehicles,
        bookings: Array.isArray(bookings) ? bookings.slice(0, 3) : [],
        costs: recentCosts.map(t => ({ name: t.description, amount: t.amount })),
        groupMembers: groups.length > 0 ? groups[0]?.members || [] : []
      });

      console.log(`✅ Dashboard loaded: ${vehicles.length} vehicles, ${bookings.length} bookings, ${groups.length} groups`);

    } catch (error) {
      console.error('❌ Fatal error loading dashboard:', error);
      setError(`Không thể tải dữ liệu từ database: ${error.message}`);
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
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            ❌ Lỗi kết nối API
          </Typography>
          <Typography variant="body2" paragraph>
            {error}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              🔧 Hướng dẫn khắc phục:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              1. Kiểm tra backend có chạy tại: <code>http://localhost:5215</code><br />
              2. Kiểm tra token đăng nhập có hợp lệ<br />
              3. Xem console log để biết chi tiết lỗi<br />
              4. Thử đăng nhập lại nếu token hết hạn
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={fetchDashboardData}
              size="small"
            >
              🔄 Thử lại
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                console.clear();
                await debugAPI();
              }}
              size="small"
            >
              🔧 Debug API
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              size="small"
            >
              🔑 Đăng nhập lại
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Backend Status Checker */}
      <BackendStatusChecker />

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', mb: 3 }}>
        <Box sx={{ px: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, v) => setSelectedTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 56,
                minWidth: 120
              },
              '& .Mui-selected': {
                color: '#10b981'
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#10b981',
                height: 2
              },
              '& .MuiTabs-scrollButtons': {
                color: '#10b981',
                '&.Mui-disabled': {
                  opacity: 0.3
                }
              }
            }}
          >
            <Tab icon={<TrendingUp sx={{ fontSize: 18 }} />} iconPosition="start" label="Tổng quan" />
            <Tab icon={<CalendarToday sx={{ fontSize: 18 }} />} iconPosition="start" label="Đặt lịch" />
            <Tab icon={<AttachMoney sx={{ fontSize: 18 }} />} iconPosition="start" label="Thanh toán" />
            <Tab icon={<AccountBalance sx={{ fontSize: 18 }} />} iconPosition="start" label="Quỹ chung" />
            <Tab icon={<Build sx={{ fontSize: 18 }} />} iconPosition="start" label="Bảo dưỡng" />
            <Tab icon={<Assessment sx={{ fontSize: 18 }} />} iconPosition="start" label="Báo cáo" />
            <Tab icon={<HowToVote sx={{ fontSize: 18 }} />} iconPosition="start" label="Bỏ phiếu" />
            <Tab icon={<Analytics sx={{ fontSize: 18 }} />} iconPosition="start" label="Phân tích" />
            <Tab icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" label="Lịch sử" />
            <Tab icon={<PeopleOutline sx={{ fontSize: 18 }} />} iconPosition="start" label="Nhóm" />
          </Tabs>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 2 }}>
        {/* Tab 0: Overview */}
        {selectedTab === 0 && (
          <Box>
            {/* Stats Grid */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">
                        Tỷ lệ sở hữu
                      </Typography>
                      <Group sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="#10b981" mb={0.5}>
                      {dashboardData.ownership}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Xe Toyota Camry Hybrid
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">
                        Quỹ nhóm
                      </Typography>
                      <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="#10b981" mb={0.5}>
                      {dashboardData.groupFund.toLocaleString()}₫
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Số dư khả dụng: {dashboardData.availableBalance.toLocaleString()}₫
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">
                        Sử dụng tháng này
                      </Typography>
                      <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="#0ea5e9" mb={0.5}>
                      {dashboardData.monthlyUsage}h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      +2h so với tháng trước
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)', background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">
                        Chi phí tháng này
                      </Typography>
                      <TrendingUp sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="#ef4444" mb={0.5}>
                      {dashboardData.costThisMonth.toLocaleString()}₫
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Theo tỷ lệ sở hữu
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Vehicle Status & Next Booking */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <Battery80 sx={{ fontSize: 24, color: '#10b981' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Trạng thái xe
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Pin</Typography>
                        <Typography variant="body2" fontWeight={600}>85%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={85}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10b981',
                            borderRadius: 1
                          }
                        }}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
                      <Typography variant="body2">Vị trí</Typography>
                      <Chip label="Đang đỗ tại nhà" variant="outlined" size="small" />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Km đã đi</Typography>
                      <Typography variant="body2">12,450 km</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <Schedule sx={{ fontSize: 24, color: '#10b981' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Lịch sắp tới
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        mb: 2,
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1))',
                        borderRadius: 2,
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                            Lịch đã đặt
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dashboardData.nextBooking}
                          </Typography>
                        </Box>
                        <Chip
                          label="Đã xác nhận"
                          sx={{
                            bgcolor: '#10b981',
                            color: 'white',
                            fontWeight: 500
                          }}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CalendarToday />}
                      onClick={() => setOpenBookingModal(true)}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#d1d5db',
                        '&:hover': {
                          borderColor: '#10b981',
                          bgcolor: 'rgba(16, 185, 129, 0.05)'
                        }
                      }}
                    >
                      Đặt lịch mới
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Available Vehicles Section */}
            <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <DirectionsCar sx={{ fontSize: 24, color: '#10b981' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Xe có sẵn
                    </Typography>
                    {dashboardData.vehicles && (
                      <Chip
                        label={`${dashboardData.vehicles.length} xe`}
                        size="small"
                        sx={{ bgcolor: '#10b981', color: 'white' }}
                      />
                    )}
                  </Box>

                  {/* Debug Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                      console.clear();
                      await debugAPI();
                      await fetchDashboardData();
                    }}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      '&:hover': { borderColor: '#dc2626' }
                    }}
                  >
                    🔧 Debug API
                  </Button>
                </Box>

                {/* Show vehicles from database */}
                {dashboardData.vehicles && dashboardData.vehicles.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.vehicles.slice(0, 4).map((vehicle) => (
                      <Grid item xs={12} sm={6} md={3} key={vehicle.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}
                          onClick={() => navigate('/coowner/bookings')}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" mb={1} noWrap>
                              {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {vehicle.license_plate || vehicle.licensePlate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {vehicle.year} • {vehicle.color}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption" color="text.secondary">
                                🔋 {vehicle.battery_capacity || vehicle.batteryCapacity || 'N/A'} kWh
                              </Typography>
                              <Chip
                                label="Có sẵn"
                                size="small"
                                color="success"
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(14, 165, 233, 0.05))',
                      borderRadius: 2
                    }}
                  >
                    <DirectionsCar sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      Chưa có xe nào
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Không tìm thấy xe có sẵn. Vui lòng liên hệ quản trị viên.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<DirectionsCar />}
                      onClick={() => navigate('/coowner/vehicles')}
                    >
                      Xem xe có sẵn
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Registration Actions */}
            <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: '#374151' }}>
                  Đăng ký & Xác thực
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DirectionsCar />}
                      onClick={() => setOpenLicenseModal(true)}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                        '&:hover': {
                          borderColor: '#2563eb',
                          bgcolor: 'rgba(59, 130, 246, 0.05)'
                        }
                      }}
                    >
                      Đăng ký bằng lái xe
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Build />}
                      onClick={() => setOpenVehicleModal(true)}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#10b981',
                        color: '#10b981',
                        '&:hover': {
                          borderColor: '#059669',
                          bgcolor: 'rgba(16, 185, 129, 0.05)'
                        }
                      }}
                    >
                      Đăng ký xe mới
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tab 1: Booking */}
        {selectedTab === 1 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                Đặt lịch sử dụng xe
              </Typography>
              <Button
                variant="contained"
                startIcon={<CalendarToday />}
                onClick={() => setOpenBookingModal(true)}
                sx={{
                  bgcolor: '#10b981',
                  textTransform: 'none',
                  boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                  '&:hover': { bgcolor: '#059669' }
                }}
              >
                Đặt lịch mới
              </Button>
            </Box>

            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Lịch sử dụng xe
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Xem và quản lý các lần đặt lịch của bạn
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {dashboardData.bookings.map((booking, index) => (
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
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {booking.purpose}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.date}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          booking.status === "confirmed" ? "Đã xác nhận" :
                            booking.status === "pending" ? "Chờ duyệt" : "Hoàn thành"
                        }
                        color={
                          booking.status === "confirmed" ? "primary" :
                            booking.status === "pending" ? "default" : "default"
                        }
                        variant={booking.status === "completed" ? "outlined" : "filled"}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tab 2: Payment Management */}
        {selectedTab === 2 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý thanh toán
            </Typography>
            <PaymentManagement />
          </Box>
        )}

        {/* Tab 3: Fund Management */}
        {selectedTab === 3 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý quỹ chung
            </Typography>
            <FundManagement />
          </Box>
        )}

        {/* Tab 4: Maintenance Management */}
        {selectedTab === 4 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý bảo dưỡng
            </Typography>
            {/* Maintenance features handled via external services */}
            <Typography color="text.secondary">
              Bảo trì xe được quản lý thông qua dịch vụ bên ngoài
            </Typography>
          </Box>
        )}

        {/* Tab 5: Reports Management */}
        {selectedTab === 5 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý báo cáo
            </Typography>
            {/* Reports integrated into other sections */}
            <Typography color="text.secondary">
              Báo cáo được tích hợp trong các phần khác
            </Typography>
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Báo cáo xe
              </Typography>
              {/* Vehicle reports integrated into vehicle management */}
              <Typography color="text.secondary">
                Báo cáo xe tích hợp trong quản lý xe
              </Typography>
            </Box>
          </Box>
        )}

        {/* Tab 6: Voting Management */}
        {selectedTab === 6 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý bỏ phiếu
            </Typography>
            {/* Voting moved to Group management */}
            <Typography color="text.secondary">
              Tính năng bỏ phiếu đã được chuyển sang quản lý nhóm
            </Typography>
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bỏ phiếu bảo dưỡng
              </Typography>
              {/* Maintenance voting integrated into group decisions */}
              <Typography color="text.secondary">
                Bỏ phiếu bảo trì được tích hợp vào quyết định nhóm
              </Typography>
            </Box>
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bỏ phiếu nâng cấp xe
              </Typography>
              <VehicleUpgradeManagement />
            </Box>
          </Box>
        )}

        {/* Tab 7: Analytics Management */}
        {selectedTab === 7 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Phân tích sử dụng
            </Typography>
            <UsageAnalyticsManagement />
          </Box>
        )}

        {/* Tab 8: History Management */}
        {selectedTab === 8 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Lịch sử sở hữu
            </Typography>
            <OwnershipHistoryManagement />
          </Box>
        )}

        {/* Tab 9: Group Management */}
        {selectedTab === 9 && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                Quản lý nhóm
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<PeopleOutline />}
                  onClick={() => setOpenInviteModal(true)}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#0ea5e9',
                    color: '#0ea5e9',
                    '&:hover': {
                      borderColor: '#0284c7',
                      bgcolor: 'rgba(14, 165, 233, 0.05)'
                    }
                  }}
                >
                  Mời thành viên
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CalendarToday />}
                  onClick={() => setOpenVoteModal(true)}
                  sx={{
                    bgcolor: '#10b981',
                    textTransform: 'none',
                    boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      bgcolor: '#059669'
                    }
                  }}
                >
                  Tạo bỏ phiếu
                </Button>
              </Box>
            </Box>

            <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Thành viên nhóm
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Toyota Camry Hybrid - Nhóm 4 người
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {dashboardData.groupMembers.map((member, index) => (
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
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            fontWeight: 600
                          }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {member.name} {member.isYou && "(Bạn)"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="body1" fontWeight={600} color="#10b981">
                          {member.ownership}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Tỷ lệ sở hữu
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}


      </Box>

      {/* Modal Đặt lịch mới */}
      <Dialog
        open={openBookingModal}
        onClose={() => setOpenBookingModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday sx={{ color: '#10b981' }} />
            <Typography variant="h6" fontWeight="bold">
              Đặt lịch sử dụng xe
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={2}>
            <TextField
              fullWidth
              label="Ngày sử dụng"
              type="date"
              value={bookingForm.date}
              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giờ bắt đầu"
                  type="time"
                  value={bookingForm.startTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giờ kết thúc"
                  type="time"
                  value={bookingForm.endTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Mục đích sử dụng"
              multiline
              rows={3}
              value={bookingForm.purpose}
              onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
              placeholder="VD: Đi làm, đi công tác, du lịch..."
            />
            <Alert severity="info">
              Lưu ý: Lịch đặt xe cần được xác nhận bởi các thành viên khác trong nhóm
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenBookingModal(false)}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#10b981',
              textTransform: 'none',
              '&:hover': { bgcolor: '#059669' }
            }}
            onClick={() => {
              console.log('Booking submitted:', bookingForm);
              // Call API: coOwnerApi.create(bookingForm)
              setOpenBookingModal(false);
              setBookingForm({ date: '', startTime: '', endTime: '', purpose: '' });
            }}
          >
            Đặt lịch
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Mời thành viên */}
      <Dialog
        open={openInviteModal}
        onClose={() => setOpenInviteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PeopleOutline sx={{ color: '#0ea5e9' }} />
            <Typography variant="h6" fontWeight="bold">
              Mời thành viên mới
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="email@example.com"
            />
            <Box>
              <Typography variant="body2" fontWeight={500} mb={1}>
                Tỷ lệ sở hữu: {inviteForm.ownershipPercentage}%
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="caption">0%</Typography>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={inviteForm.ownershipPercentage}
                  onChange={(e) => setInviteForm({ ...inviteForm, ownershipPercentage: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <Typography variant="caption">50%</Typography>
              </Box>
            </Box>
            <Alert severity="warning">
              Việc thêm thành viên mới sẽ cần sự đồng ý của tất cả thành viên hiện tại
            </Alert>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(14, 165, 233, 0.05)',
                borderRadius: 1,
                border: '1px solid rgba(14, 165, 233, 0.2)'
              }}
            >
              <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                Tỷ lệ sở hữu hiện tại của bạn
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#0ea5e9">
                40% → {40 - inviteForm.ownershipPercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Giảm {inviteForm.ownershipPercentage}% sau khi mời)
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenInviteModal(false)}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#0ea5e9',
              textTransform: 'none',
              '&:hover': { bgcolor: '#0284c7' }
            }}
            onClick={() => {
              console.log('Invite submitted:', inviteForm);
              // Call API: coOwnerApi.inviteMember(inviteForm)
              setOpenInviteModal(false);
              setInviteForm({ email: '', ownershipPercentage: 10 });
            }}
          >
            Gửi lời mời
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Tạo bỏ phiếu */}
      <Dialog
        open={openVoteModal}
        onClose={() => setOpenVoteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday sx={{ color: '#10b981' }} />
            <Typography variant="h6" fontWeight="bold">
              Tạo bỏ phiếu mới
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={2}>
            <FormControl fullWidth>
              <InputLabel>Loại bỏ phiếu</InputLabel>
              <Select
                value={voteForm.voteType}
                label="Loại bỏ phiếu"
                onChange={(e) => setVoteForm({ ...voteForm, voteType: e.target.value })}
              >
                <SelectMenuItem value="decision">Quyết định chung</SelectMenuItem>
                <SelectMenuItem value="expense">Phê duyệt chi phí</SelectMenuItem>
                <SelectMenuItem value="schedule">Thay đổi lịch trình</SelectMenuItem>
                <SelectMenuItem value="rule">Thay đổi quy định</SelectMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tiêu đề"
              value={voteForm.topic}
              onChange={(e) => setVoteForm({ ...voteForm, topic: e.target.value })}
              placeholder="VD: Thay lốp xe mới"
            />
            <TextField
              fullWidth
              label="Mô tả chi tiết"
              multiline
              rows={4}
              value={voteForm.description}
              onChange={(e) => setVoteForm({ ...voteForm, description: e.target.value })}
              placeholder="Mô tả chi tiết về nội dung cần bỏ phiếu..."
            />
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(16, 185, 129, 0.05)',
                borderRadius: 1,
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
            >
              <Typography variant="body2" fontWeight={600} mb={1}>
                Quy tắc bỏ phiếu:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                • Cần ít nhất 75% thành viên đồng ý
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                • Thời gian bỏ phiếu: 48 giờ
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • Mỗi thành viên có 1 phiếu bầu
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenVoteModal(false)}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#10b981',
              textTransform: 'none',
              '&:hover': { bgcolor: '#059669' }
            }}
            onClick={() => {
              console.log('Vote submitted:', voteForm);
              // Call API: coOwnerApi.createVote(voteForm)
              setOpenVoteModal(false);
              setVoteForm({ topic: '', description: '', voteType: 'decision' });
            }}
          >
            Tạo bỏ phiếu
          </Button>
        </DialogActions>
      </Dialog>

      {/* License Registration Dialog */}
      <Dialog
        open={openLicenseModal}
        onClose={() => setOpenLicenseModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCard sx={{ color: '#3b82f6' }} />
            <Typography variant="h6" fontWeight="bold">
              Đăng ký bằng lái xe
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số bằng lái"
                value={licenseForm.licenseNumber}
                onChange={(e) => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={licenseForm.fullName}
                onChange={(e) => setLicenseForm({ ...licenseForm, fullName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                value={licenseForm.dateOfBirth}
                onChange={(e) => setLicenseForm({ ...licenseForm, dateOfBirth: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Hạng bằng lái</InputLabel>
                <Select
                  value={licenseForm.licenseClass}
                  onChange={(e) => setLicenseForm({ ...licenseForm, licenseClass: e.target.value })}
                  label="Hạng bằng lái"
                >
                  <SelectMenuItem value="A1">A1 - Xe máy 50-175cc</SelectMenuItem>
                  <SelectMenuItem value="A2">A2 - Xe máy trên 175cc</SelectMenuItem>
                  <SelectMenuItem value="B1">B1 - Xe ô tô đến 9 chỗ</SelectMenuItem>
                  <SelectMenuItem value="B2">B2 - Xe ô tô đến 3.5 tấn</SelectMenuItem>
                  <SelectMenuItem value="C">C - Xe tải trên 3.5 tấn</SelectMenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày cấp"
                type="date"
                value={licenseForm.issueDate}
                onChange={(e) => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày hết hạn"
                type="date"
                value={licenseForm.expiryDate}
                onChange={(e) => setLicenseForm({ ...licenseForm, expiryDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nơi cấp"
                value={licenseForm.issuePlace}
                onChange={(e) => setLicenseForm({ ...licenseForm, issuePlace: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: '2px dashed #d1d5db', borderRadius: 2, textAlign: 'center' }}>
                <PhotoCamera sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Ảnh mặt trước bằng lái
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<Upload />}
                  sx={{ textTransform: 'none' }}
                >
                  Chọn ảnh
                  <input type="file" hidden accept="image/*" onChange={(e) =>
                    setLicenseForm({ ...licenseForm, frontImage: e.target.files[0] })
                  } />
                </Button>
                {licenseForm.frontImage && (
                  <Typography variant="caption" color="success.main" display="block" mt={1}>
                    ✓ Đã chọn: {licenseForm.frontImage.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, border: '2px dashed #d1d5db', borderRadius: 2, textAlign: 'center' }}>
                <PhotoCamera sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Ảnh mặt sau bằng lái
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<Upload />}
                  sx={{ textTransform: 'none' }}
                >
                  Chọn ảnh
                  <input type="file" hidden accept="image/*" onChange={(e) =>
                    setLicenseForm({ ...licenseForm, backImage: e.target.files[0] })
                  } />
                </Button>
                {licenseForm.backImage && (
                  <Typography variant="caption" color="success.main" display="block" mt={1}>
                    ✓ Đã chọn: {licenseForm.backImage.name}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenLicenseModal(false)}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#3b82f6',
              textTransform: 'none',
              '&:hover': { bgcolor: '#2563eb' }
            }}
            onClick={() => {
              console.log('License submitted:', licenseForm);
              // Call API: coOwnerApi.registerLicense(licenseForm)
              setOpenLicenseModal(false);
            }}
          >
            Đăng ký bằng lái
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vehicle Registration Dialog */}
      <Dialog
        open={openVehicleModal}
        onClose={() => setOpenVehicleModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DirectionsCar sx={{ color: '#10b981' }} />
            <Typography variant="h6" fontWeight="bold">
              Đăng ký xe mới
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Hãng xe"
                value={vehicleForm.brand}
                onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Dòng xe"
                value={vehicleForm.model}
                onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Năm sản xuất"
                type="number"
                value={vehicleForm.year}
                onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Màu sắc"
                value={vehicleForm.color}
                onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Biển số xe"
                value={vehicleForm.licensePlate}
                onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số VIN"
                value={vehicleForm.vin}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số máy"
                value={vehicleForm.engineNumber}
                onChange={(e) => setVehicleForm({ ...vehicleForm, engineNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loại nhiên liệu</InputLabel>
                <Select
                  value={vehicleForm.fuelType}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                  label="Loại nhiên liệu"
                >
                  <SelectMenuItem value="Gasoline">Xăng</SelectMenuItem>
                  <SelectMenuItem value="Diesel">Dầu diesel</SelectMenuItem>
                  <SelectMenuItem value="Electric">Điện</SelectMenuItem>
                  <SelectMenuItem value="Hybrid">Hybrid</SelectMenuItem>
                  <SelectMenuItem value="LPG">LPG</SelectMenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '2px dashed #d1d5db', borderRadius: 2, textAlign: 'center' }}>
                <Description sx={{ fontSize: 40, color: '#9ca3af', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Đăng ký xe
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<Upload />}
                  sx={{ textTransform: 'none' }}
                >
                  Chọn file
                  <input type="file" hidden accept=".pdf,.jpg,.png" onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, registrationDocument: e.target.files[0] })
                  } />
                </Button>
                {vehicleForm.registrationDocument && (
                  <Typography variant="caption" color="success.main" display="block" mt={1}>
                    ✓ {vehicleForm.registrationDocument.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '2px dashed #d1d5db', borderRadius: 2, textAlign: 'center' }}>
                <Description sx={{ fontSize: 40, color: '#9ca3af', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Bảo hiểm xe
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<Upload />}
                  sx={{ textTransform: 'none' }}
                >
                  Chọn file
                  <input type="file" hidden accept=".pdf,.jpg,.png" onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, insuranceDocument: e.target.files[0] })
                  } />
                </Button>
                {vehicleForm.insuranceDocument && (
                  <Typography variant="caption" color="success.main" display="block" mt={1}>
                    ✓ {vehicleForm.insuranceDocument.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, border: '2px dashed #d1d5db', borderRadius: 2, textAlign: 'center' }}>
                <Description sx={{ fontSize: 40, color: '#9ca3af', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Đăng kiểm xe
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<Upload />}
                  sx={{ textTransform: 'none' }}
                >
                  Chọn file
                  <input type="file" hidden accept=".pdf,.jpg,.png" onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, inspectionDocument: e.target.files[0] })
                  } />
                </Button>
                {vehicleForm.inspectionDocument && (
                  <Typography variant="caption" color="success.main" display="block" mt={1}>
                    ✓ {vehicleForm.inspectionDocument.name}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenVehicleModal(false)}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#10b981',
              textTransform: 'none',
              '&:hover': { bgcolor: '#059669' }
            }}
            onClick={() => {
              console.log('Vehicle submitted:', vehicleForm);
              // Call API: coOwnerApi.registerVehicle(vehicleForm)
              setOpenVehicleModal(false);
            }}
          >
            Đăng ký xe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
