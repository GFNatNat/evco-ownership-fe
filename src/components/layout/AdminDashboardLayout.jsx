import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
    ListItemButton, ListItemText, ListItemIcon, Divider, IconButton,
    Button, Breadcrumbs, Chip, Avatar, Menu, MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon,
    DirectionsCar as DirectionsCarIcon, Assessment as AssessmentIcon,
    Settings as SettingsIcon, ExitToApp as ExitToAppIcon,
    VerifiedUser as LicenseIcon, Group as GroupIcon,
    AccountCircle as AccountCircleIcon, Notifications as NotificationsIcon,
    History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';

const drawerWidth = 280;

// Admin Navigation Menu Structure
const adminNavigation = [
    {
        section: 'Dashboard',
        items: [
            { to: '/admin', label: 'Tổng quan', icon: <DashboardIcon /> }
        ]
    },
    {
        section: 'Quản lý hệ thống',
        items: [
            { to: '/admin/users', label: 'Quản lý người dùng', icon: <PeopleIcon /> },
            { to: '/admin/licenses', label: 'Quản lý giấy phép', icon: <LicenseIcon /> },
            { to: '/admin/groups', label: 'Nhóm đồng sở hữu', icon: <GroupIcon /> }
        ]
    },
    {
        section: 'Giám sát hoạt động',
        items: [
            { to: '/admin/checkin-oversight', label: 'Giám sát Check-in/out', icon: <CheckCircleIcon /> },
            { to: '/admin/booking-reminder-management', label: 'Quản lý Nhắc nhở', icon: <ReminderIcon /> },
            { to: '/admin/vehicle-upgrade-oversight', label: 'Giám sát Nâng cấp', icon: <UpgradeIcon /> }
        ]
    },
    {
        section: 'Báo cáo & Phân tích',
        items: [
            { to: '/admin/reports', label: 'Báo cáo tài chính', icon: <AssessmentIcon /> },
            { to: '/admin/audit-logs', label: 'Nhật ký hệ thống', icon: <HistoryIcon /> }
        ]
    },
    {
        section: 'Cấu hình',
        items: [
            { to: '/admin/settings', label: 'Cấu hình hệ thống', icon: <SettingsIcon /> },
            { to: '/admin/notifications', label: 'Quản lý thông báo', icon: <NotificationsIcon /> }
        ]
    }
];

export default function AdminDashboardLayout() {
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
            breadcrumbs.push({ label: 'Admin Dashboard', to: '/admin' });

            const currentPage = pathSegments[pathSegments.length - 1];
            const pageLabels = {
                'users': 'Quản lý người dùng',
                'licenses': 'Quản lý giấy phép',
                'groups': 'Nhóm đồng sở hữu',
                'checkin-oversight': 'Giám sát Check-in/out',
                'booking-reminder-management': 'Quản lý Nhắc nhở',
                'vehicle-upgrade-oversight': 'Giám sát Nâng cấp',
                'reports': 'Báo cáo tài chính',
                'vehicle-reports-management': 'Quản lý Báo cáo xe',
                'fairness-optimization-monitoring': 'Giám sát Tối ưu',
                'analytics': 'Phân tích hệ thống',
                'settings': 'Cấu hình hệ thống'
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
                <DirectionsCarIcon sx={{ fontSize: 28, color: '#ef4444' }} />
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#ef4444' }}>
                        EV Share
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Admin Panel
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            {adminNavigation.map((section) => (
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
                                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            '& .MuiListItemIcon-root': { color: '#ef4444' }
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
                                            color: index === breadcrumbs.length - 1 ? '#ef4444' : '#6b7280',
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
                                Admin Dashboard
                            </Typography>
                        )}
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: '#ef4444',
                                '&:hover': { bgcolor: '#dc2626' },
                                textTransform: 'none'
                            }}
                            onClick={() => navigate('/admin/users/create')}
                        >
                            + Thêm User
                        </Button>

                        <NotificationCenter />

                        {/* Profile Menu */}
                        <IconButton onClick={handleProfileMenuOpen}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#ef4444' }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
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
                            <MenuItem onClick={() => { navigate('/admin/settings'); handleProfileMenuClose(); }}>
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
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            mt: '64px',
                            height: 'calc(100vh - 64px)'
                        }
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
                    mt: '80px', // AppBar height + spacing
                    minHeight: 'calc(100vh - 80px)'
                }}
            >
                {/* Role Badge */}
                <Box sx={{ mb: 2 }}>
                    <Chip
                        label="Quản trị viên"
                        color="error"
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