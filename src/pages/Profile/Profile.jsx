import React from 'react';
import {
    Card, CardContent, Typography, Grid, TextField, Button,
    Stack, Snackbar, Alert, Avatar, Divider, Box, Tabs, Tab,
    Switch, FormControlLabel, IconButton, Chip, MenuItem
} from '@mui/material';
import { PhotoCamera, Security, Notifications, Edit, DirectionsCar, Assessment } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../api/authApi';
import licenseApi from '../../api/licenseApi';
// fileUploadApi removed - Profile uses profileApi.uploadProfilePicture instead

export default function Profile() {
    // Tách profile (dữ liệu gốc) và profileDraft (form nhập liệu)
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
    // Khởi tạo profileDraft từ localStorage nếu có, nếu không sẽ set sau khi loadProfile
    const [profileDraft, setProfileDraft] = React.useState(() => {
        try {
            const saved = localStorage.getItem('profileDraft');
            if (saved) return JSON.parse(saved);
        } catch { }
        return null; // Sẽ set sau khi loadProfile
    });
    // Khi nhập liệu chỉ update profileDraft
    const handleProfileChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setProfileDraft((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);
    const [profileErrors, setProfileErrors] = React.useState({});
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
        expiryDate: '', // Added expiry date field as per API
        issuedBy: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        licenseImage: null
    });
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    // Prevent setProfile from overwriting user input while typing
    const isFirstLoad = React.useRef(true);
    React.useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await profileApi.getProfile();
                if (res.data && isFirstLoad.current) {
                    let firstName = '', lastName = '';
                    if (res.data.fullName && typeof res.data.fullName === 'string') {
                        const arr = res.data.fullName.trim().split(/\s+/);
                        if (arr.length === 1) {
                            firstName = arr[0];
                            lastName = '';
                        } else if (arr.length > 1) {
                            firstName = arr[0];
                            lastName = arr.slice(1).join(' ');
                        }
                    } else {
                        firstName = res.data.firstName ?? '';
                        lastName = res.data.lastName ?? '';
                    }
                    // Map BE 'phone' to FE 'phoneNumber'
                    const loadedProfile = {
                        firstName,
                        lastName,
                        email: res.data.email ?? '',
                        phoneNumber: res.data.phone ?? res.data.phoneNumber ?? '',
                        address: res.data.address ?? '',
                        dateOfBirth: res.data.dateOfBirth ?? '',
                        gender: res.data.gender ?? '',
                        profilePictureUrl: res.data.profilePictureUrl ?? '',
                    };
                    setProfile(loadedProfile);
                    // Nếu profileDraft chưa có (null) thì mới set từ BE
                    setProfileDraft((prev) => prev === null ? loadedProfile : prev);
                    isFirstLoad.current = false;
                }
            } catch (err) {
                setError('Không thể tải thông tin profile');
            }
        };
        loadProfile();
    }, []);
    // Debounce lưu localStorage khi profileDraft thay đổi
    React.useEffect(() => {
        if (!profileDraft) return;
        const timeout = setTimeout(() => {
            try {
                localStorage.setItem('profileDraft', JSON.stringify(profileDraft));
            } catch { }
        }, 400);
        return () => clearTimeout(timeout);
    }, [profileDraft]);

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

    const validateProfile = () => {
        const errors = {};
        if (!profileDraft.firstName || !String(profileDraft.firstName).trim()) errors.firstName = 'Vui lòng nhập tên';
        if (!profileDraft.lastName || !String(profileDraft.lastName).trim()) errors.lastName = 'Vui lòng nhập họ';
        if (!profileDraft.phoneNumber || !String(profileDraft.phoneNumber).trim()) errors.phoneNumber = 'Vui lòng nhập số điện thoại';
        // Optionally validate phone format, date, etc.
        return errors;
    };

    const updateProfile = async () => {
        setMessage('');
        setError('');
        const errors = validateProfile();
        setProfileErrors(errors);
        if (Object.keys(errors).length > 0) {
            setError('Vui lòng kiểm tra lại thông tin.');
            return;
        }
        setLoading(true);
        try {
            // Gửi đúng schema BE yêu cầu
            const payload = {
                firstName: profileDraft.firstName?.trim() || '',
                lastName: profileDraft.lastName?.trim() || '',
                phoneNumber: profileDraft.phoneNumber?.trim() || '',
                dateOfBirth: profileDraft.dateOfBirth || '',
                address: profileDraft.address || ''
            };
            await profileApi.updateProfile(payload);
            setProfile((prev) => ({
                ...prev,
                firstName: profileDraft.firstName,
                lastName: profileDraft.lastName,
                phoneNumber: profileDraft.phoneNumber,
                address: profileDraft.address,
                dateOfBirth: profileDraft.dateOfBirth,
                gender: profileDraft.gender,
            }));
            setUser((prev) => ({
                ...prev,
                firstName: profileDraft.firstName,
                lastName: profileDraft.lastName,
                phoneNumber: profileDraft.phoneNumber
            }));
            try { localStorage.removeItem('profileDraft'); } catch { }
            setMessage('Cập nhật thông tin thành công');
        } catch (err) {
            let msg = 'Cập nhật thất bại';
            if (err && err.response && err.response.data) {
                if (typeof err.response.data.message === 'string') msg = err.response.data.message;
                else if (typeof err.response.data.Message === 'string') msg = err.response.data.Message;
                else if (typeof err.response.data.status === 'string') msg = err.response.data.status;
            } else if (err && err.message) {
                msg = err.message;
            }
            setError(msg);
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
            let msg = 'Đổi mật khẩu thất bại';
            if (err && err.response && err.response.data) {
                if (typeof err.response.data.message === 'string') msg = err.response.data.message;
                else if (typeof err.response.data.Message === 'string') msg = err.response.data.Message;
                else if (typeof err.response.data.status === 'string') msg = err.response.data.status;
            } else if (err && err.message) {
                msg = err.message;
            }
            setError(msg);
        }
    };

    const uploadProfilePicture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await profileApi.uploadProfilePicture(formData);
            // Chỉ update trường profilePictureUrl, không set lại toàn bộ object
            setProfileDraft((prev) => ({ ...prev, profilePictureUrl: res.data.profileImageUrl || res.data.url }));
            setProfile((prev) => ({ ...prev, profilePictureUrl: res.data.profileImageUrl || res.data.url }));
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

        // Validate required fields as per new License API
        if (!licenseForm.licenseNumber || !licenseForm.issueDate || !licenseForm.issuedBy ||
            !licenseForm.firstName || !licenseForm.lastName || !licenseForm.dateOfBirth || !licenseForm.licenseImage) {
            setError('Vui lòng nhập đầy đủ tất cả các trường và tải lên ảnh giấy phép.');
            return;
        }

        try {
            // Create FormData with correct field names as per README_FRONTEND_LICENSE.md
            const formData = new FormData();
            formData.append('licenseNumber', licenseForm.licenseNumber);
            formData.append('issuedBy', licenseForm.issuedBy);
            formData.append('issueDate', licenseForm.issueDate);
            formData.append('firstName', licenseForm.firstName);
            formData.append('lastName', licenseForm.lastName);
            formData.append('dateOfBirth', licenseForm.dateOfBirth);
            formData.append('licenseImage', licenseForm.licenseImage);

            // Optional expiry date if available
            if (licenseForm.expiryDate) {
                formData.append('expiryDate', licenseForm.expiryDate);
            }

            // Use the correct license API endpoint
            const response = await licenseApi.verifyLicense(formData);

            if (response.statusCode === 200 || response.statusCode === 201) {
                setMessage('Xác minh giấy phép thành công! Yêu cầu đã được gửi để duyệt.');
                // Reset form after successful submission
                setLicenseForm({
                    licenseNumber: '',
                    issueDate: '',
                    expiryDate: '',
                    issuedBy: '',
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    licenseImage: null
                });
            } else {
                setError(response.message || 'Xác minh giấy phép thất bại');
            }
        } catch (err) {
            console.error('License verification error:', err);
            let errorMessage = 'Xác minh giấy phép thất bại';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        }
    };

    // Stable TabPanel to prevent remounting
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`profile-tabpanel-${index}`}
                aria-labelledby={`profile-tab-${index}`}
                {...other}
            >
                {value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null}
            </div>
        );
    }




    // Nếu profileDraft chưa khởi tạo xong thì không render form
    if (!profileDraft) return null;

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
                                    src={profileDraft.profilePictureUrl}
                                >
                                    {profileDraft.firstName?.charAt(0)?.toUpperCase()}
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
                                <Typography variant="h6">{profileDraft.firstName} {profileDraft.lastName}</Typography>
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
                                    name="firstName"
                                    value={typeof profileDraft.firstName === 'string' ? profileDraft.firstName : ''}
                                    onChange={handleProfileChange}
                                    error={!!profileErrors.firstName}
                                    helperText={profileErrors.firstName}
                                    inputProps={{ autoComplete: 'off', spellCheck: false }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Họ"
                                    name="lastName"
                                    value={typeof profileDraft.lastName === 'string' ? profileDraft.lastName : ''}
                                    onChange={handleProfileChange}
                                    error={!!profileErrors.lastName}
                                    helperText={profileErrors.lastName}
                                    inputProps={{ autoComplete: 'off', spellCheck: false }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={profileDraft.email}
                                    onChange={handleProfileChange}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={profileDraft.phoneNumber ?? ''}
                                    onChange={handleProfileChange}
                                    error={!!profileErrors.phoneNumber}
                                    helperText={profileErrors.phoneNumber}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày sinh"
                                    name="dateOfBirth"
                                    type="date"
                                    value={profileDraft.dateOfBirth}
                                    onChange={handleProfileChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Giới tính"
                                    name="gender"
                                    value={profileDraft.gender ?? ''}
                                    onChange={handleProfileChange}
                                >
                                    <MenuItem value="">Chọn giới tính</MenuItem>
                                    <MenuItem value="Male">Nam</MenuItem>
                                    <MenuItem value="Female">Nữ</MenuItem>
                                    <MenuItem value="Other">Khác</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Địa chỉ"
                                    name="address"
                                    multiline
                                    rows={2}
                                    value={profileDraft.address}
                                    onChange={handleProfileChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={updateProfile}
                                    disabled={loading}
                                    startIcon={loading ? <span className="MuiCircularProgress-root MuiCircularProgress-indeterminate" style={{ width: 20, height: 20, marginRight: 8 }}><svg className="MuiCircularProgress-svg" viewBox="22 22 44 44"><circle className="MuiCircularProgress-circle" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" /></svg></span> : null}
                                    sx={{ minWidth: 180, fontWeight: 'bold', fontSize: 16, py: 1.2 }}
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
                                        label="Nơi cấp"
                                        value={licenseForm.issuedBy}
                                        onChange={(e) => setLicenseForm({ ...licenseForm, issuedBy: e.target.value })}
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
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ngày sinh"
                                        type="date"
                                        value={licenseForm.dateOfBirth}
                                        onChange={(e) => setLicenseForm({ ...licenseForm, dateOfBirth: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                    >
                                        Tải ảnh giấy phép
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) setLicenseForm((prev) => ({ ...prev, licenseImage: file }));
                                            }}
                                        />
                                    </Button>
                                    {licenseForm.licenseImage && (
                                        <Typography variant="caption" color="text.secondary">
                                            {licenseForm.licenseImage.name}
                                        </Typography>
                                    )}
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