import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Build as BuildIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { staffApi } from '../../api';
import { MAINTENANCE_TYPE, MAINTENANCE_STATUS } from '../../constants/maintenanceTypes';

export default function Services() {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const [tabValue, setTabValue] = React.useState(0);

    // Services state
    const [services, setServices] = React.useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = React.useState([]);

    // Dialog states
    const [serviceDialog, setServiceDialog] = React.useState(false);
    const [maintenanceDialog, setMaintenanceDialog] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState(null);
    const [selectedMaintenance, setSelectedMaintenance] = React.useState(null);

    // Form states
    const [serviceForm, setServiceForm] = React.useState({
        name: '',
        description: '',
        type: '',
        estimated_cost: 0,
        estimated_duration: 60, // minutes
        required_parts: '',
        service_provider: ''
    });

    const [maintenanceForm, setMaintenanceForm] = React.useState({
        vehicle_id: '',
        service_id: '',
        scheduled_date: '',
        notes: '',
        priority: 'MEDIUM'
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load maintenance tasks from PostgreSQL database
            const maintenanceRes = await staffApi.maintenance.getTasks();

            if (maintenanceRes && maintenanceRes.data) {
                setMaintenanceRequests(maintenanceRes.data);
            } else {
                setMaintenanceRequests([]);
            }

            // For services, we'll use a basic service list since there's no specific getServices endpoint
            setServices([
                {
                    id: 1,
                    name: 'Bảo dưỡng định kỳ',
                    description: 'Kiểm tra và bảo dưỡng xe định kỳ',
                    type: MAINTENANCE_TYPE.PREVENTIVE,
                    estimated_cost: 500000,
                    estimated_duration: 120,
                    service_provider: 'Service Center'
                },
                {
                    id: 2,
                    name: 'Sửa chữa khẩn cấp',
                    description: 'Sửa chữa các sự cố khẩn cấp',
                    type: MAINTENANCE_TYPE.CORRECTIVE,
                    estimated_cost: 1000000,
                    estimated_duration: 240,
                    service_provider: 'Emergency Service'
                }
            ]);
        } catch (err) {
            console.error('Maintenance API Error:', err);
            setError(`Lỗi kết nối database: ${err.message || 'Network error'}`);
            setServices([]);
            setMaintenanceRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCreateService = async () => {
        try {
            setLoading(true);
            // Since there's no specific service creation API, we'll create a maintenance task
            const response = await staffApi.maintenance.createTask({
                title: serviceForm.name,
                description: serviceForm.description,
                type: serviceForm.type,
                estimated_cost: parseFloat(serviceForm.estimated_cost),
                estimated_duration: parseInt(serviceForm.estimated_duration),
                notes: `Service Provider: ${serviceForm.service_provider}, Required Parts: ${serviceForm.required_parts}`,
                created_by: user.id
            });

            if (response.data) {
                setSuccess('Tạo dịch vụ thành công!');
                setServiceDialog(false);
                setServiceForm({
                    name: '',
                    description: '',
                    type: '',
                    estimated_cost: 0,
                    estimated_duration: 60,
                    required_parts: '',
                    service_provider: ''
                });
                loadData();
            }
        } catch (err) {
            setError(`Lỗi tạo dịch vụ: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleMaintenance = async () => {
        try {
            setLoading(true);
            const response = await staffApi.maintenance.scheduleMaintenace({
                vehicle_id: parseInt(maintenanceForm.vehicle_id),
                service_type: maintenanceForm.service_id,
                scheduled_date: maintenanceForm.scheduled_date,
                notes: maintenanceForm.notes,
                priority: maintenanceForm.priority,
                scheduled_by: user.id
            });

            if (response.data) {
                setSuccess('Lên lịch bảo trì thành công!');
                setMaintenanceDialog(false);
                setMaintenanceForm({
                    vehicle_id: '',
                    service_id: '',
                    scheduled_date: '',
                    notes: '',
                    priority: 'MEDIUM'
                });
                loadData();
            }
        } catch (err) {
            setError(`Lỗi lên lịch bảo trì: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getMaintenanceStatusColor = (status) => {
        switch (status) {
            case MAINTENANCE_STATUS.SCHEDULED: return 'info';
            case MAINTENANCE_STATUS.IN_PROGRESS: return 'warning';
            case MAINTENANCE_STATUS.COMPLETED: return 'success';
            case MAINTENANCE_STATUS.CANCELLED: return 'error';
            default: return 'default';
        }
    };

    const getMaintenanceStatusLabel = (status) => {
        switch (status) {
            case MAINTENANCE_STATUS.SCHEDULED: return 'Đã lên lịch';
            case MAINTENANCE_STATUS.IN_PROGRESS: return 'Đang thực hiện';
            case MAINTENANCE_STATUS.COMPLETED: return 'Hoàn thành';
            case MAINTENANCE_STATUS.CANCELLED: return 'Đã hủy';
            default: return status;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'info';
            default: return 'default';
        }
    };

    return (
        <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
                <Card sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Quản lý dịch vụ bảo trì
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Quản lý dịch vụ và lịch bảo trì xe trong hệ thống
                                </Typography>
                            </Box>
                            <BuildIcon sx={{ fontSize: 60, opacity: 0.8 }} />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Alerts */}
            {error && (
                <Grid item xs={12}>
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                </Grid>
            )}
            {success && (
                <Grid item xs={12}>
                    <Alert severity="success" onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                </Grid>
            )}

            {/* Main Content */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="Dịch vụ bảo trì" />
                                <Tab label="Lịch bảo trì" />
                            </Tabs>
                        </Box>

                        {/* Services Tab */}
                        {tabValue === 0 && (
                            <>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6">Danh sách dịch vụ</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setServiceDialog(true)}
                                    >
                                        Thêm dịch vụ
                                    </Button>
                                </Box>

                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tên dịch vụ</TableCell>
                                                <TableCell>Loại</TableCell>
                                                <TableCell>Chi phí ước tính</TableCell>
                                                <TableCell>Thời gian ước tính</TableCell>
                                                <TableCell>Nhà cung cấp</TableCell>
                                                <TableCell>Thao tác</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service.id}>
                                                    <TableCell>
                                                        <Typography variant="subtitle2">{service.name}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {service.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={service.type || 'N/A'}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(service.estimated_cost || 0)}
                                                    </TableCell>
                                                    <TableCell>{service.estimated_duration || 0} phút</TableCell>
                                                    <TableCell>{service.service_provider || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedService(service);
                                                                setServiceForm(service);
                                                                setServiceDialog(true);
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {services.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center">
                                                        <Typography color="textSecondary">
                                                            Chưa có dịch vụ nào
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}

                        {/* Maintenance Schedule Tab */}
                        {tabValue === 1 && (
                            <>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6">Lịch bảo trì</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<ScheduleIcon />}
                                        onClick={() => setMaintenanceDialog(true)}
                                    >
                                        Lên lịch bảo trì
                                    </Button>
                                </Box>

                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Xe</TableCell>
                                                <TableCell>Dịch vụ</TableCell>
                                                <TableCell>Ngày lên lịch</TableCell>
                                                <TableCell>Ưu tiên</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell>Ghi chú</TableCell>
                                                <TableCell>Thao tác</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {maintenanceRequests.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell>
                                                        <Typography variant="subtitle2">
                                                            {request.vehicle?.name || `Vehicle ${request.vehicle_id}`}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {request.vehicle?.license_plate || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.service?.name || `Service ${request.service_id}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(request.scheduled_date).toLocaleDateString('vi-VN')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={request.priority}
                                                            size="small"
                                                            color={getPriorityColor(request.priority)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={getMaintenanceStatusLabel(request.status)}
                                                            size="small"
                                                            color={getMaintenanceStatusColor(request.status)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{request.notes || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setSelectedMaintenance(request);
                                                                setMaintenanceForm({
                                                                    ...request,
                                                                    scheduled_date: request.scheduled_date?.split('T')[0] || ''
                                                                });
                                                                setMaintenanceDialog(true);
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {maintenanceRequests.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center">
                                                        <Typography color="textSecondary">
                                                            Chưa có lịch bảo trì nào
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Service Dialog */}
            <Dialog open={serviceDialog} onClose={() => setServiceDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Tên dịch vụ"
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Loại dịch vụ"
                                value={serviceForm.type}
                                onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}
                                required
                            >
                                {Object.values(MAINTENANCE_TYPE).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Chi phí ước tính (VND)"
                                type="number"
                                value={serviceForm.estimated_cost}
                                onChange={(e) => setServiceForm({ ...serviceForm, estimated_cost: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Thời gian ước tính (phút)"
                                type="number"
                                value={serviceForm.estimated_duration}
                                onChange={(e) => setServiceForm({ ...serviceForm, estimated_duration: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phụ tùng yêu cầu"
                                value={serviceForm.required_parts}
                                onChange={(e) => setServiceForm({ ...serviceForm, required_parts: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nhà cung cấp"
                                value={serviceForm.service_provider}
                                onChange={(e) => setServiceForm({ ...serviceForm, service_provider: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setServiceDialog(false)}>Hủy</Button>
                    <Button onClick={handleCreateService} variant="contained" disabled={loading}>
                        {selectedService ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Maintenance Dialog */}
            <Dialog open={maintenanceDialog} onClose={() => setMaintenanceDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedMaintenance ? 'Chỉnh sửa lịch bảo trì' : 'Lên lịch bảo trì mới'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="ID Xe"
                                type="number"
                                value={maintenanceForm.vehicle_id}
                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicle_id: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Dịch vụ"
                                value={maintenanceForm.service_id}
                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, service_id: e.target.value })}
                                required
                            >
                                {services.map((service) => (
                                    <MenuItem key={service.id} value={service.id}>
                                        {service.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Ngày lên lịch"
                                type="date"
                                value={maintenanceForm.scheduled_date}
                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, scheduled_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Ưu tiên"
                                value={maintenanceForm.priority}
                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })}
                            >
                                <MenuItem value="LOW">Thấp</MenuItem>
                                <MenuItem value="MEDIUM">Trung bình</MenuItem>
                                <MenuItem value="HIGH">Cao</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú"
                                value={maintenanceForm.notes}
                                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMaintenanceDialog(false)}>Hủy</Button>
                    <Button onClick={handleScheduleMaintenance} variant="contained" disabled={loading}>
                        {selectedMaintenance ? 'Cập nhật' : 'Lên lịch'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}