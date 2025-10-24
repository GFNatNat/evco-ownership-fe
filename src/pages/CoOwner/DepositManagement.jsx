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
    Badge,
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    AccountBalance,
    Add,
    Payment,
    History,
    Cancel,
    CheckCircle,
    CreditCard,
    AccountBalanceWallet,
    QrCode,
    Refresh,
    TrendingUp,
    MonetizationOn
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import depositApi from '../../api/depositApi';

const DepositManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [deposits, setDeposits] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Deposit form
    const [depositForm, setDepositForm] = useState({
        amount: '',
        depositMethod: 0,
        description: ''
    });

    // Filters
    const [filters, setFilters] = useState({
        depositMethod: '',
        status: '',
        fromDate: null,
        toDate: null,
        minAmount: '',
        maxAmount: ''
    });

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Dialogs
    const [createDepositDialogOpen, setCreateDepositDialogOpen] = useState(false);
    const [depositDetailsDialogOpen, setDepositDetailsDialogOpen] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState(null);

    useEffect(() => {
        loadInitialData();
        loadDeposits();
    }, []);

    useEffect(() => {
        loadDeposits();
    }, [page, rowsPerPage, filters]);

    const loadInitialData = async () => {
        try {
            const [statisticsResponse, paymentMethodsResponse] = await Promise.all([
                depositApi.getMyStatistics().catch(() => ({ data: {} })),
                depositApi.getPaymentMethods().catch(() => ({ data: [] }))
            ]);

            setStatistics(statisticsResponse.data);
            setPaymentMethods(paymentMethodsResponse.data);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    };

    const loadDeposits = async () => {
        try {
            setLoading(true);
            const response = await depositApi.getMyDeposits({
                ...filters,
                pageNumber: page + 1,
                pageSize: rowsPerPage
            }).catch(() => ({ data: { items: [], totalCount: 0 } }));

            if (response?.data?.items) {
                const formattedDeposits = response.data.items.map(deposit =>
                    depositApi.formatDepositForDisplay(deposit)
                );
                setDeposits(formattedDeposits);
                setTotalItems(response.data.totalCount || 0);
            } else {
                setDeposits([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error loading deposits:', error);
            setDeposits([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDepositFormChange = (field, value) => {
        setDepositForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const createDeposit = async () => {
        try {
            // Validate deposit data
            const validation = depositApi.validateDepositData(depositForm);
            if (!validation.isValid) {
                setError(validation.errors.join(', '));
                return;
            }

            setLoading(true);
            setError('');

            const response = await depositApi.create({
                amount: parseFloat(depositForm.amount),
                depositMethod: depositForm.depositMethod,
                description: depositForm.description
            });

            if (response.data?.paymentUrl) {
                // Redirect to payment gateway
                window.open(response.data.paymentUrl, '_blank');
            }

            setSuccess('Giao dịch nạp tiền đã được tạo thành công');
            setCreateDepositDialogOpen(false);
            resetDepositForm();
            loadDeposits();
            loadInitialData();
        } catch (error) {
            console.error('Error creating deposit:', error);
            setError(error.response?.data?.message || 'Không thể tạo giao dịch nạp tiền');
        } finally {
            setLoading(false);
        }
    };

    const cancelDeposit = async (depositId) => {
        try {
            setLoading(true);
            setError('');

            await depositApi.cancel(depositId);

            setSuccess('Đã hủy giao dịch nạp tiền');
            loadDeposits();
            loadInitialData();
        } catch (error) {
            console.error('Error canceling deposit:', error);
            setError(error.response?.data?.message || 'Không thể hủy giao dịch');
        } finally {
            setLoading(false);
        }
    };

    const viewDepositDetails = async (depositId) => {
        try {
            setLoading(true);
            const response = await depositApi.getById(depositId);

            setSelectedDeposit(depositApi.formatDepositForDisplay(response.data));
            setDepositDetailsDialogOpen(true);
        } catch (error) {
            console.error('Error loading deposit details:', error);
            setError('Không thể tải chi tiết giao dịch');
        } finally {
            setLoading(false);
        }
    };

    const resetDepositForm = () => {
        setDepositForm({
            amount: '',
            depositMethod: 0,
            description: ''
        });
    };

    const getPaymentMethodIcon = (method) => {
        const icons = {
            0: <CreditCard />,
            1: <AccountBalanceWallet />,
            2: <AccountBalance />,
            3: <QrCode />
        };
        return icons[method] || <Payment />;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
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
                    <AccountBalance sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Quản lý Nạp tiền
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MonetizationOn color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Tổng nạp</Typography>
                            </Box>
                            <Typography variant="h4" color="primary">
                                {statistics.formattedTotalAmount || '0 ₫'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {statistics.totalDeposits || 0} giao dịch
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckCircle color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6">Hoàn thành</Typography>
                            </Box>
                            <Typography variant="h4" color="success.main">
                                {statistics.formattedCompletedAmount || '0 ₫'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {statistics.completedDeposits || 0} giao dịch
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <History color="warning" sx={{ mr: 1 }} />
                                <Typography variant="h6">Đang chờ</Typography>
                            </Box>
                            <Typography variant="h4" color="warning.main">
                                {statistics.formattedPendingAmount || '0 ₫'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {statistics.pendingDeposits || 0} giao dịch
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp color="info" sx={{ mr: 1 }} />
                                <Typography variant="h6">Tỷ lệ thành công</Typography>
                            </Box>
                            <Typography variant="h4" color="info.main">
                                {(statistics.successRate || 0).toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Trung bình: {statistics.formattedAverageAmount || '0 ₫'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab label="Lịch sử giao dịch" />
                    </Tabs>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateDepositDialogOpen(true)}
                    >
                        Nạp tiền mới
                    </Button>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {/* Filters */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Phương thức</InputLabel>
                                    <Select
                                        value={filters.depositMethod}
                                        onChange={(e) => setFilters(prev => ({ ...prev, depositMethod: e.target.value }))}
                                        label="Phương thức"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value={0}>Thẻ tín dụng</MenuItem>
                                        <MenuItem value={1}>Ví điện tử</MenuItem>
                                        <MenuItem value={2}>Ngân hàng</MenuItem>
                                        <MenuItem value={3}>Mã QR</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="Pending">Đang chờ</MenuItem>
                                        <MenuItem value="Processing">Đang xử lý</MenuItem>
                                        <MenuItem value="Completed">Hoàn thành</MenuItem>
                                        <MenuItem value="Failed">Thất bại</MenuItem>
                                        <MenuItem value="Cancelled">Đã hủy</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Số tiền tối thiểu"
                                    value={filters.minAmount}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    label="Số tiền tối đa"
                                    value={filters.maxAmount}
                                    onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                                />
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="outlined"
                                    onClick={loadDeposits}
                                    startIcon={<Refresh />}
                                    fullWidth
                                >
                                    Làm mới
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Deposits Table */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã giao dịch</TableCell>
                                    <TableCell>Số tiền</TableCell>
                                    <TableCell>Phương thức</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : deposits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Không có giao dịch nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deposits.map((deposit) => (
                                        <TableRow key={deposit.id}>
                                            <TableCell>#{deposit.id}</TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {deposit.formattedAmount}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {getPaymentMethodIcon(deposit.depositMethod)}
                                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                                        {deposit.depositMethodName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={deposit.statusName}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: deposit.statusColor,
                                                        color: 'white'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{deposit.formattedCreatedAt}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" noWrap>
                                                    {deposit.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => viewDepositDetails(deposit.id)}
                                                        >
                                                            <History />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {deposit.canCancel && (
                                                        <Tooltip title="Hủy giao dịch">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => cancelDeposit(deposit.id)}
                                                            >
                                                                <Cancel />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={totalItems}
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
            </Paper>

            {/* Create Deposit Dialog */}
            <Dialog
                open={createDepositDialogOpen}
                onClose={() => setCreateDepositDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Tạo giao dịch nạp tiền mới</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Số tiền (VNĐ)"
                                value={depositForm.amount}
                                onChange={(e) => handleDepositFormChange('amount', e.target.value)}
                                inputProps={{ min: 10000, max: 50000000 }}
                                helperText="Tối thiểu 10,000 VNĐ - Tối đa 50,000,000 VNĐ"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Phương thức thanh toán</InputLabel>
                                <Select
                                    value={depositForm.depositMethod}
                                    onChange={(e) => handleDepositFormChange('depositMethod', e.target.value)}
                                    label="Phương thức thanh toán"
                                >
                                    <MenuItem value={0}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CreditCard sx={{ mr: 1 }} />
                                            Thẻ tín dụng (2.5% + 5,000 VNĐ)
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={1}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccountBalanceWallet sx={{ mr: 1 }} />
                                            Ví điện tử (1.5% + 2,000 VNĐ)
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccountBalance sx={{ mr: 1 }} />
                                            Ngân hàng trực tuyến (0.8% + 3,000 VNĐ)
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <QrCode sx={{ mr: 1 }} />
                                            Mã QR (1.0% + 1,000 VNĐ)
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Mô tả"
                                value={depositForm.description}
                                onChange={(e) => handleDepositFormChange('description', e.target.value)}
                                placeholder="Mô tả mục đích nạp tiền..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDepositDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={createDeposit}
                        variant="contained"
                        disabled={loading || !depositForm.amount || !depositForm.description}
                        startIcon={loading ? <CircularProgress size={16} /> : <Payment />}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo giao dịch'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Deposit Details Dialog */}
            <Dialog
                open={depositDetailsDialogOpen}
                onClose={() => setDepositDetailsDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Chi tiết giao dịch nạp tiền</DialogTitle>
                <DialogContent>
                    {selectedDeposit && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Mã giao dịch
                                </Typography>
                                <Typography variant="body1">#{selectedDeposit.id}</Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Số tiền
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {selectedDeposit.formattedAmount}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Phương thức thanh toán
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {getPaymentMethodIcon(selectedDeposit.depositMethod)}
                                    <Typography variant="body1" sx={{ ml: 1 }}>
                                        {selectedDeposit.depositMethodName}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Trạng thái
                                </Typography>
                                <Chip
                                    label={selectedDeposit.statusName}
                                    sx={{
                                        bgcolor: selectedDeposit.statusColor,
                                        color: 'white'
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Mô tả
                                </Typography>
                                <Typography variant="body1">
                                    {selectedDeposit.description}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Ngày tạo
                                </Typography>
                                <Typography variant="body1">
                                    {selectedDeposit.formattedCreatedAt}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Cập nhật lần cuối
                                </Typography>
                                <Typography variant="body1">
                                    {selectedDeposit.formattedUpdatedAt || 'Chưa cập nhật'}
                                </Typography>
                            </Grid>

                            {selectedDeposit.gatewayTransactionId && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Mã giao dịch gateway
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                                        {selectedDeposit.gatewayTransactionId}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDepositDetailsDialogOpen(false)}>
                        Đóng
                    </Button>
                    {selectedDeposit?.canCancel && (
                        <Button
                            onClick={() => {
                                cancelDeposit(selectedDeposit.id);
                                setDepositDetailsDialogOpen(false);
                            }}
                            color="error"
                            startIcon={<Cancel />}
                        >
                            Hủy giao dịch
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DepositManagement;