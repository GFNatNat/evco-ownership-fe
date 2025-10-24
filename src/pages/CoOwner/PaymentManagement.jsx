import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Payment as PaymentIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Receipt as ReceiptIcon,
    AccountBalance as BankIcon
} from '@mui/icons-material';
import paymentApi from '../../api/paymentApi';

const PaymentManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [payments, setPayments] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [gateways, setGateways] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        amount: 0,
        paymentGateway: 0,
        paymentMethod: 1,
        paymentType: 0,
        description: ''
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, gatewaysRes] = await Promise.all([
                paymentApi.getMyPaymentsList(),
                paymentApi.getAvailableGateways()
            ]);

            setPayments(paymentsRes.data || []);
            setGateways(gatewaysRes.data || []);
        } catch (error) {
            showAlert('Lỗi tải dữ liệu: ' + error.message, 'error');
        }
        setLoading(false);
    };

    const loadStatistics = async () => {
        try {
            const response = await paymentApi.getPaymentStatistics();
            setStatistics(response.data);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleCreatePayment = async () => {
        try {
            const response = await paymentApi.createPayment(formData);

            if (response.data?.paymentUrl) {
                // Redirect to payment gateway
                window.open(response.data.paymentUrl, '_blank');
                showAlert('Chuyển hướng đến cổng thanh toán', 'info');
            } else {
                showAlert('Tạo thanh toán thành công!', 'success');
            }

            setOpenDialog(false);
            loadData();
        } catch (error) {
            showAlert('Lỗi tạo thanh toán: ' + error.message, 'error');
        }
    };

    const handleCancelPayment = async (paymentId) => {
        try {
            await paymentApi.cancelPaymentById(paymentId);
            showAlert('Hủy thanh toán thành công!', 'success');
            loadData();
        } catch (error) {
            showAlert('Lỗi hủy thanh toán: ' + error.message, 'error');
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'cancelled': return 'default';
            default: return 'default';
        }
    };

    const getPaymentGatewayName = (gateway) => {
        switch (gateway) {
            case 0: return 'VNPay';
            case 1: return 'Momo';
            case 2: return 'ZaloPay';
            default: return 'Unknown';
        }
    };

    const getPaymentTypeName = (type) => {
        switch (type) {
            case 0: return 'Booking';
            case 1: return 'Maintenance';
            case 2: return 'Ownership';
            default: return 'Other';
        }
    };

    const renderPaymentCard = (payment) => (
        <Card key={payment.paymentId} sx={{ mb: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                            Thanh toán #{payment.paymentId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <PaymentIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {new Date(payment.createdAt).toLocaleString('vi-VN')}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {payment.amount?.toLocaleString('vi-VN')} VND
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {getPaymentGatewayName(payment.paymentGateway)} - {getPaymentTypeName(payment.paymentType)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Chip
                                label={payment.status}
                                color={getPaymentStatusColor(payment.status)}
                                size="small"
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {payment.userEmail}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    startIcon={<ReceiptIcon />}
                >
                    Chi tiết
                </Button>
                {payment.status === 'Pending' && (
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelPayment(payment.paymentId)}
                    >
                        Hủy
                    </Button>
                )}
            </CardActions>
        </Card>
    );

    const renderStatisticsCard = () => {
        if (!statistics) {
            return (
                <Card>
                    <CardContent>
                        <Typography>Đang tải thống kê...</Typography>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="primary">
                                {statistics.totalPayments}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng thanh toán
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="success.main">
                                {statistics.totalAmount?.toLocaleString('vi-VN')} VND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng số tiền
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="success.main">
                                {statistics.successfulPayments}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Thành công
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="success.main">
                                {statistics.successRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tỷ lệ thành công
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Thanh toán
            </Typography>

            {alert.open && (
                <Alert severity={alert.severity} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}

            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mr: 2 }}
                >
                    Tạo Thanh toán
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={loadData}
                >
                    Tải lại
                </Button>
            </Box>

            <Paper sx={{ width: '100%' }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => {
                        setActiveTab(newValue);
                        if (newValue === 1) loadStatistics();
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label={`Thanh toán của tôi (${payments.length})`} />
                    <Tab label="Thống kê" />
                    <Tab label="Cổng thanh toán" />
                </Tabs>

                <Box sx={{ p: 2 }}>
                    {activeTab === 0 && (
                        <Grid container spacing={2}>
                            {payments.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        Chưa có thanh toán nào
                                    </Typography>
                                </Grid>
                            ) : (
                                payments.map(payment => (
                                    <Grid item xs={12} md={6} key={payment.paymentId}>
                                        {renderPaymentCard(payment)}
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}

                    {activeTab === 1 && renderStatisticsCard()}

                    {activeTab === 2 && (
                        <List>
                            {gateways.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" textAlign="center">
                                    Không có cổng thanh toán nào
                                </Typography>
                            ) : (
                                gateways.map((gateway, index) => (
                                    <ListItem key={index} divider>
                                        <BankIcon sx={{ mr: 2 }} />
                                        <ListItemText
                                            primary={gateway.gateway}
                                            secondary={gateway.description}
                                        />
                                        <Chip
                                            label={gateway.status}
                                            color={gateway.status === 'Available' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    )}
                </Box>
            </Paper>

            {/* Create Payment Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Tạo Thanh toán Mới</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Số tiền (VND)"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Cổng thanh toán</InputLabel>
                                    <Select
                                        value={formData.paymentGateway}
                                        onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value })}
                                    >
                                        <MenuItem value={0}>VNPay</MenuItem>
                                        <MenuItem value={1}>Momo</MenuItem>
                                        <MenuItem value={2}>ZaloPay</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Phương thức thanh toán</InputLabel>
                                    <Select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    >
                                        <MenuItem value={0}>Chuyển khoản ngân hàng</MenuItem>
                                        <MenuItem value={1}>Thẻ tín dụng</MenuItem>
                                        <MenuItem value={2}>Ví điện tử</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Loại thanh toán</InputLabel>
                                    <Select
                                        value={formData.paymentType}
                                        onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                                    >
                                        <MenuItem value={0}>Booking</MenuItem>
                                        <MenuItem value={1}>Maintenance</MenuItem>
                                        <MenuItem value={2}>Ownership</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleCreatePayment} variant="contained">
                        Tạo thanh toán
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentManagement;