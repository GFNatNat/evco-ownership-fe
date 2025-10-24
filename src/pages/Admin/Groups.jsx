import React from 'react';
import {
    Card, CardContent, Typography, Grid, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Chip, IconButton, Menu,
    MenuItem, Box, Stack, Avatar, AvatarGroup, Snackbar, Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, MoreVert, Group, Person, AccountBalance } from '@mui/icons-material';
import groupApi from '../../api/groupApi';
import vehicleApi from '../../api/vehicleApi';

export default function Groups() {
    const [groups, setGroups] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [actionGroup, setActionGroup] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');
    const [form, setForm] = React.useState({
        name: '',
        description: '',
        vehicleId: '',
        maxMembers: 4
    });

    React.useEffect(() => {
        loadGroups();
        loadVehicles();
    }, []);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const res = await groupApi.getAll().catch(() => ({ data: [] }));
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setGroups(data);
            console.log('✅ Loaded groups:', data.length);
        } catch (err) {
            console.error('❌ Failed to load groups:', err);
            setGroups([]);
        } finally {
            setLoading(false);
        }
    };

    const loadVehicles = async () => {
        try {
            const res = await vehicleApi.getAll({ status: 'Available' }).catch(() => ({ data: [] }));
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setVehicles(data);
            console.log('✅ Loaded vehicles:', data.length);
        } catch (err) {
            console.error('❌ Failed to load vehicles:', err);
            setVehicles([]);
        }
    };

    const handleCreate = () => {
        setSelectedGroup(null);
        setForm({ name: '', description: '', vehicleId: '', maxMembers: 4 });
        setOpenDialog(true);
    };

    const handleEdit = (group) => {
        setSelectedGroup(group);
        setForm({
            name: group.name || '',
            description: group.description || '',
            vehicleId: group.vehicleId || '',
            maxMembers: group.maxMembers || 4
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        setError('');
        setMessage('');
        try {
            if (selectedGroup) {
                await groupApi.update(selectedGroup.id, form);
                setMessage('Cập nhật nhóm thành công');
            } else {
                await groupApi.create(form);
                setMessage('Tạo nhóm thành công');
            }
            setOpenDialog(false);
            await loadGroups();
        } catch (err) {
            setError(err?.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (groupId) => {
        if (!window.confirm('Bạn có chắc muốn xóa nhóm này?')) return;
        try {
            await groupApi.delete(groupId);
            setMessage('Xóa nhóm thành công');
            await loadGroups();
        } catch (err) {
            setError('Xóa nhóm thất bại');
        }
        setAnchorEl(null);
    };

    const handleMenuOpen = (event, group) => {
        setAnchorEl(event.currentTarget);
        setActionGroup(group);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActionGroup(null);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Active':
                return <Chip label="Hoạt động" color="success" size="small" />;
            case 'Inactive':
                return <Chip label="Tạm dừng" color="warning" size="small" />;
            case 'Completed':
                return <Chip label="Hoàn thành" color="info" size="small" />;
            default:
                return <Chip label="Không xác định" color="default" size="small" />;
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Tên nhóm', flex: 1 },
        { field: 'vehicleName', headerName: 'Xe', width: 150 },
        {
            field: 'members',
            headerName: 'Thành viên',
            width: 150,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                        {params.row.memberList?.map((member, index) => (
                            <Avatar key={index} sx={{ fontSize: '0.75rem' }}>
                                {member.name?.charAt(0)}
                            </Avatar>
                        ))}
                    </AvatarGroup>
                    <Typography variant="caption">
                        {params.row.memberCount || 0}/{params.row.maxMembers || 4}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 130,
            renderCell: (params) => getStatusChip(params.value)
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 130,
            valueGetter: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : ''
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
                    <MoreVert />
                </IconButton>
            ),
        },
    ];

    return (
        <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
                <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Quản lý nhóm đồng sở hữu
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Quản lý các nhóm, thành viên và phương tiện sở hữu chung
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                                startIcon={<Add />}
                                onClick={handleCreate}
                            >
                                Tạo nhóm mới
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Summary Cards */}
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                <Group sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4">{groups.length}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng số nhóm
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                <Person sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4">
                                    {groups.reduce((sum, group) => sum + (group.memberCount || 0), 0)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng thành viên
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                                <AccountBalance sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4">
                                    {groups.filter(g => g.status === 'Active').length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Nhóm hoạt động
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Groups Table */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Danh sách nhóm đồng sở hữu ({groups.length})
                        </Typography>

                        <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={groups}
                                columns={columns}
                                loading={loading}
                                pageSizeOptions={[10, 25, 50]}
                                disableRowSelectionOnClick
                            />
                        </div>
                    </CardContent>
                </Card>
            </Grid>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { handleEdit(actionGroup); handleMenuClose(); }}>
                    Chỉnh sửa
                </MenuItem>
                <MenuItem onClick={() => handleDelete(actionGroup?.id)} sx={{ color: 'error.main' }}>
                    Xóa
                </MenuItem>
            </Menu>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedGroup ? 'Chỉnh sửa nhóm' : 'Tạo nhóm mới'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Tên nhóm"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Xe"
                            value={form.vehicleId}
                            onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                            SelectProps={{ native: true }}
                        >
                            <option value="">Chọn xe</option>
                            {vehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            type="number"
                            label="Số thành viên tối đa"
                            value={form.maxMembers}
                            onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) })}
                            inputProps={{ min: 2, max: 10 }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained">
                        {selectedGroup ? 'Cập nhật' : 'Tạo mới'}
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
        </Grid>
    );
}