import React from 'react';
import {
    Card, CardContent, Typography, Grid, Switch, TextField, Button,
    FormControlLabel, Divider, Box, Stack, Chip, Alert, Snackbar,
    Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem,
    ListItemText, ListItemSecondaryAction, IconButton
} from '@mui/material';
import { Save, Refresh, Security, Notifications, Email, Sms } from '@mui/icons-material';
import adminApi from '../../api/admin';

export default function Settings() {
    const [settings, setSettings] = React.useState({
        // System Settings
        systemName: 'EV Co-Ownership Platform',
        systemEmail: 'admin@evco.com',
        maintenanceMode: false,
        userRegistration: true,
        emailVerification: true,

        // Security Settings
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        passwordMinLength: 6,
        requireTwoFactor: false,

        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,

        // Business Settings
        maxVehiclesPerUser: 5,
        maxOwnersPerVehicle: 4,
        bookingAdvanceDays: 30,
        cancellationHours: 24,

        // Payment Settings
        paymentGateway: 'VNPay',
        autoPayment: false,
        paymentReminder: true,
        lateFeePercentage: 5
    });

    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');
    const [unsavedChanges, setUnsavedChanges] = React.useState(false);

    React.useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            // Load settings from API
            const response = await adminApi.settings.get();
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }));
            }
        } catch (err) {
            setError('Không thể tải cài đặt hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setUnsavedChanges(true);
    };

    const saveSettings = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await adminApi.settings.update(settings);
            setMessage('Cập nhật cài đặt thành công');
            setUnsavedChanges(false);
        } catch (err) {
            setError('Cập nhật cài đặt thất bại');
        } finally {
            setLoading(false);
        }
    };

    const resetSettings = async () => {
        if (!window.confirm('Bạn có chắc muốn khôi phục cài đặt mặc định?')) return;

        try {
            await loadSettings();
            setMessage('Đã khôi phục cài đặt mặc định');
            setUnsavedChanges(false);
        } catch (err) {
            setError('Khôi phục cài đặt thất bại');
        }
    };

    return (
        <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
                <Card sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Cấu hình hệ thống
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                    Quản lý cài đặt, bảo mật và tùy chỉnh hệ thống
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2}>
                                {unsavedChanges && (
                                    <Chip
                                        label="Có thay đổi chưa lưu"
                                        color="warning"
                                        size="small"
                                    />
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={resetSettings}
                                >
                                    Khôi phục
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={saveSettings}
                                    disabled={loading || !unsavedChanges}
                                >
                                    Lưu cài đặt
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* System Settings */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Cài đặt hệ thống
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Tên hệ thống"
                                value={settings.systemName}
                                onChange={(e) => handleSettingChange('systemName', e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Email hệ thống"
                                type="email"
                                value={settings.systemEmail}
                                onChange={(e) => handleSettingChange('systemEmail', e.target.value)}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.maintenanceMode}
                                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                                    />
                                }
                                label="Chế độ bảo trì"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.userRegistration}
                                        onChange={(e) => handleSettingChange('userRegistration', e.target.checked)}
                                    />
                                }
                                label="Cho phép đăng ký người dùng"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailVerification}
                                        onChange={(e) => handleSettingChange('emailVerification', e.target.checked)}
                                    />
                                }
                                label="Yêu cầu xác thực email"
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Cài đặt bảo mật
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Số lần đăng nhập sai tối đa"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                                inputProps={{ min: 1, max: 10 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Thời gian hết hạn phiên (phút)"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                                inputProps={{ min: 5, max: 120 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Độ dài mật khẩu tối thiểu"
                                value={settings.passwordMinLength}
                                onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                                inputProps={{ min: 4, max: 20 }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.requireTwoFactor}
                                        onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
                                    />
                                }
                                label="Bắt buộc xác thực 2 bước"
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Notification Settings */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Cài đặt thông báo
                        </Typography>
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                    />
                                }
                                label="Thông báo qua Email"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.smsNotifications}
                                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                                    />
                                }
                                label="Thông báo qua SMS"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.pushNotifications}
                                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                                    />
                                }
                                label="Thông báo đẩy"
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Business Settings */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Cài đặt kinh doanh
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Số xe tối đa mỗi người dùng"
                                value={settings.maxVehiclesPerUser}
                                onChange={(e) => handleSettingChange('maxVehiclesPerUser', parseInt(e.target.value))}
                                inputProps={{ min: 1, max: 20 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Số chủ sở hữu tối đa mỗi xe"
                                value={settings.maxOwnersPerVehicle}
                                onChange={(e) => handleSettingChange('maxOwnersPerVehicle', parseInt(e.target.value))}
                                inputProps={{ min: 2, max: 10 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Đặt lịch trước tối đa (ngày)"
                                value={settings.bookingAdvanceDays}
                                onChange={(e) => handleSettingChange('bookingAdvanceDays', parseInt(e.target.value))}
                                inputProps={{ min: 1, max: 90 }}
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="Thời gian hủy tối thiểu (giờ)"
                                value={settings.cancellationHours}
                                onChange={(e) => handleSettingChange('cancellationHours', parseInt(e.target.value))}
                                inputProps={{ min: 1, max: 72 }}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Payment Settings */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Cài đặt thanh toán
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Cổng thanh toán"
                                    value={settings.paymentGateway}
                                    onChange={(e) => handleSettingChange('paymentGateway', e.target.value)}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="VNPay">VNPay</option>
                                    <option value="ZaloPay">ZaloPay</option>
                                    <option value="MoMo">MoMo</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Phí trễ hạn (%)"
                                    value={settings.lateFeePercentage}
                                    onChange={(e) => handleSettingChange('lateFeePercentage', parseInt(e.target.value))}
                                    inputProps={{ min: 0, max: 50 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.autoPayment}
                                            onChange={(e) => handleSettingChange('autoPayment', e.target.checked)}
                                        />
                                    }
                                    label="Thanh toán tự động"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.paymentReminder}
                                            onChange={(e) => handleSettingChange('paymentReminder', e.target.checked)}
                                        />
                                    }
                                    label="Nhắc nhở thanh toán"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Notifications */}
            <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
                <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
            </Snackbar>
        </Grid>
    );
}