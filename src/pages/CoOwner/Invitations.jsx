import React from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, Stack, Avatar, Divider, TextField,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Close, Visibility, PersonAdd } from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';

export default function Invitations() {
    const [invitations, setInvitations] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedInvitation, setSelectedInvitation] = React.useState(null);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [openInviteDialog, setOpenInviteDialog] = React.useState(false);
    const [myVehicles, setMyVehicles] = React.useState([]);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    const [inviteForm, setInviteForm] = React.useState({
        vehicleId: '',
        email: '',
        ownershipPercentage: '',
        investmentAmount: '',
        message: ''
    });

    React.useEffect(() => {
        loadInvitations();
        loadMyVehicles();
    }, []);

    const loadInvitations = async () => {
        setLoading(true);
        try {
            const res = await vehicleApi.getPendingInvitations();
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setInvitations(data.map((invitation, index) => ({
                id: invitation.invitationId || index,
                ...invitation,
                vehicle: {
                    make: invitation.vehicleBrand,
                    model: invitation.vehicleModel,
                    licensePlate: invitation.licensePlate
                }
            })));
        } catch (err) {
            console.error('❌ Error loading invitations:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMyVehicles = async () => {
        try {
            const res = await vehicleApi.getMyVehicles();
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setMyVehicles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Error loading vehicles:', err);
            setMyVehicles([]);
        }
    };

    const handleViewDetail = (invitation) => {
        setSelectedInvitation(invitation);
        setOpenDetailDialog(true);
    };

    const handleRespond = async (invitation, accept) => {
        setError('');
        setMessage('');
        try {
            await vehicleApi.respondToInvitation(invitation.vehicleId, { response: accept });
            setMessage(accept ? 'Đã chấp nhận lời mời đồng sở hữu' : 'Đã từ chối lời mời đồng sở hữu');
            await loadInvitations();
        } catch (err) {
            setError(err?.response?.data?.message || 'Phản hồi lời mời thất bại');
        }
    };

    const handleOpenInviteDialog = () => {
        setInviteForm({
            vehicleId: '',
            email: '',
            ownershipPercentage: '',
            investmentAmount: '',
            message: ''
        });
        setOpenInviteDialog(true);
    };

    const handleSendInvitation = async () => {
        setError('');
        setMessage('');

        // Validation
        if (!inviteForm.vehicleId) {
            setError('Vui lòng chọn xe');
            return;
        }
        if (!inviteForm.email) {
            setError('Vui lòng nhập email người nhận');
            return;
        }
        if (!inviteForm.ownershipPercentage || inviteForm.ownershipPercentage <= 0 || inviteForm.ownershipPercentage > 100) {
            setError('Tỷ lệ sở hữu phải từ 0-100%');
            return;
        }
        if (!inviteForm.investmentAmount || inviteForm.investmentAmount <= 0) {
            setError('Số tiền đầu tư phải lớn hơn 0');
            return;
        }

        try {
            await vehicleApi.addCoOwner(inviteForm.vehicleId, {
                email: inviteForm.email,
                ownershipPercentage: parseFloat(inviteForm.ownershipPercentage),
                investmentAmount: parseFloat(inviteForm.investmentAmount),
                message: inviteForm.message
            });
            setMessage('Đã gửi lời mời đồng sở hữu thành công!');
            setOpenInviteDialog(false);
            await loadInvitations();
        } catch (err) {
            setError(err?.response?.data?.message || 'Gửi lời mời thất bại');
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            'Pending': { label: 'Chờ phản hồi', color: 'warning' },
            'Accepted': { label: 'Đã chấp nhận', color: 'success' },
            'Rejected': { label: 'Đã từ chối', color: 'error' },
            'Expired': { label: 'Hết hạn', color: 'default' }
        };
        const config = statusConfig[status] || { label: status, color: 'default' };
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
                        {params.row.vehicle?.make} {params.row.vehicle?.model}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.vehicle?.licensePlate} • {params.row.vehicle?.year}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'inviterName',
            headerName: 'Người mời',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2">{params.row.inviterName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.inviterEmail}
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
            field: 'status',
            headerName: 'Trạng thái',
            width: 130,
            renderCell: (params) => getStatusChip(params.value),
        },
        {
            field: 'createdAt',
            headerName: 'Ngày mời',
            width: 130,
            valueGetter: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
        },
        {
            field: 'expiresAt',
            headerName: 'Hết hạn',
            width: 130,
            valueGetter: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '',
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
                    {params.row.status === 'Pending' && (
                        <>
                            <Button
                                size="small"
                                color="success"
                                startIcon={<Check />}
                                onClick={() => handleRespond(params.row, true)}
                            >
                                Chấp nhận
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                startIcon={<Close />}
                                onClick={() => handleRespond(params.row, false)}
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </Stack>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                    Lời mời đồng sở hữu
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={handleOpenInviteDialog}
                >
                    Mời người mới
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={invitations}
                            columns={columns}
                            loading={loading}
                            pageSizeOptions={[10, 25, 50]}
                            disableRowSelectionOnClick
                            getRowHeight={() => 80}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Send Invitation Dialog */}
            <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Mời người mới đồng sở hữu</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Chọn xe</InputLabel>
                                <Select
                                    value={inviteForm.vehicleId}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                                    label="Chọn xe"
                                >
                                    {myVehicles.map((vehicle) => (
                                        <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                            {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Email người nhận"
                                type="email"
                                fullWidth
                                value={inviteForm.email}
                                onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="email@example.com"
                                helperText="Nhập email của người bạn muốn mời"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Tỷ lệ sở hữu (%)"
                                type="number"
                                fullWidth
                                value={inviteForm.ownershipPercentage}
                                onChange={(e) => setInviteForm(prev => ({ ...prev, ownershipPercentage: e.target.value }))}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                                helperText="Từ 0-100%"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Số tiền đầu tư (VNĐ)"
                                type="number"
                                fullWidth
                                value={inviteForm.investmentAmount}
                                onChange={(e) => setInviteForm(prev => ({ ...prev, investmentAmount: e.target.value }))}
                                inputProps={{ min: 0, step: 1000000 }}
                                helperText="Số tiền góp vốn"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Lời nhắn (tùy chọn)"
                                multiline
                                rows={3}
                                fullWidth
                                value={inviteForm.message}
                                onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Nhập lời nhắn cho người nhận..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInviteDialog(false)}>Hủy</Button>
                    <Button
                        onClick={handleSendInvitation}
                        variant="contained"
                        disabled={!inviteForm.vehicleId || !inviteForm.email || !inviteForm.ownershipPercentage || !inviteForm.investmentAmount}
                    >
                        Gửi lời mời
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Invitation Detail Dialog */}
            <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết lời mời đồng sở hữu</DialogTitle>
                <DialogContent>
                    {selectedInvitation && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Thông tin xe</Typography>
                                <Stack spacing={1}>
                                    <Typography>
                                        <strong>Xe:</strong> {selectedInvitation.vehicle?.make} {selectedInvitation.vehicle?.model}
                                    </Typography>
                                    <Typography>
                                        <strong>Năm:</strong> {selectedInvitation.vehicle?.year}
                                    </Typography>
                                    <Typography>
                                        <strong>Biển số:</strong> {selectedInvitation.vehicle?.licensePlate}
                                    </Typography>
                                    <Typography>
                                        <strong>Màu sắc:</strong> {selectedInvitation.vehicle?.color}
                                    </Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Thông tin lời mời</Typography>
                                <Stack spacing={1}>
                                    <Typography>
                                        <strong>Người mời:</strong> {selectedInvitation.inviterName}
                                    </Typography>
                                    <Typography>
                                        <strong>Email:</strong> {selectedInvitation.inviterEmail}
                                    </Typography>
                                    <Typography>
                                        <strong>Tỷ lệ sở hữu:</strong> {selectedInvitation.ownershipPercentage}%
                                    </Typography>
                                    <Typography>
                                        <strong>Trạng thái:</strong> {getStatusChip(selectedInvitation.status)}
                                    </Typography>
                                    <Typography>
                                        <strong>Ngày mời:</strong> {new Date(selectedInvitation.createdAt).toLocaleString('vi-VN')}
                                    </Typography>
                                    {selectedInvitation.expiresAt && (
                                        <Typography>
                                            <strong>Hết hạn:</strong> {new Date(selectedInvitation.expiresAt).toLocaleString('vi-VN')}
                                        </Typography>
                                    )}
                                </Stack>
                            </Grid>

                            {selectedInvitation.message && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>Lời nhắn</Typography>
                                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="body2">{selectedInvitation.message}</Typography>
                                    </Box>
                                </Grid>
                            )}

                            {selectedInvitation.status === 'Pending' && (
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction="row" spacing={2} justifyContent="center">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<Check />}
                                            onClick={() => {
                                                handleRespond(selectedInvitation, true);
                                                setOpenDetailDialog(false);
                                            }}
                                        >
                                            Chấp nhận lời mời
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Close />}
                                            onClick={() => {
                                                handleRespond(selectedInvitation, false);
                                                setOpenDetailDialog(false);
                                            }}
                                        >
                                            Từ chối lời mời
                                        </Button>
                                    </Stack>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
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