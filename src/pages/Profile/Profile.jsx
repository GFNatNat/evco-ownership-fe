import React from 'react';
import {
    Card, CardContent, Typography, Grid, TextField, Button,
    Stack, Snackbar, Alert, Avatar, Divider, Box, Tabs, Tab,
    Switch, FormControlLabel, IconButton, Chip
} from '@mui/material';
import { PhotoCamera, Security, Notifications, Edit, DirectionsCar, Assessment } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import profileApi from '../../api/profileApi';
import authApi from '../../api/authApi';
import fileUploadApi from '../../api/fileUploadApi';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [tabValue, setTabValue] = React.useState(0);
    const [profile, setProfile] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        profilePictureUrl: '',
    });
    const [passwordForm, setPasswordForm] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [securitySettings, setSecuritySettings] = React.useState({
        twoFactorEnabled: false,
        emailVerified: false,
        phoneVerified: false,
    });
    const [notificationPrefs, setNotificationPrefs] = React.useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        bookingReminders: true,
        paymentNotifications: true,
    });
    const [activitySummary, setActivitySummary] = React.useState({
        totalBookings: 0,
        totalPayments: 0,
        totalVehicles: 0
    });
    const [vehicles, setVehicles] = React.useState([]);
    const [licenseForm, setLicenseForm] = React.useState({
        licenseNumber: '',
        issueDate: '',
        firstName: '',
        lastName: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    // Load profile data
    React.useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await profileApi.getProfile();
            if (res.data) {
                setProfile(res.data);
            }
        } catch (err) {
            setError('Không thể tải thông tin profile');
        }
    };

    // These endpoints are not in the API specification, commented out for now
    // Will need to implement when backend API is ready
    
    // const loadSecuritySettings = async () => {
    //     try {
    //         const res = await profileApi.getSecuritySettings();
    //         if (res.data) {
    //             setSecuritySettings(res.data);
    //         }
    //     } catch (err) {
    //         console.error('Failed to load security settings:', err);
    //     }
    // };

    const updateProfile = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await profileApi.updateProfile(profile);
            setMessage('Cập nhật thông tin thành công');
            // Update user in context if needed
            setUser({ ...user, ...profile });
        } catch (err) {
            setError(err?.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async () => {
        setMessage('');
        setError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        try {
            await profileApi.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword,
            });
            setMessage('Đổi mật khẩu thành công');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err?.response?.data?.message || 'Đổi mật khẩu thất bại');
        }
    };

    const uploadProfilePicture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await profileApi.uploadProfilePicture(formData);
            setProfile({ ...profile, profilePictureUrl: res.data.profileImageUrl || res.data.url });
            setMessage('Cập nhật ảnh đại diện thành công');
        } catch (err) {
            setError('Upload ảnh đại diện thất bại');
        }
    };

    const toggle2FA = async () => {
        try {
            if (securitySettings.twoFactorEnabled) {
                await profileApi.disable2FA(passwordForm.currentPassword);
                setSecuritySettings({ ...securitySettings, twoFactorEnabled: false });
                setMessage('Đã tắt xác thực 2 bước');
            } else {
                await profileApi.enable2FA(passwordForm.currentPassword);
                setSecuritySettings({ ...securitySettings, twoFactorEnabled: true });
                setMessage('Đã bật xác thực 2 bước');
            }
        } catch (err) {
            setError('Không thể thay đổi cài đặt xác thực 2 bước');
        }
    };

    const updateNotificationPreferences = async () => {
        try {
            await profileApi.updateNotificationPreferences(notificationPrefs);
            setMessage('Cập nhật cài đặt thông báo thành công');
        } catch (err) {
            setError('Cập nhật cài đặt thông báo thất bại');
        }
    };

    const verifyLicense = async () => {
        setMessage('');
        setError('');
        try {
            const res = await authApi.verifyLicense(licenseForm);
            if (res.data) {
                setMessage('Xác minh giấy phép lái xe thành công');
                setLicenseForm({
                    licenseNumber: '',
                    issueDate: '',
                    firstName: '',
                    lastName: ''
                });
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Xác minh giấy phép thất bại');
        }
    };

    const TabPanel = ({ children, value, index }) => (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                    Quản lý tài khoản
                </Typography>
            </Grid>

            {/* Profile Header */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box position="relative">
                                <Avatar
                                    sx={{ width: 100, height: 100 }}
                                    src={profile.profilePictureUrl}
                                >
                                    {profile.firstName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }}
                                    size="small"
                                    component="label"
                                >
                                    <PhotoCamera fontSize="small" />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={uploadProfilePicture}
                                    />
                                </IconButton>
                            </Box>
                            <Box>
                                <Typography variant="h6">{profile.firstName} {profile.lastName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user?.role}
                                </Typography>
                                <Box display="flex" gap={1} mt={1}>
                                    <Chip
                                        size="small"
                                        label={securitySettings.emailVerified ? "Email đã xác thực" : "Email chưa xác thực"}
                                        color={securitySettings.emailVerified ? "success" : "warning"}
                                    />
                                    <Chip
                                        size="small"
                                        label={securitySettings.phoneVerified ? "SĐT đã xác thực" : "SĐT chưa xác thực"}
                                        color={securitySettings.phoneVerified ? "success" : "warning"}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Tabs */}
            <Grid item xs={12}>
                <Card>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                        <Tab label="Thông tin cá nhân" />
                        <Tab label="Bảo mật" icon={<Security />} />
                        <Tab label="Thông báo" icon={<Notifications />} />
                        <Tab label="Hoạt động" icon={<Assessment />} />
                        <Tab label="Phương tiện" icon={<DirectionsCar />} />
                    </Tabs>

                    {/* Tab 1: Profile Information */}
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Tên"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    value={profile.phoneNumber}
                                    onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày sinh"
                                    type="date"
                                    value={profile.dateOfBirth}
                                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Giới tính"
                                    value={profile.gender}
                                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    multiline
                                    rows={2}
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={updateProfile}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                                </Button>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 2: Security Settings */}
                    <TabPanel value={tabValue} index={1}>
                        <Stack spacing={3}>
                            {/* Change Password */}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Đổi mật khẩu
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Mật khẩu hiện tại"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Mật khẩu mới"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Xác nhận mật khẩu mới"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant="outlined"
                                                onClick={changePassword}
                                                disabled={!passwordForm.currentPassword || !passwordForm.newPassword}
                                            >
                                                Đổi mật khẩu
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Two-Factor Authentication */}
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Xác thực 2 bước
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2">
                                            Tăng cường bảo mật tài khoản với xác thực 2 bước
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={securitySettings.twoFactorEnabled}
                                                    onChange={toggle2FA}
                                                />
                                            }
                                            label={securitySettings.twoFactorEnabled ? "Đã bật" : "Đã tắt"}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Stack>
                    </TabPanel>

                    {/* Tab 3: Notification Preferences */}
                    <TabPanel value={tabValue} index={2}>
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationPrefs.emailNotifications}
                                        onChange={(e) => setNotificationPrefs({
                                            ...notificationPrefs,
                                            emailNotifications: e.target.checked
                                        })}
                                    />
                                }
                                label="Thông báo qua Email"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationPrefs.smsNotifications}
                                        onChange={(e) => setNotificationPrefs({
                                            ...notificationPrefs,
                                            smsNotifications: e.target.checked
                                        })}
                                    />
                                }
                                label="Thông báo qua SMS"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationPrefs.pushNotifications}
                                        onChange={(e) => setNotificationPrefs({
                                            ...notificationPrefs,
                                            pushNotifications: e.target.checked
                                        })}
                                    />
                                }
                                label="Thông báo đẩy"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationPrefs.bookingReminders}
                                        onChange={(e) => setNotificationPrefs({
                                            ...notificationPrefs,
                                            bookingReminders: e.target.checked
                                        })}
                                    />
                                }
                                label="Nhắc nhở đặt lịch"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationPrefs.paymentNotifications}
                                        onChange={(e) => setNotificationPrefs({
                                            ...notificationPrefs,
                                            paymentNotifications: e.target.checked
                                        })}
                                    />
                                }
                                label="Thông báo thanh toán"
                            />
                            <Button
                                variant="contained"
                                onClick={updateNotificationPreferences}
                                sx={{ mt: 2 }}
                            >
                                Lưu cài đặt thông báo
                            </Button>
                        </Stack>
                    </TabPanel>

                    {/* Tab 4: Activity Summary */}
                    <TabPanel value={tabValue} index={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Tổng quan hoạt động
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h4" color="primary">
                                            {activitySummary.totalBookings}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tổng số lượt đặt xe
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h4" color="success.main">
                                            {activitySummary.totalPayments}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tổng số giao dịch
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h4" color="info.main">
                                            {activitySummary.totalVehicles}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Số xe tham gia
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 5: Vehicles List */}
                    <TabPanel value={tabValue} index={4}>
                        <Stack spacing={2}>
                            <Typography variant="h6" gutterBottom>
                                Danh sách phương tiện của tôi ({vehicles.length})
                            </Typography>
                            {vehicles.length === 0 ? (
                                <Alert severity="info">
                                    Bạn chưa tham gia sở hữu phương tiện nào
                                </Alert>
                            ) : (
                                <Grid container spacing={2}>
                                    {vehicles.map((vehicle) => (
                                        <Grid item xs={12} sm={6} md={4} key={vehicle.vehicleId}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6">
                                                        {vehicle.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Biển số: {vehicle.licensePlate}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Stack>
                    </TabPanel>
                </Card>
            </Grid>

            {/* License Verification Card */}
            {user?.role === 'CoOwner' && (
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Xác minh giấy phép lái xe
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Số giấy phép"
                                        value={licenseForm.licenseNumber}
                                        onChange={(e) => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ngày cấp"
                                        type="date"
                                        value={licenseForm.issueDate}
                                        onChange={(e) => setLicenseForm({ ...licenseForm, issueDate: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tên"
                                        value={licenseForm.firstName}
                                        onChange={(e) => setLicenseForm({ ...licenseForm, firstName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Họ"
                                        value={licenseForm.lastName}
                                        onChange={(e) => setLicenseForm({ ...licenseForm, lastName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        onClick={verifyLicense}
                                        disabled={!licenseForm.licenseNumber || !licenseForm.issueDate || !licenseForm.firstName || !licenseForm.lastName}
                                    >
                                        Xác minh giấy phép
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            )}

            {/* Notifications */}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage('')}
            >
                <Alert severity="success" onClose={() => setMessage('')}>
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
            >
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            </Snackbar>
        </Grid>
    );
}