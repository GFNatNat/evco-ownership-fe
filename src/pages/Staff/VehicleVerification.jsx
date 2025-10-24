import React from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Snackbar, Alert, Stack, Divider, FormControl,
    InputLabel, Select, MenuItem, Tabs, Tab, Badge
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Close, Visibility, VerifiedUser, Warning, Refresh, FilterList } from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';

export default function VehicleVerification() {
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedVehicle, setSelectedVehicle] = React.useState(null);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(0);
    const [filters, setFilters] = React.useState({
        status: 'all',
        priority: 'all'
    });
    const [verificationForm, setVerificationForm] = React.useState({
        status: '',
        notes: '',
        verificationDocuments: ''
    });
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');
    
    // Statistics
    const [stats, setStats] = React.useState({
        pending: 0,
        verified: 0,
        rejected: 0,
        total: 0
    });

    React.useEffect(() => {
        loadVehicles();
    }, [activeTab, filters]);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const params = { needsVerification: activeTab === 0 };
            if (filters.status !== 'all') params.verificationStatus = filters.status;
            if (filters.priority !== 'all') params.priority = filters.priority;
            
            const res = await vehicleApi.list(params).catch(() => ({ data: { items: [] } }));
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            const mappedVehicles = data.map((vehicle, index) => ({ id: vehicle.vehicleId || vehicle.id || index, ...vehicle }));
            setVehicles(mappedVehicles);
            
            // Calculate statistics
            setStats({
                pending: mappedVehicles.filter(v => v.verificationStatus === 'Pending').length,
                verified: mappedVehicles.filter(v => v.verificationStatus === 'Verified').length,
                rejected: mappedVehicles.filter(v => v.verificationStatus === 'Rejected').length,
                total: mappedVehicles.length
            });
        } catch (err) {
            console.error('❌ Error loading vehicles for verification:', err);
            setVehicles([]);
            setStats({ pending: 0, verified: 0, rejected: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (vehicle) => {
        try {
            const res = await vehicleApi.get(vehicle.id).catch(() => ({ data: null }));
            if (res.data) {
                setSelectedVehicle(res.data);
                setOpenDetailDialog(true);
            } else {
                console.error('❌ No vehicle details found');
            }
        } catch (err) {
            console.error('❌ Error loading vehicle details:', err);
        }
    };

    const handleStartVerification = (vehicle) => {
        setSelectedVehicle(vehicle);
        setVerificationForm({
            status: '',
            notes: '',
            verificationDocuments: ''
        });
        setOpenVerifyDialog(true);
    };

    const handleVerify = async () => {
        setError('');
        setMessage('');
        try {
            await vehicleApi.verify(selectedVehicle.id, verificationForm);
            setMessage('Xác minh xe thành công');
            setOpenVerifyDialog(false);
            await loadVehicles();
        } catch (err) {
            setError(err?.response?.data?.message || 'Xác minh xe thất bại');
        }
    };

    const getVerificationStatusChip = (status) => {
        const statusConfig = {
            'Pending': { label: 'Chờ xác minh', color: 'warning', icon: <Warning /> },
            'InProgress': { label: 'Đang xác minh', color: 'info', icon: <Warning /> },
            'Verified': { label: 'Đã xác minh', color: 'success', icon: <VerifiedUser /> },
            'Rejected': { label: 'Bị từ chối', color: 'error', icon: <Close /> },
            'RequiresUpdate': { label: 'Cần cập nhật', color: 'warning', icon: <Warning /> }
        };
        const config = statusConfig[status] || { label: status, color: 'default', icon: null };
        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                icon={config.icon}
            />
        );
    };

    const getPriorityChip = (priority) => {
        const priorityConfig = {
            'High': { label: 'Cao', color: 'error' },
            'Medium': { label: 'Trung bình', color: 'warning' },
            'Low': { label: 'Thấp', color: 'success' }
        };
        const config = priorityConfig[priority] || { label: priority, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    const columns = [
        {
            field: 'vehicle',
            headerName: 'Xe',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Typography variant="subtitle2">
                        {params.row.make} {params.row.model}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.licensePlate} • {params.row.year}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'ownerName',
            headerName: 'Chủ sở hữu',
            width: 180,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2">{params.row.ownerName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.ownerEmail}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'verificationStatus',
            headerName: 'Trạng thái',
            width: 140,
            renderCell: (params) => getVerificationStatusChip(params.value),
        },
        {
            field: 'priority',
            headerName: 'Ưu tiên',
            width: 100,
            renderCell: (params) => getPriorityChip(params.value),
        },
        {
            field: 'submittedAt',
            headerName: 'Ngày nộp',
            width: 120,
            valueGetter: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
        },
        {
            field: 'documentsCount',
            headerName: 'Tài liệu',
            width: 100,
            renderCell: (params) => `${params.value || 0} file`,
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetail(params.row)}
                    >
                        Chi tiết
                    </Button>
                    {params.row.verificationStatus === 'Pending' && (
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<VerifiedUser />}
                            onClick={() => handleStartVerification(params.row)}
                        >
                            Xác minh
                        </Button>
                    )}
                </Stack>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                    Xác minh xe
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={loadVehicles}
                >
                    Tải lại
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Chờ xác minh
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {stats.pending}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Đã xác minh
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {stats.verified}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Bị từ chối
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                {stats.rejected}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Tổng số
                            </Typography>
                            <Typography variant="h4" color="primary.main">
                                {stats.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label={
                        <Badge badgeContent={stats.pending} color="warning">
                            Chờ xác minh
                        </Badge>
                    } />
                    <Tab label="Tất cả xe" />
                </Tabs>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FilterList />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={filters.status}
                                label="Trạng thái"
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="Pending">Chờ xác minh</MenuItem>
                                <MenuItem value="Verified">Đã xác minh</MenuItem>
                                <MenuItem value="Rejected">Bị từ chối</MenuItem>
                                <MenuItem value="RequiresUpdate">Cần cập nhật</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Ưu tiên</InputLabel>
                            <Select
                                value={filters.priority}
                                label="Ưu tiên"
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="High">Cao</MenuItem>
                                <MenuItem value="Medium">Trung bình</MenuItem>
                                <MenuItem value="Low">Thấp</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={vehicles}
                            columns={columns}
                            loading={loading}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            getRowHeight={() => 80}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Vehicle Detail Dialog */}
            <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết xe cần xác minh</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Thông tin xe</Typography>
                                <Stack spacing={1}>
                                    <Typography><strong>Hãng:</strong> {selectedVehicle.make}</Typography>
                                    <Typography><strong>Mẫu:</strong> {selectedVehicle.model}</Typography>
                                    <Typography><strong>Năm:</strong> {selectedVehicle.year}</Typography>
                                    <Typography><strong>Màu:</strong> {selectedVehicle.color}</Typography>
                                    <Typography><strong>Biển số:</strong> {selectedVehicle.licensePlate}</Typography>
                                    <Typography><strong>Số VIN:</strong> {selectedVehicle.vinNumber}</Typography>
                                    <Typography><strong>Số máy:</strong> {selectedVehicle.engineNumber}</Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Thông tin chủ sở hữu</Typography>
                                <Stack spacing={1}>
                                    <Typography><strong>Tên:</strong> {selectedVehicle.ownerName}</Typography>
                                    <Typography><strong>Email:</strong> {selectedVehicle.ownerEmail}</Typography>
                                    <Typography><strong>Số điện thoại:</strong> {selectedVehicle.ownerPhone}</Typography>
                                    <Typography><strong>CCCD:</strong> {selectedVehicle.ownerIdNumber}</Typography>
                                    <Typography><strong>GPLX:</strong> {selectedVehicle.ownerLicenseNumber}</Typography>
                                </Stack>
                            </Grid>

                            {selectedVehicle.documents && selectedVehicle.documents.length > 0 && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Tài liệu đính kèm</Typography>
                                    <Grid container spacing={1}>
                                        {selectedVehicle.documents.map((doc, index) => (
                                            <Grid item key={index}>
                                                <Button variant="outlined" size="small" href={doc.url} target="_blank">
                                                    {doc.name}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            )}

                            {selectedVehicle.description && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Mô tả</Typography>
                                    <Typography variant="body2">{selectedVehicle.description}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
                    {selectedVehicle?.verificationStatus === 'Pending' && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                setOpenDetailDialog(false);
                                handleStartVerification(selectedVehicle);
                            }}
                        >
                            Bắt đầu xác minh
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Verification Dialog */}
            <Dialog open={openVerifyDialog} onClose={() => setOpenVerifyDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Xác minh xe</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Kết quả xác minh</InputLabel>
                                <Select
                                    value={verificationForm.status}
                                    label="Kết quả xác minh"
                                    onChange={(e) => setVerificationForm({ ...verificationForm, status: e.target.value })}
                                >
                                    <MenuItem value="Verified">Xác minh thành công</MenuItem>
                                    <MenuItem value="Rejected">Từ chối xác minh</MenuItem>
                                    <MenuItem value="RequiresUpdate">Yêu cầu cập nhật thông tin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú xác minh"
                                multiline
                                rows={4}
                                value={verificationForm.notes}
                                onChange={(e) => setVerificationForm({ ...verificationForm, notes: e.target.value })}
                                placeholder="Nhập ghi chú về quá trình xác minh..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tài liệu xác minh"
                                value={verificationForm.verificationDocuments}
                                onChange={(e) => setVerificationForm({ ...verificationForm, verificationDocuments: e.target.value })}
                                placeholder="Danh sách tài liệu đã kiểm tra..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenVerifyDialog(false)}>Hủy</Button>
                    <Button
                        onClick={handleVerify}
                        variant="contained"
                        disabled={!verificationForm.status}
                    >
                        Xác nhận kết quả
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
            <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
                <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
            </Snackbar>
        </Box>
    );
}