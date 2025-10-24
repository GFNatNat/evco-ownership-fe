import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Badge
} from '@mui/material';
import {
    NotificationsActive,
    Schedule,
    DirectionsCar,
    Send,
    Settings,
    History,
    Refresh,
    Edit,
    NotificationsOff,
    AccessTime,
    Today,
    CalendarMonth,
    TrendingUp
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import bookingReminderApi from '../../api/bookingReminderApi';

const BookingReminderManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [preferences, setPreferences] = useState({});
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [reminderHistory, setReminderHistory] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Settings form
    const [settingsForm, setSettingsForm] = useState({
        hoursBeforeBooking: 24,
        enabled: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false
    });

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Dialogs
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (tabValue === 0) {
            loadUpcomingBookings();
        } else if (tabValue === 1) {
            loadReminderHistory();
        } else if (tabValue === 2) {
            loadStatistics();
        }
    }, [tabValue]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [preferencesResponse, notificationPrefsResponse] = await Promise.all([
                bookingReminderApi.getPreferences().catch(() => ({ data: {} })),
                bookingReminderApi.getNotificationPreferences().catch(() => ({ data: {} }))
            ]);

            const prefs = preferencesResponse?.data || {};
            const notifPrefs = notificationPrefsResponse?.data || {};

            setPreferences(prefs);
            setSettingsForm({
                hoursBeforeBooking: prefs.hoursBeforeBooking || 24,
                enabled: prefs.enabled !== undefined ? prefs.enabled : true,
                emailNotifications: notifPrefs.emailEnabled !== undefined ? notifPrefs.emailEnabled : true,
                pushNotifications: notifPrefs.pushEnabled !== undefined ? notifPrefs.pushEnabled : true,
                smsNotifications: notifPrefs.smsEnabled !== undefined ? notifPrefs.smsEnabled : false
            });
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Set defaults instead of showing error
            setPreferences({});
        } finally {
            setLoading(false);
        }
    };

    const loadUpcomingBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingReminderApi.getUpcomingBookings({ daysAhead: 7 }).catch(() => ({ data: { upcomingBookings: [] } }));

            if (response?.data?.upcomingBookings) {
                const formattedBookings = response.data.upcomingBookings.map(booking =>
                    bookingReminderApi.formatReminderData(booking)
                );
                setUpcomingBookings(formattedBookings);
            } else {
                setUpcomingBookings([]);
            }
        } catch (error) {
            console.error('Error loading upcoming bookings:', error);
            setUpcomingBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const loadReminderHistory = async () => {
        try {
            setLoading(true);
            const response = await bookingReminderApi.getReminderHistory({
                pageIndex: page + 1,
                pageSize: rowsPerPage
            }).catch(() => ({ data: { items: [] } }));

            const historyData = response?.data?.items || [];
            setReminderHistory(Array.isArray(historyData) ? historyData : []);
        } catch (error) {
            console.error('Error loading reminder history:', error);
            setReminderHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            setLoading(true);
            const response = await bookingReminderApi.getStatistics();
            setStatistics(response.data || {});
        } catch (error) {
            console.error('Error loading statistics:', error);
            // Statistics might not be available for non-admin users
            setStatistics({});
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsChange = (field, value) => {
        setSettingsForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveSettings = async () => {
        try {
            // Validate settings
            const validation = bookingReminderApi.validateReminderConfig(settingsForm);
            if (!validation.isValid) {
                setError(validation.errors.join(', '));
                return;
            }

            setLoading(true);
            setError('');

            // Update reminder preferences
            await bookingReminderApi.configure({
                hoursBeforeBooking: settingsForm.hoursBeforeBooking,
                enabled: settingsForm.enabled
            });

            // Update notification preferences
            await bookingReminderApi.updateNotificationPreferences({
                emailEnabled: settingsForm.emailNotifications,
                pushEnabled: settingsForm.pushNotifications,
                smsEnabled: settingsForm.smsNotifications
            });

            setSuccess('Cài đặt đã được lưu thành công');
            setSettingsDialogOpen(false);
            await loadInitialData();
        } catch (error) {
            console.error('Error saving settings:', error);
            setError(error.response?.data?.message || 'Không thể lưu cài đặt');
        } finally {
            setLoading(false);
        }
    };

    const sendManualReminder = async (bookingId) => {
        try {
            setLoading(true);
            setError('');

            await bookingReminderApi.sendManualReminder(bookingId);

            setSuccess('Nhắc nhở đã được gửi thành công');
            setReminderDialogOpen(false);
            await loadUpcomingBookings();
        } catch (error) {
            console.error('Error sending manual reminder:', error);
            setError(error.response?.data?.message || 'Không thể gửi nhắc nhở');
        } finally {
            setLoading(false);
        }
    };

    const toggleReminders = async (enabled) => {
        try {
            setLoading(true);
            await bookingReminderApi.toggleReminders(enabled);

            setSuccess(enabled ? 'Đã bật nhắc nhở' : 'Đã tắt nhắc nhở');
            setPreferences(prev => ({ ...prev, enabled }));
        } catch (error) {
            console.error('Error toggling reminders:', error);
            setError('Không thể cập nhật trạng thái nhắc nhở');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Sent': return 'success';
            case 'Delivered': return 'info';
            case 'Failed': return 'error';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    const formatTimeUntil = (hoursUntil) => {
        if (hoursUntil < 1) {
            return `${Math.round(hoursUntil * 60)} phút`;
        } else if (hoursUntil < 24) {
            return `${Math.round(hoursUntil)} giờ`;
        } else {
            return `${Math.round(hoursUntil / 24)} ngày`;
        }
    };

    const TabPanel = ({ children, value, index, ...other }) => (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    <NotificationsActive sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Quản lý Nhắc nhở Đặt xe
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            {/* Quick Settings Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Trạng thái nhắc nhở
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {preferences.enabled ?
                                    `Nhắc nhở ${preferences.hoursBeforeBooking || 24} giờ trước khi đặt xe` :
                                    'Nhắc nhở đã bị tắt'
                                }
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={preferences.enabled || false}
                                        onChange={(e) => toggleReminders(e.target.checked)}
                                        disabled={loading}
                                    />
                                }
                                label={preferences.enabled ? 'Bật' : 'Tắt'}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<Settings />}
                                onClick={() => setSettingsDialogOpen(true)}
                            >
                                Cài đặt
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab
                            label={
                                <Badge badgeContent={upcomingBookings.length} color="primary">
                                    Đặt xe sắp tới
                                </Badge>
                            }
                            icon={<Schedule />}
                        />
                        <Tab label="Lịch sử nhắc nhở" icon={<History />} />
                        <Tab label="Thống kê" icon={<TrendingUp />} />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Đặt xe sắp tới ({upcomingBookings.length})</Typography>
                        <Button
                            variant="outlined"
                            onClick={loadUpcomingBookings}
                            startIcon={<Refresh />}
                            disabled={loading}
                        >
                            Làm mới
                        </Button>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : upcomingBookings.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Không có đặt xe nào trong 7 ngày tới
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {upcomingBookings.map((booking) => (
                                <Grid item xs={12} md={6} key={booking.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {booking.vehicleName}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {booking.licensePlate}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {booking.reminderSent ? (
                                                    <Chip
                                                        label="Đã nhắc"
                                                        color="success"
                                                        size="small"
                                                        icon={<NotificationsActive />}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Chưa nhắc"
                                                        color="warning"
                                                        size="small"
                                                        icon={<NotificationsOff />}
                                                    />
                                                )}
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Thời gian:</strong> {booking.formattedStartTime}
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Mục đích:</strong> {booking.purpose}
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Còn lại:</strong> {formatTimeUntil(booking.hoursUntilStart)}
                                                </Typography>
                                                {booking.reminderSentAt && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Đã nhắc lúc:</strong> {booking.formattedReminderSentAt}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {booking.canSendManual && (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<Send />}
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setReminderDialogOpen(true);
                                                    }}
                                                >
                                                    Gửi nhắc nhở ngay
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" gutterBottom>
                        Lịch sử nhắc nhở
                    </Typography>

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Xe</TableCell>
                                    <TableCell>Thời gian đặt</TableCell>
                                    <TableCell>Nhắc nhở lúc</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reminderHistory
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((reminder, index) => (
                                        <TableRow key={reminder.id || index}>
                                            <TableCell>
                                                {reminder.vehicleName} ({reminder.licensePlate})
                                            </TableCell>
                                            <TableCell>
                                                {new Date(reminder.bookingStartTime).toLocaleString('vi-VN')}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(reminder.sentAt).toLocaleString('vi-VN')}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={reminder.type === 'Automatic' ? 'Tự động' : 'Thủ công'}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={reminder.status}
                                                    color={getStatusColor(reminder.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={reminderHistory.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(parseInt(event.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    {Object.keys(statistics).length > 0 ? (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Schedule color="primary" sx={{ mr: 1 }} />
                                            <Typography variant="h6">Tổng nhắc nhở</Typography>
                                        </Box>
                                        <Typography variant="h3" color="primary">
                                            {statistics.totalRemindersScheduled || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Today color="secondary" sx={{ mr: 1 }} />
                                            <Typography variant="h6">Hôm nay</Typography>
                                        </Box>
                                        <Typography variant="h3" color="secondary">
                                            {statistics.remindersSentToday || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <AccessTime color="warning.main" sx={{ mr: 1 }} />
                                            <Typography variant="h6">24h tới</Typography>
                                        </Box>
                                        <Typography variant="h3" color="warning.main">
                                            {statistics.remindersScheduledNext24Hours || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <CalendarMonth color="success.main" sx={{ mr: 1 }} />
                                            <Typography variant="h6">7 ngày tới</Typography>
                                        </Box>
                                        <Typography variant="h3" color="success.main">
                                            {statistics.remindersScheduledNext7Days || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Thống kê không có sẵn
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
            </Paper>

            {/* Settings Dialog */}
            <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Cài đặt nhắc nhở đặt xe</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settingsForm.enabled}
                                        onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                                    />
                                }
                                label="Bật nhắc nhở tự động"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Nhắc nhở trước (giờ)"
                                value={settingsForm.hoursBeforeBooking}
                                onChange={(e) => handleSettingsChange('hoursBeforeBooking', parseInt(e.target.value))}
                                inputProps={{ min: 1, max: 168 }}
                                helperText="Từ 1 giờ đến 168 giờ (7 ngày)"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Phương thức thông báo
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settingsForm.emailNotifications}
                                        onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                                    />
                                }
                                label="Email"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settingsForm.pushNotifications}
                                        onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                                    />
                                }
                                label="Thông báo đẩy"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settingsForm.smsNotifications}
                                        onChange={(e) => handleSettingsChange('smsNotifications', e.target.checked)}
                                    />
                                }
                                label="SMS"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSettingsDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={saveSettings}
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : undefined}
                    >
                        Lưu cài đặt
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Manual Reminder Dialog */}
            <Dialog
                open={reminderDialogOpen}
                onClose={() => setReminderDialogOpen(false)}
            >
                <DialogTitle>Gửi nhắc nhở thủ công</DialogTitle>
                <DialogContent>
                    {selectedBooking && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body1" paragraph>
                                Bạn có chắc chắn muốn gửi nhắc nhở cho đặt xe này?
                            </Typography>

                            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Xe:</strong> {selectedBooking.vehicleName} ({selectedBooking.licensePlate})
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <strong>Thời gian:</strong> {selectedBooking.formattedStartTime}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Còn lại:</strong> {formatTimeUntil(selectedBooking.hoursUntilStart)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReminderDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={() => sendManualReminder(selectedBooking?.bookingId)}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <Send />}
                    >
                        Gửi nhắc nhở
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookingReminderManagement;