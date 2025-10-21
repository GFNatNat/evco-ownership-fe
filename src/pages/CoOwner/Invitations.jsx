import React from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Chip, Box,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, Stack, Avatar, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Close, Visibility } from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';

export default function Invitations() {
    const [invitations, setInvitations] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedInvitation, setSelectedInvitation] = React.useState(null);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        setLoading(true);
        try {
            const res = await vehicleApi.getInvitations();
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setInvitations(data.map((invitation, index) => ({ id: invitation.id || index, ...invitation })));
        } catch (err) {
            setError('Không thể tải danh sách lời mời');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (invitation) => {
        setSelectedInvitation(invitation);
        setOpenDetailDialog(true);
    };

    const handleRespond = async (invitationId, response) => {
        setError('');
        setMessage('');
        try {
            await vehicleApi.respondToInvitation(invitationId, { response });
            setMessage(response === 'accept' ? 'Đã chấp nhận lời mời' : 'Đã từ chối lời mời');
            await loadInvitations();
        } catch (err) {
            setError(err?.response?.data?.message || 'Phản hồi lời mời thất bại');
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
                                onClick={() => handleRespond(params.row.id, 'accept')}
                            >
                                Chấp nhận
                            </Button>
                            <Button
                                size="small"
                                color="error"
                                startIcon={<Close />}
                                onClick={() => handleRespond(params.row.id, 'reject')}
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
            <Typography variant="h5" gutterBottom>
                Lời mời đồng sở hữu
            </Typography>

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
                                                handleRespond(selectedInvitation.id, 'accept');
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
                                                handleRespond(selectedInvitation.id, 'reject');
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