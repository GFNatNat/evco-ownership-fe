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
    TextField,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    Tabs,
    Tab,
    Badge,
    Divider,
    Stack,
    Menu,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Notifications,
    NotificationsActive,
    MarkEmailRead,
    MarkEmailUnread,
    Delete,
    Send,
    Group,
    Person,
    FilterList,
    Refresh,
    MoreVert,
    CheckBox,
    CheckBoxOutlineBlank,
    SelectAll
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import notificationApi from '../../api/notificationApi';
import userApi from '../../api/userApi';

const NotificationManagement = () => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
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

    // Admin functions states
    const [users, setUsers] = useState([]);
    const [sendDialog, setSendDialog] = useState({ open: false });
    const [bulkDialog, setBulkDialog] = useState({ open: false });
    const [newNotification, setNewNotification] = useState({
        notificationType: 'System',
        userIds: [],
        message: '',
        additionalData: {}
    });

    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [menuAnchor, setMenuAnchor] = useState(null);

    // Load initial data
    useEffect(() => {
        loadNotifications();
        loadUnreadCount();
    }, [pagination, filters]);

    useEffect(() => {
        if (currentTab === 1) { // Admin tab
            loadUsers();
        }
    }, [currentTab]);

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

    const loadUsers = async () => {
        try {
            const response = await userApi.getAllUsers();
            setUsers(response.data || []);
        } catch (error) {
            console.error('Error loading users:', error);
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

    const handleSendNotification = async () => {
        if (!newNotification.message.trim()) {
            showAlert('warning', 'Vui lòng nhập nội dung thông báo');
            return;
        }

        if (newNotification.userIds.length === 0) {
            showAlert('warning', 'Vui lòng chọn người nhận');
            return;
        }

        setLoading(true);
        try {
            if (newNotification.userIds.length === 1) {
                await notificationApi.sendNotificationToUser({
                    userId: newNotification.userIds[0],
                    notificationType: newNotification.notificationType,
                    additionalData: JSON.stringify({
                        message: newNotification.message,
                        ...newNotification.additionalData
                    })
                });
            } else {
                await notificationApi.createNotification({
                    notificationType: newNotification.notificationType,
                    userIds: newNotification.userIds,
                    additionalData: JSON.stringify({
                        message: newNotification.message,
                        ...newNotification.additionalData
                    })
                });
            }

            setSendDialog({ open: false });
            setNewNotification({
                notificationType: 'System',
                userIds: [],
                message: '',
                additionalData: {}
            });

            showAlert('success', 'Thông báo đã được gửi thành công');
        } catch (error) {
            showAlert('error', 'Lỗi khi gửi thông báo: ' + error.message);
        } finally {
            setLoading(false);
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

    const SendNotificationDialog = () => (
        <Dialog open={sendDialog.open} onClose={() => setSendDialog({ open: false })} maxWidth="md" fullWidth>
            <DialogTitle>Gửi thông báo</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Loại thông báo</InputLabel>
                            <Select
                                value={newNotification.notificationType}
                                onChange={(e) => setNewNotification(prev => ({ ...prev, notificationType: e.target.value }))}
                                label="Loại thông báo"
                            >
                                <MenuItem value="System">Hệ thống</MenuItem>
                                <MenuItem value="Booking">Đặt xe</MenuItem>
                                <MenuItem value="Payment">Thanh toán</MenuItem>
                                <MenuItem value="Maintenance">Bảo trì</MenuItem>
                                <MenuItem value="Voting">Bình chọn</MenuItem>
                                <MenuItem value="Report">Báo cáo</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Người nhận</InputLabel>
                            <Select
                                multiple
                                value={newNotification.userIds}
                                onChange={(e) => setNewNotification(prev => ({ ...prev, userIds: e.target.value }))}
                                label="Người nhận"
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((userId) => {
                                            const user = users.find(u => u.userId === userId);
                                            return (
                                                <Chip
                                                    key={userId}
                                                    label={user ? user.fullName : userId}
                                                    size="small"
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user.userId} value={user.userId}>
                                        <Checkbox checked={newNotification.userIds.indexOf(user.userId) > -1} />
                                        <ListItemText primary={user.fullName} secondary={user.email} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Nội dung thông báo"
                            value={newNotification.message}
                            onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Nhập nội dung thông báo..."
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSendDialog({ open: false })}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSendNotification}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                >
                    Gửi thông báo
                </Button>
            </DialogActions>
        </Dialog>
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

                <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
                    <Tab label="Thông báo của tôi" />
                    <Tab label="Quản lý (Admin)" />
                </Tabs>

                {currentTab === 0 && (
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
                )}

                {currentTab === 1 && (
                    <Box>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button
                                    variant="contained"
                                    startIcon={<Send />}
                                    onClick={() => setSendDialog({ open: true })}
                                >
                                    Gửi thông báo
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Group />}
                                    onClick={() => {
                                        // TODO: Implement bulk notification to all users
                                        showAlert('info', 'Chức năng gửi thông báo hàng loạt đang được phát triển');
                                    }}
                                >
                                    Gửi hàng loạt
                                </Button>
                            </Stack>
                        </Paper>

                        <Typography variant="body2" color="textSecondary">
                            Quản lý gửi thông báo cho người dùng. Chỉ Admin mới có quyền truy cập chức năng này.
                        </Typography>
                    </Box>
                )}

                {/* Dialogs */}
                <SendNotificationDialog />
            </Box>
        </LocalizationProvider>
    );
};

export default NotificationManagement;