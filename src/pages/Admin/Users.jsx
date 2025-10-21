import React from 'react';
import {
    Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Grid, Chip, IconButton, Menu, MenuItem,
    Snackbar, Alert, Box, Stack, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MoreVert, Add, Edit, Delete, Block, CheckCircle, People, Warning } from '@mui/icons-material';
import userApi from '../../api/userApi';

export default function Users() {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [actionUser, setActionUser] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');
    const [form, setForm] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'CoOwner',
        password: '',
    });

    React.useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await userApi.getAll();
            const data = Array.isArray(res.data) ? res.data : res.data?.items || [];
            setUsers(data.map((user, index) => ({ id: user.id || index, ...user })));
        } catch (err) {
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setForm({ fullName: '', email: '', phone: '', role: 'CoOwner', password: '' });
        setOpenDialog(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setForm({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'CoOwner',
            password: '',
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        setError('');
        setMessage('');
        try {
            if (selectedUser) {
                // Update user
                await userApi.update(selectedUser.id, {
                    fullName: form.fullName,
                    phoneNumber: form.phone,
                    // Don't update email and password in edit mode
                });
                setMessage('Cập nhật người dùng thành công');
            } else {
                // Create user - use proper field names matching backend
                await userApi.create({
                    fullName: form.fullName,
                    email: form.email,
                    phoneNumber: form.phone,
                    password: form.password,
                    role: form.role,
                    status: 'Active'
                });
                setMessage('Tạo người dùng thành công');
            }
            setOpenDialog(false);
            await loadUsers();
        } catch (err) {
            setError(err?.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await userApi.delete(userId);
            setMessage('Xóa người dùng thành công');
            await loadUsers();
        } catch (err) {
            setError('Xóa người dùng thất bại');
        }
        setAnchorEl(null);
    };

    const handleActivate = async (userId) => {
        try {
            await userApi.updateStatus(userId, 'Active');
            setMessage('Kích hoạt tài khoản thành công');
            await loadUsers();
        } catch (err) {
            setError('Kích hoạt thất bại');
        }
        setAnchorEl(null);
    };

    const handleDeactivate = async (userId) => {
        try {
            await userApi.updateStatus(userId, 'Inactive');
            setMessage('Vô hiệu hóa tài khoản thành công');
            await loadUsers();
        } catch (err) {
            setError('Vô hiệu hóa thất bại');
        }
        setAnchorEl(null);
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await userApi.updateRole(userId, newRole);
            setMessage('Cập nhật vai trò thành công');
            await loadUsers();
        } catch (err) {
            setError('Cập nhật vai trò thất bại');
        }
    };

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setActionUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActionUser(null);
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'Active':
                return <Chip label="Hoạt động" color="success" size="small" />;
            case 'Inactive':
                return <Chip label="Vô hiệu hóa" color="error" size="small" />;
            case 'Pending':
                return <Chip label="Chờ xác nhận" color="warning" size="small" />;
            default:
                return <Chip label="Không xác định" color="default" size="small" />;
        }
    };

    const getRoleChip = (role) => {
        const colors = {
            Admin: 'error',
            Staff: 'warning',
            CoOwner: 'primary'
        };
        return <Chip label={role} color={colors[role] || 'default'} size="small" />;
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'fullName', headerName: 'Họ tên', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phone', headerName: 'Điện thoại', width: 130 },
        {
            field: 'role',
            headerName: 'Vai trò',
            width: 120,
            renderCell: (params) => getRoleChip(params.value)
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
                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Quản lý người dùng
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Quản lý tài khoản, phân quyền và theo dõi hoạt động người dùng
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                                startIcon={<Add />}
                                onClick={handleCreate}
                            >
                                Thêm người dùng
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <People sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="h4">{users.length}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tổng người dùng
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                            <Box>
                                <Typography variant="h4">{users.filter(u => u.status === 'Active').length}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Đang hoạt động
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Block sx={{ fontSize: 40, color: 'error.main' }} />
                            <Box>
                                <Typography variant="h4">{users.filter(u => u.status === 'Inactive').length}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Vô hiệu hóa
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
                            <Box>
                                <Typography variant="h4">{users.filter(u => u.status === 'Pending').length}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Chờ xác nhận
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Danh sách người dùng ({users.length})
                        </Typography>

                        <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={users}
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
                <MenuItem onClick={() => { handleEdit(actionUser); handleMenuClose(); }}>
                    <Edit sx={{ mr: 1 }} /> Chỉnh sửa
                </MenuItem>
                {actionUser?.status === 'Active' ? (
                    <MenuItem onClick={() => handleDeactivate(actionUser.id)}>
                        <Block sx={{ mr: 1 }} /> Vô hiệu hóa
                    </MenuItem>
                ) : (
                    <MenuItem onClick={() => handleActivate(actionUser.id)}>
                        <CheckCircle sx={{ mr: 1 }} /> Kích hoạt
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleDelete(actionUser.id)} sx={{ color: 'error.main' }}>
                    <Delete sx={{ mr: 1 }} /> Xóa
                </MenuItem>
            </Menu>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Họ và tên"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Vai trò"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                SelectProps={{ native: true }}
                            >
                                <option value="CoOwner">Co-Owner</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </TextField>
                        </Grid>
                        {!selectedUser && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mật khẩu"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained">
                        {selectedUser ? 'Cập nhật' : 'Tạo mới'}
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