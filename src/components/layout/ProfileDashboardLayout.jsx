import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
    ListItemButton, ListItemText, ListItemIcon, Divider, IconButton,
    Button, Breadcrumbs, Chip, Avatar, Menu, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import Person from '@mui/icons-material/Person';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';

const drawerWidth = 280;

// Profile Navigation Menu Structure
const profileNavigation = [
    {
        section: 'Thông tin cá nhân',
        items: [
            { to: '/profile', label: 'Hồ sơ cá nhân', icon: <AccountCircleIcon /> },
            { to: '/profile/edit', label: 'Chỉnh sửa thông tin', icon: <EditIcon /> }
        ]
    },
    {
        section: 'Cài đặt',
        items: [
            { to: '/profile/settings', label: 'Cài đặt chung', icon: <SettingsIcon /> },
            { to: '/profile/security', label: 'Bảo mật', icon: <SecurityIcon /> },
            { to: '/profile/notifications', label: 'Thông báo', icon: <NotificationsIcon /> }
        ]
    },
    {
        section: 'Lịch sử',
        items: [
            { to: '/profile/activity', label: 'Lịch sử hoạt động', icon: <HistoryIcon /> }
        ]
    }
];

export default function ProfileDashboardLayout() {
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
            breadcrumbs.push({ label: 'Profile', to: '/profile' });

            const currentPage = pathSegments[pathSegments.length - 1];
            const pageLabels = {
                'edit': 'Chỉnh sửa thông tin',
                'settings': 'Cài đặt chung',
                'security': 'Bảo mật',
                'notifications': 'Thông báo',
                'activity': 'Lịch sử hoạt động'
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
                <Person sx={{ fontSize: 28, color: '#8b5cf6' }} />
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#8b5cf6' }}>
                        EV Share
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Profile Settings
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* User Info */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Avatar
                    sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 1,
                        bgcolor: '#8b5cf6',
                        fontSize: '24px'
                    }}
                >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                    {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {user?.email || 'user@example.com'}
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Chip
                        label={user?.role === 'Admin' ? 'Quản trị viên' :
                            user?.role === 'Staff' ? 'Nhân viên' : 'Đồng sở hữu'}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Box>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            {profileNavigation.map((section) => (
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
                                            bgcolor: 'rgba(139, 92, 246, 0.1)',
                                            color: '#8b5cf6',
                                            '& .MuiListItemIcon-root': { color: '#8b5cf6' }
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
                                            color: index === breadcrumbs.length - 1 ? '#8b5cf6' : '#6b7280',
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
                                Profile Settings
                            </Typography>
                        )}
                    </Box>

                    {/* Quick Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: '#8b5cf6',
                                '&:hover': { bgcolor: '#7c3aed' },
                                textTransform: 'none'
                            }}
                            onClick={() => navigate('/profile/edit')}
                        >
                            Chỉnh sửa
                        </Button>

                        <NotificationCenter />

                        {/* Back to Dashboard */}
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                const dashboardPath = user?.role === 'Admin' ? '/admin' :
                                    user?.role === 'Staff' ? '/staff' : '/coowner';
                                navigate(dashboardPath);
                            }}
                        >
                            Về Dashboard
                        </Button>

                        {/* Profile Menu */}
                        <IconButton onClick={handleProfileMenuOpen}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#8b5cf6' }}>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={profileMenuAnchor}
                            open={Boolean(profileMenuAnchor)}
                            onClose={handleProfileMenuClose}
                        >
                            <MenuItem onClick={() => {
                                const dashboardPath = user?.role === 'Admin' ? '/admin' :
                                    user?.role === 'Staff' ? '/staff' : '/coowner';
                                navigate(dashboardPath);
                                handleProfileMenuClose();
                            }}>
                                <AccountCircleIcon sx={{ mr: 1 }} /> Dashboard
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
                {/* Page Content */}
                <Outlet />
            </Box>
        </Box>
    );
}