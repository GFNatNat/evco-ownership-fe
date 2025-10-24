import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, 
  ListItemButton, ListItemText, ListItemIcon, Divider, IconButton, 
  Button, Breadcrumbs, Chip, Avatar, Menu, MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, DirectionsCar as DirectionsCarIcon,
  Schedule as ScheduleIcon, AccountBalance as AccountBalanceIcon, 
  Analytics as AnalyticsIcon, Group as GroupIcon, HowToVote as HowToVoteIcon,
  Build as BuildIcon, Assessment as AssessmentIcon, Notifications as NotificationsIcon,
  Settings as SettingsIcon, ExitToApp as ExitToAppIcon, AccountCircle as AccountCircleIcon,
  Add as AddIcon, History as HistoryIcon, Upgrade as UpgradeIcon, 
  NotificationImportant as ReminderIcon, CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';

const drawerWidth = 280;

// CoOwner Navigation Menu Structure
const coOwnerNavigation = [
  {
    section: 'Dashboard',
    items: [
      { to: '/coowner', label: 'Tổng quan', icon: <DashboardIcon /> }
    ]
  },
  {
    section: 'Quản lý xe',
    items: [
      { to: '/coowner/vehicles', label: 'Quản lý xe', icon: <DirectionsCarIcon /> },
      { to: '/coowner/create-vehicle', label: 'Thêm xe mới', icon: <AddIcon /> },
      { to: '/coowner/availability', label: 'Lịch trình sử dụng', icon: <ScheduleIcon /> },
      { to: '/coowner/analytics', label: 'Phân tích hiệu suất', icon: <AnalyticsIcon /> }
    ]
  },
  {
    section: 'Booking & Lịch trình',
    items: [
      { to: '/coowner/schedule', label: 'Lịch & đặt xe', icon: <ScheduleIcon /> },
      { to: '/coowner/booking-management', label: 'Quản lý Booking', icon: <ScheduleIcon /> },
      { to: '/coowner/booking-reminder', label: 'Nhắc nhở Booking', icon: <ReminderIcon /> },
      { to: '/coowner/checkin-checkout', label: 'Check-in/Check-out', icon: <CheckCircleIcon /> }
    ]
  },
  {
    section: 'Tài chính',
    items: [
      { to: '/coowner/payments', label: 'Chi phí & thanh toán', icon: <AccountBalanceIcon /> },
      { to: '/coowner/payment-management', label: 'Quản lý Thanh toán', icon: <AccountBalanceIcon /> },
      { to: '/coowner/fund-management', label: 'Quản lý Quỹ', icon: <AccountBalanceIcon /> },
      { to: '/coowner/deposit-management', label: 'Quản lý Cọc tiền', icon: <AccountBalanceIcon /> }
    ]
  },
  {
    section: 'Bảo dưỡng & Dịch vụ',
    items: [
      { to: '/coowner/maintenance-management', label: 'Quản lý Bảo dưỡng', icon: <BuildIcon /> },
      { to: '/coowner/maintenance-vote-management', label: 'Bỏ phiếu Bảo trì', icon: <HowToVoteIcon /> },
      { to: '/coowner/vehicle-upgrade', label: 'Nâng cấp xe', icon: <UpgradeIcon /> }
    ]
  },
  {
    section: 'Nhóm & Cộng đồng',
    items: [
      { to: '/coowner/group', label: 'Nhóm đồng sở hữu', icon: <GroupIcon /> },
      { to: '/coowner/invitations', label: 'Lời mời đồng sở hữu', icon: <GroupIcon /> },
      { to: '/coowner/voting-management', label: 'Quản lý Bình chọn', icon: <HowToVoteIcon /> },
      { to: '/coowner/dispute-management', label: 'Quản lý Tranh chấp', icon: <AssessmentIcon /> }
    ]
  },
  {
    section: 'Báo cáo & Lịch sử',
    items: [
      { to: '/coowner/reports-management', label: 'Quản lý Báo cáo', icon: <AssessmentIcon /> },
      { to: '/coowner/vehicle-reports', label: 'Báo cáo xe', icon: <AssessmentIcon /> },
      { to: '/coowner/history', label: 'Lịch sử & phân tích', icon: <HistoryIcon /> },
      { to: '/coowner/usage-analytics-management', label: 'Phân tích Sử dụng', icon: <AnalyticsIcon /> }
    ]
  },
  {
    section: 'Khác',
    items: [
      { to: '/coowner/notification-management', label: 'Quản lý Thông báo', icon: <NotificationsIcon /> },
      { to: '/coowner/fairness-optimization', label: 'Tối ưu hóa Công bằng', icon: <AnalyticsIcon /> }
    ]
  }
];

export default function CoOwnerDashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  
  const handleProfileMenuOpen = (event) => setProfileMenuAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchor(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];
    
    if (pathSegments.length > 1) {
      breadcrumbs.push({ label: 'CoOwner Dashboard', to: '/coowner' });
      
      const currentPage = pathSegments[pathSegments.length - 1];
      const pageLabels = {
        'vehicles': 'Quản lý xe',
        'create-vehicle': 'Thêm xe mới',
        'availability': 'Lịch trình sử dụng',
        'analytics': 'Phân tích hiệu suất',
        'schedule': 'Lịch & đặt xe',
        'booking-management': 'Quản lý Booking',
        'booking-reminder': 'Nhắc nhở Booking',
        'checkin-checkout': 'Check-in/Check-out',
        'payments': 'Chi phí & thanh toán',
        'payment-management': 'Quản lý Thanh toán',
        'fund-management': 'Quản lý Quỹ',
        'deposit-management': 'Quản lý Cọc tiền',
        'maintenance-management': 'Quản lý Bảo dưỡng',
        'maintenance-vote-management': 'Bỏ phiếu Bảo trì',
        'vehicle-upgrade': 'Nâng cấp xe',
        'group': 'Nhóm đồng sở hữu',
        'invitations': 'Lời mời đồng sở hữu',
        'voting-management': 'Quản lý Bình chọn',
        'dispute-management': 'Quản lý Tranh chấp',
        'reports-management': 'Quản lý Báo cáo',
        'vehicle-reports': 'Báo cáo xe',
        'history': 'Lịch sử & phân tích',
        'usage-analytics-management': 'Phân tích Sử dụng',
        'notification-management': 'Quản lý Thông báo',
        'fairness-optimization': 'Tối ưu hóa Công bằng'
      };
      
      if (pageLabels[currentPage]) {
        breadcrumbs.push({ label: pageLabels[currentPage], to: location.pathname });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const drawer = (
    <div>
      {/* Logo & Brand */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DirectionsCarIcon sx={{ fontSize: 28, color: '#10b981' }} />
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#10b981' }}>
            EV Share
          </Typography>
          <Typography variant="caption" color="text.secondary">
            CoOwner Panel
          </Typography>
        </Box>
      </Box>
      
      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {coOwnerNavigation.map((section) => (
          <Box key={section.section}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {section.section.toUpperCase()}
              </Typography>
            </Box>
            <List dense>
              {section.items.map((item) => (
                <ListItem key={item.to} disablePadding sx={{ px: 1 }}>
                  <ListItemButton 
                    component={Link} 
                    to={item.to}
                    selected={location.pathname === item.to}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        '& .MuiListItemIcon-root': { color: '#10b981' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Breadcrumbs */}
          <Box sx={{ flexGrow: 1 }}>
            {breadcrumbs.length > 0 && (
              <Breadcrumbs separator="›" sx={{ fontSize: '0.875rem' }}>
                {breadcrumbs.map((crumb, index) => (
                  <Link
                    key={index}
                    to={crumb.to}
                    style={{
                      textDecoration: 'none',
                      color: index === breadcrumbs.length - 1 ? '#10b981' : '#6b7280',
                      fontWeight: index === breadcrumbs.length - 1 ? 600 : 400
                    }}
                  >
                    {crumb.label}
                  </Link>
                ))}
              </Breadcrumbs>
            )}
            {breadcrumbs.length === 0 && (
              <Typography variant="h6" fontWeight="bold">
                CoOwner Dashboard
              </Typography>
            )}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                textTransform: 'none'
              }}
              onClick={() => navigate('/coowner/schedule')}
            >
              + Đặt lịch
            </Button>
            
            <NotificationCenter />
            
            {/* Profile Menu */}
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#10b981' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
                <AccountCircleIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/coowner/account'); handleProfileMenuClose(); }}>
                <SettingsIcon sx={{ mr: 1 }} /> Tài khoản
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{ mr: 1 }} /> Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px' // AppBar height
        }}
      >
        {/* Role Badge */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label="Đồng sở hữu"
            color="success"
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Page Content */}
        <Outlet />
      </Box>
    </Box>
  );
}