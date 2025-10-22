import React from 'react';
import { Box, Card, CardContent, Typography, Button, Container, Grid } from '@mui/material';
import {
    DirectionsCar, Group, Settings, Shield, Battery80, TrendingUp,
    CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function IndexNew() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1))' }}>
            {/* Header */}
            <Box sx={{ borderBottom: '1px solid #e5e7eb', bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
                <Container maxWidth="lg" sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <DirectionsCar sx={{ fontSize: 32, color: '#10b981' }} />
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                EV Share
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            {user ? (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        if (user.role === 'Admin') navigate('/dashboard/admin');
                                        else if (user.role === 'Staff') navigate('/dashboard/staff');
                                        else navigate('/dashboard/coowner');
                                    }}
                                    sx={{
                                        bgcolor: '#10b981',
                                        textTransform: 'none',
                                        boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                                        '&:hover': {
                                            bgcolor: '#059669'
                                        }
                                    }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate('/login')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            bgcolor: '#10b981',
                                            textTransform: 'none',
                                            boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                                            '&:hover': {
                                                bgcolor: '#059669'
                                            }
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Box mb={8}>
                    <Typography variant="h2" fontWeight="bold" gutterBottom>
                        Hệ thống quản lý{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            đồng sở hữu xe điện
                        </span>
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
                        Giải pháp toàn diện cho việc chia sẻ xe điện, quản lý chi phí và đặt lịch sử dụng một cách minh bạch và hiệu quả.
                    </Typography>
                </Box>

                {/* Role Cards */}
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 20px 40px -5px rgba(16, 185, 129, 0.4)'
                            }
                        }}>
                            <CardContent sx={{ py: 4, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2
                                    }}
                                >
                                    <Group sx={{ fontSize: 32, color: '#10b981' }} />
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Đồng sở hữu
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Quản lý tỷ lệ sở hữu, đặt lịch sử dụng xe và theo dõi chi phí
                                </Typography>

                                <Box sx={{ textAlign: 'left', mb: 3 }}>
                                    {['Đặt lịch sử dụng xe', 'Theo dõi chi phí cá nhân', 'Quản lý quỹ nhóm', 'Lịch sử sử dụng'].map((feature, i) => (
                                        <Box key={i} display="flex" alignItems="center" gap={1} py={0.5}>
                                            <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => user ? navigate('/dashboard/coowner') : navigate('/register')}
                                    sx={{
                                        bgcolor: '#10b981',
                                        textTransform: 'none',
                                        py: 1.2,
                                        boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
                                        '&:hover': {
                                            bgcolor: '#059669'
                                        }
                                    }}
                                >
                                    {user ? 'Truy cập Dashboard' : 'Đăng ký ngay'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            boxShadow: '0 10px 30px -5px rgba(14, 165, 233, 0.3)',
                            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                            border: '1px solid rgba(14, 165, 233, 0.2)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 20px 40px -5px rgba(14, 165, 233, 0.4)'
                            }
                        }}>
                            <CardContent sx={{ py: 4, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'rgba(14, 165, 233, 0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2
                                    }}
                                >
                                    <Settings sx={{ fontSize: 32, color: '#0ea5e9' }} />
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Nhân viên
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Xác thực tài liệu, quản lý check-in/out và xử lý tranh chấp
                                </Typography>

                                <Box sx={{ textAlign: 'left', mb: 3 }}>
                                    {['Xác thực GPLX & CCCD', 'Quản lý check-in/out', 'Xử lý tranh chấp', 'Quản lý bảo dưỡng'].map((feature, i) => (
                                        <Box key={i} display="flex" alignItems="center" gap={1} py={0.5}>
                                            <CheckCircle sx={{ fontSize: 16, color: '#0ea5e9' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => user ? navigate('/dashboard/staff') : navigate('/register')}
                                    sx={{
                                        borderColor: '#0ea5e9',
                                        color: '#0ea5e9',
                                        textTransform: 'none',
                                        py: 1.2,
                                        '&:hover': {
                                            borderColor: '#0284c7',
                                            bgcolor: 'rgba(14, 165, 233, 0.05)'
                                        }
                                    }}
                                >
                                    {user ? 'Truy cập Dashboard' : 'Đăng ký ngay'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            boxShadow: '0 10px 30px -5px rgba(239, 68, 68, 0.3)',
                            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 20px 40px -5px rgba(239, 68, 68, 0.4)'
                            }
                        }}>
                            <CardContent sx={{ py: 4, textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2
                                    }}
                                >
                                    <Shield sx={{ fontSize: 32, color: '#ef4444' }} />
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Quản trị viên
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Quản lý toàn hệ thống, báo cáo tài chính và giải quyết tranh chấp
                                </Typography>

                                <Box sx={{ textAlign: 'left', mb: 3 }}>
                                    {['Quản lý người dùng', 'Báo cáo tài chính', 'Giải quyết tranh chấp', 'Thống kê hệ thống'].map((feature, i) => (
                                        <Box key={i} display="flex" alignItems="center" gap={1} py={0.5}>
                                            <CheckCircle sx={{ fontSize: 16, color: '#ef4444' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => user ? navigate('/dashboard/admin') : navigate('/register')}
                                    sx={{
                                        bgcolor: '#ef4444',
                                        textTransform: 'none',
                                        py: 1.2,
                                        '&:hover': {
                                            bgcolor: '#dc2626'
                                        }
                                    }}
                                >
                                    {user ? 'Truy cập Dashboard' : 'Đăng ký ngay'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Features Section */}
                <Box sx={{ mt: 12, mb: 8 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Tính năng nổi bật
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={6}>
                        Những công cụ mạnh mẽ giúp quản lý xe điện đồng sở hữu hiệu quả
                    </Typography>

                    <Grid container spacing={3}>
                        {[
                            {
                                icon: Battery80,
                                title: 'Theo dõi thời gian thực',
                                description: 'Giám sát pin, vị trí và trạng thái xe liên tục',
                                color: '#10b981'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Phân tích chi phí thông minh',
                                description: 'Tự động chia sẻ chi phí theo tỷ lệ sở hữu và sử dụng',
                                color: '#0ea5e9'
                            },
                            {
                                icon: Group,
                                title: 'Quản lý nhóm minh bạch',
                                description: 'Bỏ phiếu, quyết định và quản lý quỹ nhóm công khai',
                                color: '#f59e0b'
                            }
                        ].map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card sx={{
                                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 10px 30px -5px ${feature.color}33`
                                    }
                                }}>
                                    <CardContent>
                                        <feature.icon sx={{ fontSize: 48, color: feature.color, mb: 2 }} />
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
