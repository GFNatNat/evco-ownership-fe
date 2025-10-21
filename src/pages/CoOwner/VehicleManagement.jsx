import React from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Snackbar, Alert, Stack, IconButton, Avatar, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Share, Visibility, VerifiedUser } from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';
import { useNavigate } from 'react-router-dom';

export default function VehicleManagement() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedVehicle, setSelectedVehicle] = React.useState(null);
    const [openInviteDialog, setOpenInviteDialog] = React.useState(false);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [invitationForm, setInvitationForm] = React.useState({
        email: '',
        ownershipPercentage: '',
        message: ''
    });
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const res = await vehicleApi.getMyVehicles();
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setVehicles(data.map((vehicle, index) => ({ id: vehicle.id || index, ...vehicle })));
        } catch (err) {
            setError('Không thể tải danh sách xe');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVehicle = () => {
        navigate('/co-owner/create-vehicle');
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

    const handleInviteCoOwner = (vehicle) => {
        setSelectedVehicle(vehicle);
        setInvitationForm({ email: '', ownershipPercentage: '', message: '' });
        setOpenInviteDialog(true);
    };

    const sendInvitation = async () => {
        setError('');
        setMessage('');
        try {
            await vehicleApi.sendInvitation(selectedVehicle.id, {
                email: invitationForm.email,
                ownershipPercentage: Number(invitationForm.ownershipPercentage),
                message: invitationForm.message
            });
            setMessage('Gửi lời mời thành công');
            setOpenInviteDialog(false);
        } catch (err) {
            setError(err?.response?.data?.message || 'Gửi lời mời thất bại');
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            'Active': { label: 'Hoạt động', color: 'success' },
            'Pending': { label: 'Chờ xác nhận', color: 'warning' },
            'Verified': { label: 'Đã xác minh', color: 'primary' },
            'Rejected': { label: 'Bị từ chối', color: 'error' },
            'Inactive': { label: 'Không hoạt động', color: 'default' }
        };
        const config = statusConfig[status] || { label: status, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    const columns = [
        {
            field: 'image',
            headerName: '',
            width: 60,
            renderCell: (params) => (
                <Avatar
                    src={params.row.imageUrl}
                    alt={`${params.row.make} ${params.row.model}`}
                    sx={{ width: 40, height: 40 }}
                />
            ),
            sortable: false,
        },
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
                        {params.row.year} • {params.row.licensePlate}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'ownershipPercentage',
            headerName: 'Tỷ lệ sở hữu',
            width: 120,
            renderCell: (params) => `${params.value}%`,
        },
        {
            field: 'coOwnersCount',
            headerName: 'Đồng sở hữu',
            width: 100,
            renderCell: (params) => `${params.value || 0} người`,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 130,
            renderCell: (params) => getStatusChip(params.value),
        },
        {
            field: 'verificationStatus',
            headerName: 'Xác minh',
            width: 120,
            renderCell: (params) => getStatusChip(params.value),
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        size="small"
                        onClick={() => handleViewDetail(params.row)}
                        title="Xem chi tiết"
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleInviteCoOwner(params.row)}
                        title="Mời đồng sở hữu"
                    >
                        <Share />
                    </IconButton>
                    <IconButton
                        size="small"
                        title="Chỉnh sửa"
                    >
                        <Edit />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Quản lý xe</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateVehicle}
                >
                    Thêm xe mới
                </Button>
            </Box>

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
                <DialogTitle>Chi tiết xe</DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
                                <Stack spacing={1}>
                                    <Typography><strong>Hãng:</strong> {selectedVehicle.make}</Typography>
                                    <Typography><strong>Mẫu:</strong> {selectedVehicle.model}</Typography>
                                    <Typography><strong>Năm:</strong> {selectedVehicle.year}</Typography>
                                    <Typography><strong>Màu:</strong> {selectedVehicle.color}</Typography>
                                    <Typography><strong>Biển số:</strong> {selectedVehicle.licensePlate}</Typography>
                                    <Typography><strong>Số VIN:</strong> {selectedVehicle.vinNumber}</Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Đồng sở hữu</Typography>
                                {selectedVehicle.coOwners?.map((owner, index) => (
                                    <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="body2">
                                            <strong>{owner.name || owner.email}</strong> - {owner.ownershipPercentage}%
                                            {owner.isOwner && (
                                                <Chip label="Chủ sở hữu" size="small" color="primary" sx={{ ml: 1 }} />
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Grid>

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
                </DialogActions>
            </Dialog>

            {/* Invite Co-owner Dialog */}
            <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Mời đồng sở hữu</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email người được mời"
                                type="email"
                                value={invitationForm.email}
                                onChange={(e) => setInvitationForm({ ...invitationForm, email: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tỷ lệ sở hữu (%)"
                                type="number"
                                value={invitationForm.ownershipPercentage}
                                onChange={(e) => setInvitationForm({ ...invitationForm, ownershipPercentage: e.target.value })}
                                required
                                inputProps={{ min: 1, max: 99 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Lời nhắn (tùy chọn)"
                                multiline
                                rows={3}
                                value={invitationForm.message}
                                onChange={(e) => setInvitationForm({ ...invitationForm, message: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInviteDialog(false)}>Hủy</Button>
                    <Button onClick={sendInvitation} variant="contained">
                        Gửi lời mời
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