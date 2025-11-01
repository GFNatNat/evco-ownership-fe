import React from 'react';
import {
    IconButton, Badge, Menu, MenuItem, Typography, Box,
    List, ListItem, ListItemText, ListItemAvatar, Avatar,
    Divider, Button, Chip
} from '@mui/material';
import { Notifications, NotificationsNone, Circle } from '@mui/icons-material';
import authApi from '../../api/authApi';

export default function NotificationCenter() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notifications, setNotifications] = React.useState([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        loadNotifications();
        loadUnreadCount();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            loadUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const res = await authApi.getNotifications({ limit: 10 });
            setNotifications(res.data?.items || res.data || []);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const res = await authApi.getUnreadCount();
            setUnreadCount(res.data?.count || 0);
        } catch (err) {
            console.error('Failed to load unread count:', err);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        if (notifications.length === 0) {
            loadNotifications();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await authApi.markAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await authApi.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const getNotificationIcon = (type) => {
        const iconMap = {
            'vehicle_invitation': '🚗',
            'vehicle_verification': '✅',
            'payment_due': '💰',
            'schedule_reminder': '📅',
            'system_update': '🔔',
            'default': '📢'
        };
        return iconMap[type] || iconMap['default'];
    };

    const getNotificationColor = (type) => {
        const colorMap = {
            'vehicle_invitation': 'primary',
            'vehicle_verification': 'success',
            'payment_due': 'warning',
            'schedule_reminder': 'info',
            'system_update': 'secondary',
        };
        return colorMap[type] || 'default';
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ mr: 1 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 360, maxHeight: 480 }
                }}
            >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Thông báo</Typography>
                        {unreadCount > 0 && (
                            <Button size="small" onClick={handleMarkAllAsRead}>
                                Đánh dấu tất cả đã đọc
                            </Button>
                        )}
                    </Box>
                </Box>

                {loading ? (
                    <MenuItem disabled>
                        <Typography>Đang tải...</Typography>
                    </MenuItem>
                ) : notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography>Không có thông báo</Typography>
                    </MenuItem>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    button
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                    sx={{
                                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                                        cursor: notification.isRead ? 'default' : 'pointer'
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'transparent', fontSize: '1.5rem' }}>
                                            {getNotificationIcon(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                    {notification.title}
                                                </Typography>
                                                {!notification.isRead && (
                                                    <Circle color="primary" sx={{ fontSize: 8 }} />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    {notification.message}
                                                </Typography>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTime(notification.createdAt)}
                                                    </Typography>
                                                    <Chip
                                                        label={notification.type}
                                                        size="small"
                                                        color={getNotificationColor(notification.type)}
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.65rem', height: 20 }}
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}

                {notifications.length > 0 && (
                    <>
                        <Divider />
                        <Box sx={{ p: 1 }}>
                            <Button fullWidth size="small" onClick={handleClose}>
                                Xem tất cả thông báo
                            </Button>
                        </Box>
                    </>
                )}
            </Menu>
        </>
    );
}