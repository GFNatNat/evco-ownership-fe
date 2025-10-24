import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Button, Chip, CircularProgress, Alert, Tabs, Tab, TextField, Divider, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem as SelectMenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import {
  DirectionsCar, TrendingUp, AttachMoney, Schedule, Battery80,
  AccessTime, Group, CalendarToday, ExitToApp, PeopleOutline,
  Build, Assessment, Notifications, HowToVote, Handyman,
  Payment, AccountBalance, Gavel, Analytics, History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coOwnerApi from '../../api/coOwnerApi';
import vehicleApi from '../../api/vehicleApi';
import scheduleApi from '../../api/scheduleApi';

// Import management components
import PaymentManagement from '../CoOwner/PaymentManagement';
import FundManagement from '../CoOwner/FundManagement';
import MaintenanceManagement from '../CoOwner/MaintenanceManagement';
import ReportsManagement from '../CoOwner/ReportsManagement';
import VotingManagement from '../CoOwner/VotingManagement';
import UsageAnalyticsManagement from '../CoOwner/UsageAnalyticsManagement';
import OwnershipHistoryManagement from '../CoOwner/OwnershipHistoryManagement';
import VehicleReportManagement from '../CoOwner/VehicleReportManagement';
import VehicleUpgradeManagement from '../CoOwner/VehicleUpgradeManagement';
import MaintenanceVoteManagement from '../CoOwner/MaintenanceVoteManagement';

export default function CoOwnerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openVoteModal, setOpenVoteModal] = useState(false);

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
  const [dashboardData, setDashboardData] = useState({
    ownership: 40,
    groupFund: 2450000,
    monthlyUsage: 15,
    nextBooking: 'Hôm nay 14:00 - 18:00',
    costThisMonth: 340000,
    availableBalance: 890000,
    vehicle: null,
    bookings: [
      { date: "Hôm nay 14:00 - 18:00", status: "confirmed", purpose: "Đi làm" },
      { date: "Thứ 6 09:00 - 17:00", status: "pending", purpose: "Đi công tác" },
      { date: "Chủ nhật 08:00 - 20:00", status: "completed", purpose: "Du lịch gia đình" }
    ],
    costs: [
      { name: "Tiền sạc điện", amount: 150000 },
      { name: "Bảo dưỡng", amount: 120000 },
      { name: "Bảo hiểm", amount: 70000 }
    ],
    groupMembers: [
      { name: "Nguyễn Văn A", ownership: 40, role: "Chủ nhóm", isYou: true },
      { name: "Trần Thị B", ownership: 30, role: "Thành viên", isYou: false },
      { name: "Lê Văn C", ownership: 20, role: "Thành viên", isYou: false },
      { name: "Phạm Thị D", ownership: 10, role: "Thành viên", isYou: false }
    ]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const statsRes = await coOwnerApi.getDashboardStats();
      const stats = statsRes?.data || {};

      const ownershipRes = await coOwnerApi.getOwnerships();
      const ownerships = ownershipRes?.data || [];
      const firstOwnership = ownerships[0];

      let vehicleData = null;
      if (firstOwnership?.vehicleId) {
        const vehicleRes = await vehicleApi.getById(firstOwnership.vehicleId);
        vehicleData = vehicleRes?.data;
      }

      const scheduleRes = await scheduleApi.getUserSchedule({ limit: 1, upcoming: true });
      const schedules = scheduleRes?.data || [];
      const nextBooking = schedules[0];

      setDashboardData(prev => ({
        ...prev,
        ownership: firstOwnership?.ownershipPercentage || stats.ownershipPercentage || prev.ownership,
        groupFund: stats.groupFund || prev.groupFund,
        monthlyUsage: stats.monthlyUsage || prev.monthlyUsage,
        nextBooking: nextBooking ? `${new Date(nextBooking.startDateTime).toLocaleString('vi-VN')}` : prev.nextBooking,
        costThisMonth: stats.costThisMonth || prev.costThisMonth,
        availableBalance: stats.availableBalance || prev.availableBalance,
        vehicle: vehicleData
      }));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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

  return (
    <Box>
      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', mb: 3 }}>
        <Box sx={{ px: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, v) => setSelectedTab(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 56
              },
              '& .Mui-selected': {
                color: '#10b981'
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#10b981',
                height: 2
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

        {/* Tab 2: Costs */}
        {selectedTab === 2 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý chi phí
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      Chi phí tháng này
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                      {dashboardData.costs.map((cost, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">{cost.name}</Typography>
                          <Typography variant="body2" fontWeight={600} color={
                            cost.name.includes('sạc') ? '#0ea5e9' :
                              cost.name.includes('Bảo dưỡng') ? '#f59e0b' : '#ef4444'
                          }>
                            {cost.amount.toLocaleString()}₫
                          </Typography>
                        </Box>
                      ))}

                      <Divider />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="bold">
                          Tổng cộng
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="#ef4444">
                          {dashboardData.costThisMonth.toLocaleString()}₫
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={3}>
                      Nạp tiền vào quỹ
                    </Typography>

                    <Box display="flex" flexDirection="column" gap={2}>
                      <Box>
                        <Typography variant="body2" fontWeight={500} mb={1}>
                          Số tiền
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="500,000"
                          variant="outlined"
                          size="small"
                        />
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AttachMoney />}
                        sx={{
                          bgcolor: '#10b981',
                          textTransform: 'none',
                          py: 1.5,
                          boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                          '&:hover': { bgcolor: '#059669' }
                        }}
                      >
                        Nạp tiền
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tab 3: Payment Management */}
        {selectedTab === 3 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý thanh toán
            </Typography>
            <PaymentManagement />
          </Box>
        )}

        {/* Tab 4: Fund Management */}
        {selectedTab === 4 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý quỹ chung
            </Typography>
            <FundManagement />
          </Box>
        )}

        {/* Tab 5: Maintenance Management */}
        {selectedTab === 5 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý bảo dưỡng
            </Typography>
            <MaintenanceManagement />
          </Box>
        )}

        {/* Tab 6: Reports Management */}
        {selectedTab === 6 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý báo cáo
            </Typography>
            <ReportsManagement />
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Báo cáo xe
              </Typography>
              <VehicleReportManagement />
            </Box>
          </Box>
        )}

        {/* Tab 7: Voting Management */}
        {selectedTab === 7 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Quản lý bỏ phiếu
            </Typography>
            <VotingManagement />
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bỏ phiếu bảo dưỡng
              </Typography>
              <MaintenanceVoteManagement />
            </Box>
            <Box mt={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bỏ phiếu nâng cấp xe
              </Typography>
              <VehicleUpgradeManagement />
            </Box>
          </Box>
        )}

        {/* Tab 8: Analytics Management */}
        {selectedTab === 8 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Phân tích sử dụng
            </Typography>
            <UsageAnalyticsManagement />
          </Box>
        )}

        {/* Tab 9: History Management */}
        {selectedTab === 9 && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Lịch sử sở hữu
            </Typography>
            <OwnershipHistoryManagement />
          </Box>
        )}

        {/* Tab 10: Group Management */}
        {selectedTab === 10 && (
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
              // Call API: scheduleApi.create(bookingForm)
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
    </Box>
  );
}
