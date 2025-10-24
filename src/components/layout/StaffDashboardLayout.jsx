import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
    ListItemButton, ListItemText, ListItemIcon, Divider, IconButton,
    Button, Breadcrumbs, Chip, Avatar, Menu, MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard as DashboardIcon, DirectionsCar as DirectionsCarIcon,
    Build as BuildIcon, VerifiedUser as VerifiedUserIcon, Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon, Report as ReportIcon, Settings as SettingsIcon,
    ExitToApp as ExitToAppIcon, AccountCircle as AccountCircleIcon, BusinessCenter as BusinessCenterIcon,
    Assessment as AssessmentIcon, NotificationImportant as ReminderIcon, Upgrade as UpgradeIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';

const drawerWidth = 280;

// Staff Navigation Menu Structure
const staffNavigation = [
    {
        section: 'Dashboard',
        items: [
            { to: '/staff', label: 'Tổng quan', icon: <DashboardIcon /> }
        ]
    },
    {
        section: 'Quản lý xe',
        items: [
            { to: '/staff/fleet', label: 'Quản lý nhóm xe', icon: <DirectionsCarIcon /> },
            { to: '/staff/vehicle-verification', label: 'Xác minh xe', icon: <VerifiedUserIcon /> },
            { to: '/staff/services', label: 'Dịch vụ xe', icon: <BuildIcon /> }
        ]
    },
    {
        section: 'Hoạt động',
        items: [
            { to: '/staff/contracts', label: 'Hợp đồng điện tử', icon: <AssignmentIcon /> },
            { to: '/staff/checkin', label: 'Check-in/Check-out', icon: <CheckCircleIcon /> },
            { to: '/staff/booking-reminder', label: 'Nhắc nhở Booking', icon: <ReminderIcon /> },
            { to: '/staff/disputes', label: 'Tranh chấp', icon: <ReportIcon /> }
        ]
    },
    {
        section: 'Báo cáo & Phê duyệt',
        items: [
            { to: '/staff/vehicle-reports', label: 'Báo cáo xe', icon: <AssessmentIcon /> },
            { to: '/staff/vehicle-upgrade-approval', label: 'Phê duyệt nâng cấp', icon: <UpgradeIcon /> },
            { to: '/staff/fairness-monitoring', label: 'Giám sát công bằng', icon: <AnalyticsIcon /> }
        ]
    },
    {
        section: 'Cấu hình',
        items: [
            { to: '/staff/settings', label: 'Cài đặt', icon: <SettingsIcon /> }
        ]
    }
];

export default function StaffDashboardLayout() {
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
            breadcrumbs.push({ label: 'Staff Dashboard', to: '/staff' });

            const currentPage = pathSegments[pathSegments.length - 1];
            const pageLabels = {
                'fleet': 'Quản lý nhóm xe',
                'vehicle-verification': 'Xác minh xe',
                'services': 'Dịch vụ xe',
                'contracts': 'Hợp đồng điện tử',
                'checkin': 'Check-in/Check-out',
                'booking-reminder': 'Nhắc nhở Booking',
                'disputes': 'Tranh chấp',
                'vehicle-reports': 'Báo cáo xe',
                'vehicle-upgrade-approval': 'Phê duyệt nâng cấp',
                'fairness-monitoring': 'Giám sát công bằng',
                'settings': 'Cài đặt'
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
                <DirectionsCarIcon sx={{ fontSize: 28, color: '#0ea5e9' }} />
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0ea5e9' }}>
                        EV Share
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Staff Panel
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            {staffNavigation.map((section) => (
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
                                            bgcolor: 'rgba(14, 165, 233, 0.1)',
                                            color: '#0ea5e9',
                                            '& .MuiListItemIcon-root': { color: '#0ea5e9' }
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
                                            color: index === breadcrumbs.length - 1 ? '#0ea5e9' : '#6b7280',
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
                                Staff Dashboard
                            </Typography>
                        )}
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: '#0ea5e9',
                                '&:hover': { bgcolor: '#0284c7' },
                                textTransform: 'none'
                            }}
                            onClick={() => navigate('/staff/vehicle-verification')}
                        >
                            + Xác minh xe
                        </Button>

                        <NotificationCenter />

                        {/* Profile Menu */}
                        <IconButton onClick={handleProfileMenuOpen}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#0ea5e9' }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'S'}
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
                            <MenuItem onClick={() => { navigate('/staff/settings'); handleProfileMenuClose(); }}>
                                <SettingsIcon sx={{ mr: 1 }} /> Settings
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
                        label="Nhân viên"
                        color="info"
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