import React from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Snackbar, Alert, Stack, Avatar, Divider, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Close, Visibility, VerifiedUser, Warning } from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';

export default function VehicleVerification() {
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedVehicle, setSelectedVehicle] = React.useState(null);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = React.useState(false);
    const [verificationForm, setVerificationForm] = React.useState({
        status: '',
        notes: '',
        verificationDocuments: ''
    });
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const res = await vehicleApi.list({ needsVerification: true });
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setVehicles(data.map((vehicle, index) => ({ id: vehicle.id || index, ...vehicle })));
        } catch (err) {
            setError('Không thể tải danh sách xe cần xác minh');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (vehicle) => {
        try {
            const res = await vehicleApi.get(vehicle.id);
            setSelectedVehicle(res.data);
            setOpenDetailDialog(true);
        } catch (err) {
            setError('Không thể tải thông tin chi tiết xe');
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
            <Typography variant="h5" gutterBottom>
                Xác minh xe
            </Typography>

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