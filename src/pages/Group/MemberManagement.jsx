import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Avatar
} from '@mui/material';
import {
    Group as GroupIcon, PersonAdd as PersonAddIcon, Edit as EditIcon,
    Delete as DeleteIcon, ExitToApp as LeaveIcon, Settings as SettingsIcon
} from '@mui/icons-material';
import groupApi from '../../api/group';

const MemberManagement = ({ groupId }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('invite');
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        role: 'member',
        message: ''
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (groupId) {
            loadMembers();
        }
    }, [groupId]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const response = await groupApi.getMembers(groupId);
            setMembers(response.data?.members || []);
        } catch (error) {
            showAlert('Lỗi tải danh sách thành viên: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleInviteMember = async () => {
        try {
            await groupApi.addMember(groupId, {
                email: formData.email,
                role: formData.role,
                inviteMessage: formData.message
            });
            showAlert('Mời thành viên thành công!', 'success');
            setDialogOpen(false);
            loadMembers();
        } catch (error) {
            showAlert('Lỗi mời thành viên: ' + error.message, 'error');
        }
    };

    const handleUpdateRole = async () => {
        try {
            await groupApi.updateMemberRole(groupId, selectedMember.id, {
                role: formData.role
            });
            showAlert('Cập nhật vai trò thành công!', 'success');
            setDialogOpen(false);
            loadMembers();
        } catch (error) {
            showAlert('Lỗi cập nhật vai trò: ' + error.message, 'error');
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
            try {
                await groupApi.removeMember(groupId, memberId);
                showAlert('Xóa thành viên thành công!', 'success');
                loadMembers();
            } catch (error) {
                showAlert('Lỗi xóa thành viên: ' + error.message, 'error');
            }
        }
    };

    const openInviteDialog = () => {
        setDialogType('invite');
        setFormData({ email: '', role: 'member', message: '' });
        setDialogOpen(true);
    };

    const openRoleDialog = (member) => {
        setDialogType('role');
        setSelectedMember(member);
        setFormData({ email: member.email, role: member.role, message: '' });
        setDialogOpen(true);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'owner': return 'error';
            case 'admin': return 'warning';
            case 'member': return 'primary';
            default: return 'default';
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case 'owner': return 'Chủ sở hữu';
            case 'admin': return 'Quản trị viên';
            case 'member': return 'Thành viên';
            default: return role;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Quản lý Thành viên
            </Typography>

            {alert.open && (
                <Alert severity={alert.severity} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Danh sách Thành viên</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAddIcon />}
                                    onClick={openInviteDialog}
                                >
                                    Mời thành viên
                                </Button>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Thành viên</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Vai trò</TableCell>
                                            <TableCell>Ngày tham gia</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {members.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ mr: 2 }}>
                                                            {member.fullName?.charAt(0) || member.email?.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2">
                                                            {member.fullName || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{member.email}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getRoleText(member.role)}
                                                        color={getRoleColor(member.role)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(member.joinedAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={member.status || 'active'}
                                                        color={member.status === 'active' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => openRoleDialog(member)}
                                                        disabled={member.role === 'owner'}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        disabled={member.role === 'owner'}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'invite' ? 'Mời thành viên mới' : 'Cập nhật vai trò'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {dialogType === 'invite' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <MenuItem value="member">Thành viên</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                    {dialogType === 'invite' && (
                                        <MenuItem value="owner">Chủ sở hữu</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        {dialogType === 'invite' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Lời nhắn (tùy chọn)"
                                    multiline
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
                    <Button
                        onClick={dialogType === 'invite' ? handleInviteMember : handleUpdateRole}
                        variant="contained"
                    >
                        {dialogType === 'invite' ? 'Mời' : 'Cập nhật'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MemberManagement;