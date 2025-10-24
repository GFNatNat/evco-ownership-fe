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
    IconButton,
    Tooltip,
    Divider,
    Stack
} from '@mui/material';
import {
    Download,
    PictureAsPdf,
    TableChart,
    DateRange,
    TrendingUp,
    Assessment,
    CalendarMonth,
    Today,
    Schedule
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import reportApi from '../../api/reportApi';
import vehicleApi from '../../api/vehicleApi';

const ReportsManagement = () => {
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [reportType, setReportType] = useState('monthly');
    const [reportPeriod, setReportPeriod] = useState(dayjs());
    const [exportFormat, setExportFormat] = useState('pdf');
    const [availablePeriods, setAvailablePeriods] = useState([]);
    const [currentReports, setCurrentReports] = useState({
        monthly: null,
        quarterly: null,
        yearly: null
    });
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [previewDialog, setPreviewDialog] = useState({ open: false, data: null, type: '' });

    // Load initial data
    useEffect(() => {
        loadVehicles();
        loadAvailablePeriods();
        loadCurrentReports();
    }, []);

    const loadVehicles = async () => {
        try {
            const response = await vehicleApi.getMyVehicles().catch(() => ({ data: [] }));
            const vehiclesData = response?.data || [];
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
            if (vehiclesData?.length > 0) {
                setSelectedVehicle(vehiclesData[0].vehicleId);
            }
        } catch (error) {
            console.error('Lỗi tải danh sách xe:', error);
            setVehicles([]);
        }
    };

    const loadAvailablePeriods = async () => {
        try {
            const response = await reportApi.getAvailablePeriods();
            setAvailablePeriods(response.data || []);
        } catch (error) {
            console.error('Error loading available periods:', error);
        }
    };

    const loadCurrentReports = async () => {
        try {
            const results = await Promise.allSettled([
                reportApi.getCurrentMonthReport().catch(() => ({ data: null })),
                reportApi.getCurrentQuarterReport().catch(() => ({ data: null })),
                reportApi.getCurrentYearReport().catch(() => ({ data: null }))
            ]);

            const [monthly, quarterly, yearly] = results.map(r =>
                r.status === 'fulfilled' ? r.value : { data: null }
            );

            setCurrentReports({
                monthly: monthly?.data || null,
                quarterly: quarterly?.data || null,
                yearly: yearly?.data || null
            });
        } catch (error) {
            console.error('Error loading current reports:', error);
            setCurrentReports({ monthly: null, quarterly: null, yearly: null });
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    const handleGenerateReport = async () => {
        if (!selectedVehicle) {
            showAlert('warning', 'Vui lòng chọn xe để tạo báo cáo');
            return;
        }

        setLoading(true);
        try {
            let response;
            const reportData = {
                vehicleId: selectedVehicle,
                year: reportPeriod.year(),
                month: reportType === 'monthly' ? reportPeriod.month() + 1 : undefined,
                quarter: reportType === 'quarterly' ? Math.floor(reportPeriod.month() / 3) + 1 : undefined
            };

            switch (reportType) {
                case 'monthly':
                    response = await reportApi.createMonthlyReport(reportData);
                    break;
                case 'quarterly':
                    response = await reportApi.createQuarterlyReport(reportData);
                    break;
                case 'yearly':
                    response = await reportApi.createYearlyReport({ vehicleId: selectedVehicle, year: reportPeriod.year() });
                    break;
                default:
                    throw new Error('Invalid report type');
            }

            setPreviewDialog({
                open: true,
                data: response.data,
                type: reportType
            });

            showAlert('success', 'Báo cáo đã được tạo thành công');
        } catch (error) {
            showAlert('error', 'Lỗi khi tạo báo cáo: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExportReport = async (reportData, format) => {
        setLoading(true);
        try {
            const response = await reportApi.exportReport({
                reportId: reportData.reportId,
                format: format
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const fileName = `${reportType}-report-${selectedVehicle}-${reportPeriod.format('YYYY-MM')}.${format}`;
            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showAlert('success', `Báo cáo đã được xuất thành công định dạng ${format.toUpperCase()}`);
        } catch (error) {
            showAlert('error', 'Lỗi khi xuất báo cáo: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickReport = async (type) => {
        const currentData = currentReports[type];
        if (currentData) {
            setPreviewDialog({
                open: true,
                data: currentData,
                type: type
            });
        } else {
            showAlert('info', `Đang tạo báo cáo ${type}...`);
            // Generate current period report
            setReportType(type);
            setReportPeriod(dayjs());
            handleGenerateReport();
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const formatReportTypeText = (type) => {
        const typeMap = {
            'monthly': 'Báo cáo tháng',
            'quarterly': 'Báo cáo quý',
            'yearly': 'Báo cáo năm'
        };
        return typeMap[type] || type;
    };

    const ReportPreviewDialog = () => {
        const { data, type } = previewDialog;
        if (!data) return null;

        return (
            <Dialog
                open={previewDialog.open}
                onClose={() => setPreviewDialog({ open: false, data: null, type: '' })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">
                            {formatReportTypeText(type)} - {data.periodText}
                        </Typography>
                        <Chip
                            label={data.vehicleName}
                            color="primary"
                            size="small"
                        />
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Summary Cards */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Tổng số chuyến đi
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        {data.totalTrips || 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Tổng chi phí
                                    </Typography>
                                    <Typography variant="h4" color="error">
                                        {formatCurrency(data.totalCost)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Số giờ sử dụng
                                    </Typography>
                                    <Typography variant="h4" color="info.main">
                                        {data.totalHours || 0}h
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Detailed Table */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Chi tiết sử dụng
                            </Typography>

                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ngày</TableCell>
                                            <TableCell>Người sử dụng</TableCell>
                                            <TableCell>Thời gian</TableCell>
                                            <TableCell align="right">Chi phí</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.usageDetails?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{dayjs(item.date).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{item.userName}</TableCell>
                                                <TableCell>{item.duration}h</TableCell>
                                                <TableCell align="right">{formatCurrency(item.cost)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPreviewDialog({ open: false, data: null, type: '' })}>
                        Đóng
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PictureAsPdf />}
                        onClick={() => handleExportReport(data, 'pdf')}
                        disabled={loading}
                    >
                        Xuất PDF
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<TableChart />}
                        onClick={() => handleExportReport(data, 'excel')}
                        disabled={loading}
                        color="success"
                    >
                        Xuất Excel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                {alert.show && (
                    <Alert severity={alert.type} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                {/* Quick Access Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => handleQuickReport('monthly')}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h6" color="primary">
                                            Báo cáo tháng này
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {dayjs().format('MM/YYYY')}
                                        </Typography>
                                    </Box>
                                    <CalendarMonth color="primary" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => handleQuickReport('quarterly')}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h6" color="info.main">
                                            Báo cáo quý này
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Q{Math.floor(dayjs().month() / 3) + 1}/{dayjs().year()}
                                        </Typography>
                                    </Box>
                                    <Schedule color="info" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => handleQuickReport('yearly')}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h6" color="success.main">
                                            Báo cáo năm này
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {dayjs().year()}
                                        </Typography>
                                    </Box>
                                    <TrendingUp color="success" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Custom Report Generation */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Tạo báo cáo tùy chỉnh
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Chọn xe</InputLabel>
                                <Select
                                    value={selectedVehicle}
                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                    label="Chọn xe"
                                >
                                    {vehicles.map((vehicle) => (
                                        <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                            {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Loại báo cáo</InputLabel>
                                <Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    label="Loại báo cáo"
                                >
                                    <MenuItem value="monthly">Theo tháng</MenuItem>
                                    <MenuItem value="quarterly">Theo quý</MenuItem>
                                    <MenuItem value="yearly">Theo năm</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <DatePicker
                                label="Thời gian báo cáo"
                                value={reportPeriod}
                                onChange={(newValue) => setReportPeriod(newValue)}
                                views={reportType === 'yearly' ? ['year'] : ['year', 'month']}
                                openTo={reportType === 'yearly' ? 'year' : 'month'}
                                sx={{ width: '100%' }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack spacing={1}>
                                <Button
                                    variant="contained"
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
                                    fullWidth
                                >
                                    {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Available Periods */}
                    {availablePeriods.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Các kỳ báo cáo có sẵn:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {availablePeriods.map((period, index) => (
                                    <Chip
                                        key={index}
                                        label={period.displayText}
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            // Set period based on available data
                                            const [year, month] = period.value.split('-');
                                            setReportPeriod(dayjs(`${year}-${month || '01'}`));
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Paper>

                {/* Report Preview Dialog */}
                <ReportPreviewDialog />
            </Box>
        </LocalizationProvider>
    );
};

export default ReportsManagement;