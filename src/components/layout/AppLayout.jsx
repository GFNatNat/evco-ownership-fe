import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';

const drawerWidth = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const navByRole = {
    CoOwner: [
      { to: '/dashboard/coowner', label: 'Dashboard' },
      { to: '/co-owner/account', label: 'Tài khoản & quyền sở hữu' },
      { to: '/co-owner/vehicles', label: 'Quản lý xe' },
      { to: '/co-owner/create-vehicle', label: 'Thêm xe mới' },
      { to: '/co-owner/invitations', label: 'Lời mời đồng sở hữu' },
      { to: '/co-owner/availability', label: 'Lịch trình sử dụng' },
      { to: '/co-owner/analytics', label: 'Phân tích hiệu suất' },
      { to: '/co-owner/schedule', label: 'Lịch & đặt xe' },
      { to: '/co-owner/payments', label: 'Chi phí & thanh toán' },
      { to: '/co-owner/history', label: 'Lịch sử & phân tích' },
      { to: '/co-owner/group', label: 'Nhóm đồng sở hữu' },
    ],
    Staff: [
      { to: '/dashboard/staff', label: 'Dashboard' },
      { to: '/staff/fleet', label: 'Quản lý nhóm xe' },
      { to: '/staff/vehicle-verification', label: 'Xác minh xe' },
      { to: '/staff/contracts', label: 'Hợp đồng điện tử' },
      { to: '/staff/checkin', label: 'Check-in/Check-out' },
      { to: '/staff/services', label: 'Dịch vụ xe' },
      { to: '/staff/disputes', label: 'Tranh chấp' },
    ],
    Admin: [
      { to: '/dashboard/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Quản lý người dùng' },
      { to: '/admin/licenses', label: 'Quản lý giấy phép' },
      { to: '/admin/groups', label: 'Nhóm đồng sở hữu' },
      { to: '/admin/reports', label: 'Báo cáo tài chính' },
      { to: '/admin/settings', label: 'Cấu hình hệ thống' },
    ],
  };
  const nav = navByRole[user?.role || 'CoOwner'];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {nav.map((n) => (
          <ListItem key={n.to} disablePadding>
            <ListItemButton component={Link} to={n.to} selected={location.pathname === n.to}>
              <ListItemText primary={n.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile" selected={location.pathname === '/profile'}>
            <ListItemText primary="Thông tin cá nhân" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>EV Co-ownership — {user?.role}</Typography>
          <NotificationCenter />
          <Button color="inherit" onClick={logout}>Đăng xuất</Button>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}