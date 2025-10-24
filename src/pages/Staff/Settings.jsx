import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    Payment as PaymentIcon,
    DirectionsCar as VehicleIcon,
    Schedule as ScheduleIcon,
    Email as EmailIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';

const Settings = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        systemName: 'EV Share Platform',
        systemEmail: 'support@evshare.com',
        systemPhone: '1900-xxxx',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        phoneVerificationRequired: false,
        autoApproveVehicles: false,
        maxVehiclesPerUser: 5,
        minBookingHours: 2,
        maxBookingDays: 30,
        cancellationDeadlineHours: 24
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false,
        pushNotificationsEnabled: true,
        bookingConfirmation: true,
        bookingReminder: true,
        paymentConfirmation: true,
        maintenanceReminder: true,
        systemAnnouncements: true,
        marketingEmails: false,
        reminderBeforeHours: 24
    });

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        currency: 'VND',
        taxRate: 10,
        serviceFee: 5,
        lateFeePerDay: 50000,
        depositPercentage: 20,
        refundProcessingDays: 7,
        acceptedPaymentMethods: ['card', 'bank_transfer', 'e_wallet'],
        autoRefundEnabled: true
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        sessionTimeout: 60,
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireNumbers: true,
        passwordRequireSpecialChars: true,
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        twoFactorEnabled: false,
        ipWhitelistEnabled: false,
        allowedIPs: []
    });

    // Email Templates
    const [emailTemplates, setEmailTemplates] = useState([
        { id: 1, name: 'Xác nhận đăng ký', subject: 'Chào mừng đến với EV Share', type: 'registration' },
        { id: 2, name: 'Xác nhận booking', subject: 'Đặt xe thành công', type: 'booking' },
        { id: 3, name: 'Nhắc nhở thanh toán', subject: 'Nhắc nhở thanh toán', type: 'payment' },
        { id: 4, name: 'Xác nhận hủy', subject: 'Xác nhận hủy đặt xe', type: 'cancellation' }
    ]);

    const [editTemplateDialog, setEditTemplateDialog] = useState({ open: false, template: null });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            // API calls to load settings would go here
            // Mock data is already set in state
            console.log('✅ Settings loaded successfully');
        } catch (err) {
            console.error('❌ Error loading settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Save settings based on active tab
            let settingsData = {};
            switch (activeTab) {
                case 0:
                    settingsData = generalSettings;
                    break;
                case 1:
                    settingsData = notificationSettings;
                    break;
                case 2:
                    settingsData = paymentSettings;
                    break;
                case 3:
                    settingsData = securitySettings;
                    break;
                default:
                    break;
            }

            // API call would go here
            console.log('💾 Saving settings:', settingsData);
            
            setMessage('Cài đặt đã được lưu thành công!');
        } catch (err) {
            setError('Lỗi khi lưu cài đặt: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSettings = () => {
        if (window.confirm('Bạn có chắc muốn khôi phục cài đặt mặc định?')) {
            loadSettings();
            setMessage('Đã khôi phục cài đặt mặc định');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    Cài đặt hệ thống
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleResetSettings}
                    >
                        Khôi phục mặc định
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveSettings}
                        disabled={loading}
                    >
                        Lưu thay đổi
                    </Button>
                </Stack>
            </Box>

            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab icon={<SettingsIcon />} label="Cài đặt chung" />
                <Tab icon={<NotificationsIcon />} label="Thông báo" />
                <Tab icon={<PaymentIcon />} label="Thanh toán" />
                <Tab icon={<SecurityIcon />} label="Bảo mật" />
                <Tab icon={<EmailIcon />} label="Email Templates" />
            </Tabs>

            {/* General Settings Tab */}
            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Thông tin hệ thống
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Tên hệ thống"
                                        value={generalSettings.systemName}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email hỗ trợ"
                                        type="email"
                                        value={generalSettings.systemEmail}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, systemEmail: e.target.value })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Số điện thoại"
                                        value={generalSettings.systemPhone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, systemPhone: e.target.value })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Địa chỉ"
                                        value={generalSettings.address}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                                        multiline
                                        rows={2}
                                        fullWidth
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Cài đặt chức năng
                                </Typography>
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={generalSettings.maintenanceMode}
                                                onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                                            />
                                        }
                                        label="Chế độ bảo trì"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={generalSettings.registrationEnabled}
                                                onChange={(e) => setGeneralSettings({ ...generalSettings, registrationEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Cho phép đăng ký mới"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={generalSettings.emailVerificationRequired}
                                                onChange={(e) => setGeneralSettings({ ...generalSettings, emailVerificationRequired: e.target.checked })}
                                            />
                                        }
                                        label="Yêu cầu xác thực email"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={generalSettings.autoApproveVehicles}
                                                onChange={(e) => setGeneralSettings({ ...generalSettings, autoApproveVehicles: e.target.checked })}
                                            />
                                        }
                                        label="Tự động duyệt xe"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Giới hạn & Quy định
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            label="Số xe tối đa/người dùng"
                                            type="number"
                                            value={generalSettings.maxVehiclesPerUser}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, maxVehiclesPerUser: parseInt(e.target.value) })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            label="Booking tối thiểu (giờ)"
                                            type="number"
                                            value={generalSettings.minBookingHours}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, minBookingHours: parseInt(e.target.value) })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            label="Booking tối đa (ngày)"
                                            type="number"
                                            value={generalSettings.maxBookingDays}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, maxBookingDays: parseInt(e.target.value) })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            label="Hủy trước (giờ)"
                                            type="number"
                                            value={generalSettings.cancellationDeadlineHours}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, cancellationDeadlineHours: parseInt(e.target.value) })}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Notification Settings Tab */}
            {activeTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Kênh thông báo
                                </Typography>
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.emailNotificationsEnabled}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotificationsEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Thông báo Email"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.smsNotificationsEnabled}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotificationsEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Thông báo SMS"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.pushNotificationsEnabled}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotificationsEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Push Notifications"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Loại thông báo
                                </Typography>
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.bookingConfirmation}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, bookingConfirmation: e.target.checked })}
                                            />
                                        }
                                        label="Xác nhận đặt xe"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.bookingReminder}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, bookingReminder: e.target.checked })}
                                            />
                                        }
                                        label="Nhắc nhở booking"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.paymentConfirmation}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentConfirmation: e.target.checked })}
                                            />
                                        }
                                        label="Xác nhận thanh toán"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.maintenanceReminder}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, maintenanceReminder: e.target.checked })}
                                            />
                                        }
                                        label="Nhắc bảo trì"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.systemAnnouncements}
                                                onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAnnouncements: e.target.checked })}
                                            />
                                        }
                                        label="Thông báo hệ thống"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Cài đặt nhắc nhở
                                </Typography>
                                <TextField
                                    label="Nhắc trước (giờ)"
                                    type="number"
                                    value={notificationSettings.reminderBeforeHours}
                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, reminderBeforeHours: parseInt(e.target.value) })}
                                    sx={{ maxWidth: 200 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Cấu hình thanh toán
                                </Typography>
                                <Stack spacing={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Đơn vị tiền tệ</InputLabel>
                                        <Select
                                            value={paymentSettings.currency}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                                            label="Đơn vị tiền tệ"
                                        >
                                            <MenuItem value="VND">VND - Việt Nam Đồng</MenuItem>
                                            <MenuItem value="USD">USD - US Dollar</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Thuế VAT (%)"
                                        type="number"
                                        value={paymentSettings.taxRate}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phí dịch vụ (%)"
                                        type="number"
                                        value={paymentSettings.serviceFee}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, serviceFee: parseFloat(e.target.value) })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phí trễ hạn (VNĐ/ngày)"
                                        type="number"
                                        value={paymentSettings.lateFeePerDay}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, lateFeePerDay: parseFloat(e.target.value) })}
                                        fullWidth
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Cài đặt đặt cọc & hoàn tiền
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Đặt cọc (%)"
                                        type="number"
                                        value={paymentSettings.depositPercentage}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, depositPercentage: parseFloat(e.target.value) })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Thời gian xử lý hoàn tiền (ngày)"
                                        type="number"
                                        value={paymentSettings.refundProcessingDays}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, refundProcessingDays: parseInt(e.target.value) })}
                                        fullWidth
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={paymentSettings.autoRefundEnabled}
                                                onChange={(e) => setPaymentSettings({ ...paymentSettings, autoRefundEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Tự động hoàn tiền"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Phương thức thanh toán
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip
                                        label="Thẻ tín dụng/ghi nợ"
                                        color={paymentSettings.acceptedPaymentMethods.includes('card') ? 'primary' : 'default'}
                                        onClick={() => {
                                            const methods = paymentSettings.acceptedPaymentMethods;
                                            if (methods.includes('card')) {
                                                setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods.filter(m => m !== 'card') });
                                            } else {
                                                setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: [...methods, 'card'] });
                                            }
                                        }}
                                    />
                                    <Chip
                                        label="Chuyển khoản ngân hàng"
                                        color={paymentSettings.acceptedPaymentMethods.includes('bank_transfer') ? 'primary' : 'default'}
                                        onClick={() => {
                                            const methods = paymentSettings.acceptedPaymentMethods;
                                            if (methods.includes('bank_transfer')) {
                                                setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods.filter(m => m !== 'bank_transfer') });
                                            } else {
                                                setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: [...methods, 'bank_transfer'] });
                                            }
                                        }}
                                    />
                                    <Chip
                                        label="Ví điện tử"
                                        color={paymentSettings.acceptedPaymentMethods.includes('e_wallet') ? 'primary' : 'default'}
                                        onClick={() => {
                                            const methods = paymentSettings.acceptedPaymentMethods;
                                            if (methods.includes('e_wallet')) {
                                                setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: methods.filter(m => m !== 'e_wallet') });
                                            } else {
                                                setPaymentSettings({ ...paymentSettings, acceptedPaymentMethods: [...methods, 'e_wallet'] });
                                            }
                                        }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Security Settings Tab */}
            {activeTab === 3 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Bảo mật tài khoản
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Timeout phiên (phút)"
                                        type="number"
                                        value={securitySettings.sessionTimeout}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Độ dài mật khẩu tối thiểu"
                                        type="number"
                                        value={securitySettings.passwordMinLength}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                                        fullWidth
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={securitySettings.passwordRequireUppercase}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, passwordRequireUppercase: e.target.checked })}
                                            />
                                        }
                                        label="Yêu cầu chữ hoa"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={securitySettings.passwordRequireNumbers}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, passwordRequireNumbers: e.target.checked })}
                                            />
                                        }
                                        label="Yêu cầu số"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={securitySettings.passwordRequireSpecialChars}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, passwordRequireSpecialChars: e.target.checked })}
                                            />
                                        }
                                        label="Yêu cầu ký tự đặc biệt"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Bảo vệ đăng nhập
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Số lần đăng nhập sai tối đa"
                                        type="number"
                                        value={securitySettings.maxLoginAttempts}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Thời gian khóa tài khoản (phút)"
                                        type="number"
                                        value={securitySettings.lockoutDuration}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, lockoutDuration: parseInt(e.target.value) })}
                                        fullWidth
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={securitySettings.twoFactorEnabled}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Xác thực 2 yếu tố (2FA)"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={securitySettings.ipWhitelistEnabled}
                                                onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelistEnabled: e.target.checked })}
                                            />
                                        }
                                        label="Danh sách IP cho phép"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Email Templates Tab */}
            {activeTab === 4 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Mẫu email tự động
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setEditTemplateDialog({ open: true, template: null })}
                                    >
                                        Thêm mẫu mới
                                    </Button>
                                </Box>
                                <Stack spacing={2}>
                                    {emailTemplates.map((template) => (
                                        <Card key={template.id} variant="outlined">
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {template.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Tiêu đề: {template.subject}
                                                        </Typography>
                                                        <Chip label={template.type} size="small" sx={{ mt: 1 }} />
                                                    </Box>
                                                    <Stack direction="row" spacing={1}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setEditTemplateDialog({ open: true, template })}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton size="small" color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Stack>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Notifications */}
            <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
                <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
            </Snackbar>

            {/* Edit Template Dialog */}
            <Dialog
                open={editTemplateDialog.open}
                onClose={() => setEditTemplateDialog({ open: false, template: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editTemplateDialog.template ? 'Chỉnh sửa mẫu email' : 'Thêm mẫu email mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Tên mẫu"
                            defaultValue={editTemplateDialog.template?.name || ''}
                            fullWidth
                        />
                        <TextField
                            label="Tiêu đề email"
                            defaultValue={editTemplateDialog.template?.subject || ''}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Loại mẫu</InputLabel>
                            <Select
                                defaultValue={editTemplateDialog.template?.type || ''}
                                label="Loại mẫu"
                            >
                                <MenuItem value="registration">Đăng ký</MenuItem>
                                <MenuItem value="booking">Booking</MenuItem>
                                <MenuItem value="payment">Thanh toán</MenuItem>
                                <MenuItem value="cancellation">Hủy đặt xe</MenuItem>
                                <MenuItem value="maintenance">Bảo trì</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Nội dung email"
                            multiline
                            rows={10}
                            fullWidth
                            placeholder="Nhập nội dung email (hỗ trợ HTML)..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditTemplateDialog({ open: false, template: null })}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setEditTemplateDialog({ open: false, template: null });
                            setMessage('Mẫu email đã được lưu');
                        }}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Settings;
