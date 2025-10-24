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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Build as MaintenanceIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Receipt as ReceiptIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import maintenanceApi, { MaintenanceType, SeverityType } from '../../api/maintenanceApi';
import vehicleApi from '../../api/vehicleApi';

const MaintenanceManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [maintenances, setMaintenances] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [formData, setFormData] = useState({
        vehicleId: '',
        maintenanceType: 0,
        description: '',
        cost: 0,
        serviceProvider: '',
        maintenanceDate: new Date(),
        nextMaintenanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +3 months
        odometer: 0,
        severity: 0,
        isEmergency: false,
        notes: ''
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const vehiclesRes = await vehicleApi.getMyVehicles().catch(() => ({ data: [] }));

            setVehicles(vehiclesRes.data || []);

            if (vehiclesRes.data?.length > 0) {
                const firstVehicleId = vehiclesRes.data[0].id;
                setSelectedVehicle(firstVehicleId);
                loadVehicleMaintenances(firstVehicleId);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showAlert('Một số dữ liệu không tải được', 'warning');
        }
        setLoading(false);
    };

    const loadVehicleMaintenances = async (vehicleId) => {
        try {
            const response = await maintenanceApi.getByVehicleId(vehicleId);
            setMaintenances(response.data?.maintenances || response.data || []);
        } catch (error) {
            console.error('Error loading maintenances:', error);
            setMaintenances([]);
        }
    };

    const loadStatistics = async () => {
        try {
            if (selectedVehicle) {
                const response = await maintenanceApi.getVehicleStatistics(selectedVehicle);
                setStatistics(response.data || null);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
            setStatistics(null);
        }
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleCreateMaintenance = async () => {
        try {
            await maintenanceApi.create(formData);
            showAlert('Tạo maintenance thành công!', 'success');
            setOpenDialog(false);
            if (selectedVehicle) {
                loadVehicleMaintenances(selectedVehicle);
            }
        } catch (error) {
            showAlert('Lỗi tạo maintenance: ' + error.message, 'error');
        }
    };

    const handleMarkAsPaid = async (maintenanceId) => {
        try {
            await maintenanceApi.markAsPaid(maintenanceId);
            showAlert('Đánh dấu đã thanh toán thành công!', 'success');
            if (selectedVehicle) {
                loadVehicleMaintenances(selectedVehicle);
            }
        } catch (error) {
            showAlert('Lỗi đánh dấu thanh toán: ' + error.message, 'error');
        }
    };

    const getMaintenanceTypeLabel = (type) => {
        switch (type) {
            case MaintenanceType.ROUTINE_MAINTENANCE: return 'Bảo dưỡng định kỳ';
            case MaintenanceType.EMERGENCY_REPAIR: return 'Sửa chữa khẩn cấp';
            case MaintenanceType.PREVENTIVE_MAINTENANCE: return 'Bảo dưỡng phòng ngừa';
            case MaintenanceType.UPGRADE: return 'Nâng cấp';
            case MaintenanceType.INSPECTION: return 'Kiểm tra';
            case MaintenanceType.WARRANTY: return 'Bảo hành';
            default: return 'Khác';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case SeverityType.LOW: return 'success';
            case SeverityType.MEDIUM: return 'warning';
            case SeverityType.HIGH: return 'error';
            default: return 'default';
        }
    };

    const getSeverityLabel = (severity) => {
        switch (severity) {
            case SeverityType.LOW: return 'Thấp';
            case SeverityType.MEDIUM: return 'Trung bình';
            case SeverityType.HIGH: return 'Cao';
            default: return 'Không xác định';
        }
    };

    const renderMaintenanceCard = (maintenance) => (
        <Card key={maintenance.maintenanceId} sx={{ mb: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                            {getMaintenanceTypeLabel(maintenance.maintenanceType)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <MaintenanceIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {new Date(maintenance.maintenanceDate).toLocaleDateString('vi-VN')}
                            {maintenance.serviceProvider && ` - ${maintenance.serviceProvider}`}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                            {maintenance.cost?.toLocaleString('vi-VN')} VND
                        </Typography>
                        <Typography variant="body2">
                            {maintenance.description}
                        </Typography>
                        {maintenance.odometer && (
                            <Typography variant="caption" color="text.secondary">
                                Số km: {maintenance.odometer.toLocaleString('vi-VN')}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Chip
                                label={getSeverityLabel(maintenance.severity)}
                                color={getSeverityColor(maintenance.severity)}
                                size="small"
                                sx={{ mb: 1 }}
                            />
                            <Chip
                                label={maintenance.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                color={maintenance.isPaid ? 'success' : 'warning'}
                                size="small"
                                variant="outlined"
                            />
                            {maintenance.isEmergency && (
                                <Chip
                                    label="Khẩn cấp"
                                    color="error"
                                    size="small"
                                    icon={<WarningIcon />}
                                    sx={{ mt: 1 }}
                                />
                            )}
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
                {!maintenance.isPaid && (
                    <Button
                        size="small"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => handleMarkAsPaid(maintenance.maintenanceId)}
                    >
                        Đánh dấu đã trả
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
                                {statistics.totalMaintenances}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng maintenance
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="success.main">
                                {statistics.totalCost?.toLocaleString('vi-VN')} VND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng chi phí
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="info.main">
                                {statistics.averageCost?.toLocaleString('vi-VN')} VND
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Chi phí trung bình
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" color="warning.main">
                                {statistics.emergencyAnalysis?.emergencyRate?.toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tỷ lệ khẩn cấp
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Next Maintenance */}
                {statistics.nextMaintenance && (
                    <Grid item xs={12}>
                        <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Maintenance tiếp theo
                                </Typography>
                                <Typography variant="body1">
                                    {getMaintenanceTypeLabel(statistics.nextMaintenance.type)}
                                </Typography>
                                <Typography variant="body2">
                                    Ngày dự kiến: {new Date(statistics.nextMaintenance.estimatedDate).toLocaleDateString('vi-VN')}
                                </Typography>
                                <Typography variant="body2">
                                    Chi phí ước tính: {statistics.nextMaintenance.estimatedCost?.toLocaleString('vi-VN')} VND
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Recommendations */}
                {statistics.recommendations?.length > 0 && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Khuyến nghị
                                </Typography>
                                <List dense>
                                    {statistics.recommendations.map((recommendation, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={`• ${recommendation}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý Maintenance
                </Typography>

                {alert.open && (
                    <Alert severity={alert.severity} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <FormControl sx={{ minWidth: 200, mr: 2 }}>
                        <InputLabel>Chọn xe</InputLabel>
                        <Select
                            value={selectedVehicle}
                            onChange={(e) => {
                                setSelectedVehicle(e.target.value);
                                loadVehicleMaintenances(e.target.value);
                            }}
                        >
                            {vehicles.map(vehicle => (
                                <MenuItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name || vehicle.licensePlate}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setFormData({ ...formData, vehicleId: selectedVehicle });
                            setOpenDialog(true);
                        }}
                        sx={{ mr: 2 }}
                        disabled={!selectedVehicle}
                    >
                        Tạo Maintenance
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => selectedVehicle && loadVehicleMaintenances(selectedVehicle)}
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
                        <Tab label={`Maintenance (${maintenances.length})`} />
                        <Tab label="Thống kê" />
                    </Tabs>

                    <Box sx={{ p: 2 }}>
                        {activeTab === 0 && (
                            <Grid container spacing={2}>
                                {maintenances.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography variant="body1" color="text.secondary" textAlign="center">
                                            Chưa có maintenance nào
                                        </Typography>
                                    </Grid>
                                ) : (
                                    maintenances.map(maintenance => (
                                        <Grid item xs={12} md={6} key={maintenance.maintenanceId}>
                                            {renderMaintenanceCard(maintenance)}
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        )}

                        {activeTab === 1 && renderStatisticsCard()}
                    </Box>
                </Paper>

                {/* Create Maintenance Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Tạo Maintenance Mới</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Loại maintenance</InputLabel>
                                        <Select
                                            value={formData.maintenanceType}
                                            onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
                                        >
                                            <MenuItem value={MaintenanceType.ROUTINE_MAINTENANCE}>Bảo dưỡng định kỳ</MenuItem>
                                            <MenuItem value={MaintenanceType.EMERGENCY_REPAIR}>Sửa chữa khẩn cấp</MenuItem>
                                            <MenuItem value={MaintenanceType.PREVENTIVE_MAINTENANCE}>Bảo dưỡng phòng ngừa</MenuItem>
                                            <MenuItem value={MaintenanceType.UPGRADE}>Nâng cấp</MenuItem>
                                            <MenuItem value={MaintenanceType.INSPECTION}>Kiểm tra</MenuItem>
                                            <MenuItem value={MaintenanceType.WARRANTY}>Bảo hành</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Mức độ nghiêm trọng</InputLabel>
                                        <Select
                                            value={formData.severity}
                                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                        >
                                            <MenuItem value={SeverityType.LOW}>Thấp</MenuItem>
                                            <MenuItem value={SeverityType.MEDIUM}>Trung bình</MenuItem>
                                            <MenuItem value={SeverityType.HIGH}>Cao</MenuItem>
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
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Chi phí (VND)"
                                        type="number"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nhà cung cấp dịch vụ"
                                        value={formData.serviceProvider}
                                        onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="Ngày maintenance"
                                        value={formData.maintenanceDate}
                                        onChange={(newValue) => setFormData({ ...formData, maintenanceDate: newValue })}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="Ngày maintenance tiếp theo"
                                        value={formData.nextMaintenanceDate}
                                        onChange={(newValue) => setFormData({ ...formData, nextMaintenanceDate: newValue })}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Số km hiện tại"
                                        type="number"
                                        value={formData.odometer}
                                        onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) || 0 })}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ghi chú"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button onClick={handleCreateMaintenance} variant="contained">
                            Tạo Maintenance
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default MaintenanceManagement;