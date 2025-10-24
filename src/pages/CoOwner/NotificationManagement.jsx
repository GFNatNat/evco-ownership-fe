import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Checkbox,
    Switch,
    FormControlLabel,
    Badge,
    Divider,
    Stack
} from '@mui/material';
import {
    Notifications,
    NotificationsActive,
    MarkEmailRead,
    MarkEmailUnread,
    Delete,
    Refresh,
    CheckBox,
    CheckBoxOutlineBlank,
    SelectAll
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import notificationApi from '../../api/notificationApi';

const NotificationManagement = () => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        rowsPerPage: 10
    });

    // Filter states
    const [filters, setFilters] = useState({
        includeRead: true,
        notificationType: 'all',
        dateFrom: null,
        dateTo: null
    });



    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [menuAnchor, setMenuAnchor] = useState(null);

    // Load initial data
    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, [pagination, filters]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationApi.getMyNotifications({
                pageIndex: pagination.page + 1,
                pageSize: pagination.rowsPerPage,
                includeRead: filters.includeRead
            });

            setNotifications(response.data?.items || []);
            setTotalNotifications(response.data?.totalItems || 0);
        } catch (error) {
            showAlert('error', 'Không thể tải thông báo: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const response = await notificationApi.getUnreadCount();
            setUnreadCount(response.data?.count || 0);
        } catch (error) {
            console.error('Error loading unread count:', error);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    const handleSelectNotification = (notificationId) => {
        setSelectedNotifications(prev => {
            if (prev.includes(notificationId)) {
                return prev.filter(id => id !== notificationId);
            } else {
                return [...prev, notificationId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === notifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map(n => n.userNotificationId));
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationApi.markNotificationAsRead(notificationId);
            loadNotifications();
            loadUnreadCount();
            showAlert('success', 'Đã đánh dấu thông báo là đã đọc');
        } catch (error) {
            showAlert('error', 'Lỗi khi đánh dấu thông báo: ' + error.message);
        }
    };

    const handleBatchMarkAsRead = async () => {
        if (selectedNotifications.length === 0) {
            showAlert('warning', 'Vui lòng chọn thông báo để đánh dấu');
            return;
        }

        try {
            if (selectedNotifications.length === 1) {
                await notificationApi.markNotificationAsRead(selectedNotifications[0]);
            } else {
                await notificationApi.markMultipleAsRead(selectedNotifications);
            }

            setSelectedNotifications([]);
            loadNotifications();
            loadUnreadCount();
            showAlert('success', `Đã đánh dấu ${selectedNotifications.length} thông báo là đã đọc`);
        } catch (error) {
            showAlert('error', 'Lỗi khi đánh dấu thông báo: ' + error.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllNotificationsAsRead();
            loadNotifications();
            loadUnreadCount();
            showAlert('success', 'Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            showAlert('error', 'Lỗi khi đánh dấu tất cả thông báo: ' + error.message);
        }
    };

    const formatDateTime = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    const getNotificationTypeColor = (type) => {
        const typeColors = {
            'System': 'default',
            'Booking': 'primary',
            'Payment': 'success',
            'Maintenance': 'warning',
            'Voting': 'info',
            'Report': 'secondary'
        };
        return typeColors[type] || 'default';
    };

    const getNotificationTypeText = (type) => {
        const typeTexts = {
            'System': 'Hệ thống',
            'Booking': 'Đặt xe',
            'Payment': 'Thanh toán',
            'Maintenance': 'Bảo trì',
            'Voting': 'Bình chọn',
            'Report': 'Báo cáo'
        };
        return typeTexts[type] || type;
    };

    const NotificationTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < notifications.length}
                                checked={notifications.length > 0 && selectedNotifications.length === notifications.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell>Loại</TableCell>
                        <TableCell>Nội dung</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell align="center">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notifications.map((notification) => (
                        <TableRow
                            key={notification.userNotificationId}
                            sx={{
                                backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                                '&:hover': { backgroundColor: 'action.selected' }
                            }}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedNotifications.includes(notification.userNotificationId)}
                                    onChange={() => handleSelectNotification(notification.userNotificationId)}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getNotificationTypeText(notification.notificationType)}
                                    color={getNotificationTypeColor(notification.notificationType)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                                    {notification.message || 'Thông báo từ hệ thống'}
                                </Typography>
                                {notification.additionalData && (
                                    <Typography variant="caption" color="textSecondary">
                                        {JSON.parse(notification.additionalData).message}
                                    </Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {formatDateTime(notification.createdAt)}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {notification.isRead ? (
                                    <Chip label="Đã đọc" color="success" size="small" />
                                ) : (
                                    <Chip label="Chưa đọc" color="error" size="small" />
                                )}
                            </TableCell>
                            <TableCell align="center">
                                {!notification.isRead && (
                                    <Tooltip title="Đánh dấu đã đọc">
                                        <IconButton
                                            onClick={() => handleMarkAsRead(notification.userNotificationId)}
                                            size="small"
                                        >
                                            <MarkEmailRead />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={totalNotifications}
                page={pagination.page}
                onPageChange={(_, newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
                rowsPerPage={pagination.rowsPerPage}
                onRowsPerPageChange={(e) => setPagination(prev => ({ ...prev, rowsPerPage: parseInt(e.target.value, 10), page: 0 }))}
                labelRowsPerPage="Số dòng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`}
            />
        </TableContainer>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    <Badge badgeContent={unreadCount} color="error">
                        <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                    </Badge>
                    Quản lý Thông báo
                </Typography>

                {alert.show && (
                    <Alert severity={alert.type} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                <Box>
                        {/* Quick Stats */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="h6" color="error">
                                                    {unreadCount}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Chưa đọc
                                                </Typography>
                                            </Box>
                                            <NotificationsActive color="error" />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="h6" color="primary">
                                                    {totalNotifications}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Tổng số
                                                </Typography>
                                            </Box>
                                            <Notifications color="primary" />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Action Buttons */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={filters.includeRead}
                                            onChange={(e) => setFilters(prev => ({ ...prev, includeRead: e.target.checked }))}
                                        />
                                    }
                                    label="Hiển thị thông báo đã đọc"
                                />

                                <Divider orientation="vertical" flexItem />

                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={() => {
                                        loadNotifications();
                                        loadUnreadCount();
                                    }}
                                >
                                    Tải lại
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={<SelectAll />}
                                    onClick={handleBatchMarkAsRead}
                                    disabled={selectedNotifications.length === 0}
                                >
                                    Đánh dấu đã chọn ({selectedNotifications.length})
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<MarkEmailRead />}
                                    onClick={handleMarkAllAsRead}
                                    disabled={unreadCount === 0}
                                >
                                    Đánh dấu tất cả
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Notifications Table */}
                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <NotificationTable />
                        )}
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default NotificationManagement;