import React from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
    Box,
    CircularProgress
} from '@mui/material';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api';

export default function EmailVerification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [form, setForm] = React.useState({
        email: searchParams.get('email') || '',
        otp: ''
    });
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [resendLoading, setResendLoading] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});

    const validateForm = () => {
        const errors = {};
        if (!form.email.trim()) errors.email = 'Email không được để trống';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email không hợp lệ';
        if (!form.otp.trim()) errors.otp = 'OTP không được để trống';
        if (form.otp.length !== 6 || !/^\d{6}$/.test(form.otp)) errors.otp = 'OTP phải là 6 chữ số';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleVerification = async () => {
        if (!validateForm()) return;

        setMessage('');
        setError('');
        setLoading(true);

        try {
            // Assuming the backend has an email verification endpoint
            const response = await authApi.verifyEmail(form);
            setMessage('Xác thực email thành công! Đang chuyển hướng đến trang đăng nhập...');

            // Redirect to login after successful verification
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);
        } catch (err) {
            console.error('Email verification error:', err);
            setError(err.response?.data?.message || 'Xác thực thất bại. Vui lòng kiểm tra lại OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError('Vui lòng nhập email hợp lệ để gửi lại OTP');
            return;
        }

        setMessage('');
        setError('');
        setResendLoading(true);

        try {
            // Assuming the backend has a resend OTP endpoint
            await authApi.resendOTP({ email: form.email });
            setMessage('OTP mới đã được gửi đến email của bạn.');
        } catch (err) {
            console.error('Resend OTP error:', err);
            setError(err.response?.data?.message || 'Không thể gửi lại OTP. Vui lòng thử lại.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                        Xác thực email
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                        Chúng tôi đã gửi mã OTP 6 chữ số đến email của bạn. Vui lòng nhập mã để xác thực tài khoản.
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                if (validationErrors.email) setValidationErrors({ ...validationErrors, email: '' });
                            }}
                            error={!!validationErrors.email}
                            helperText={validationErrors.email}
                            disabled={loading}
                            required
                        />

                        <TextField
                            label="OTP"
                            value={form.otp}
                            onChange={(e) => {
                                // Only allow numeric input and limit to 6 digits
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setForm({ ...form, otp: value });
                                if (validationErrors.otp) setValidationErrors({ ...validationErrors, otp: '' });
                            }}
                            error={!!validationErrors.otp}
                            helperText={validationErrors.otp}
                            placeholder="Nhập mã OTP 6 số"
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                            disabled={loading}
                            required
                        />

                        {message && <Alert severity="success">{message}</Alert>}
                        {error && <Alert severity="error">{error}</Alert>}

                        <Button
                            variant="contained"
                            onClick={handleVerification}
                            disabled={loading || !form.email || !form.otp}
                            fullWidth
                            size="large"
                        >
                            {loading ? <CircularProgress size={24} /> : 'Xác thực'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Không nhận được OTP?
                            </Typography>
                            <Button
                                variant="text"
                                onClick={handleResendOTP}
                                disabled={resendLoading || loading}
                                size="small"
                            >
                                {resendLoading ? <CircularProgress size={16} /> : 'Gửi lại OTP'}
                            </Button>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="text" size="small">
                                    Quay về đăng nhập
                                </Button>
                            </Link>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}