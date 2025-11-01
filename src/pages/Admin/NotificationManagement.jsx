import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
    Notifications as NotificationsIcon, Send as SendIcon,
    Person as PersonIcon, Group as GroupIcon, History as HistoryIcon
} from '@mui/icons-material';
import adminApi from '../../api/admin';

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('send-to-user');
    const [formData, setFormData] = useState({
        userId: '',
        title: '',
        message: '',
        priority: 'normal',
        type: 'info'
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await adminApi.notifications.getAll({
                pageIndex: 1,
                pageSize: 50
            });
            setNotifications(response.data?.notifications || []);
        } catch (error) {
            showAlert('Lỗi tải danh sách thông báo: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleSendNotification = async () => {
        try {
            if (dialogType === 'send-to-user') {
                await adminApi.notifications.sendToUser(formData);
                showAlert('Gửi thông báo thành công!', 'success');
            } else {
                await adminApi.notifications.create(formData);
                showAlert('Tạo thông báo thành công!', 'success');
            }
            setDialogOpen(false);
            loadData();
        } catch (error) {
            showAlert('Lỗi: ' + error.message, 'error');
        }
    };

    const openDialog = (type) => {
        setDialogType(type);
        setFormData({
            userId: '',
            title: '',
            message: '',
            priority: 'normal',
            type: 'info'
        });
        setDialogOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Thông báo
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
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                                    <Tab icon={<NotificationsIcon />} label="Danh sách Thông báo" />
                                    <Tab icon={<SendIcon />} label="Gửi Thông báo" />
                                </Tabs>
                            </Box>

                            {tabValue === 0 && (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Tiêu đề</TableCell>
                                                <TableCell>Loại</TableCell>
                                                <TableCell>Độ ưu tiên</TableCell>
                                                <TableCell>Thời gian tạo</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {notifications.map((notification) => (
                                                <TableRow key={notification.id}>
                                                    <TableCell>{notification.id}</TableCell>
                                                    <TableCell>{notification.title}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={notification.type}
                                                            color={notification.type === 'error' ? 'error' : 'primary'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={notification.priority}
                                                            color={notification.priority === 'high' ? 'error' : 'default'}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={notification.status || 'sent'}
                                                            color="success"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {tabValue === 1 && (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            startIcon={<PersonIcon />}
                                            onClick={() => openDialog('send-to-user')}
                                            fullWidth
                                        >
                                            Gửi đến người dùng cụ thể
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<GroupIcon />}
                                            onClick={() => openDialog('create-notification')}
                                            fullWidth
                                        >
                                            Tạo thông báo chung
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'send-to-user' ? 'Gửi thông báo đến người dùng' : 'Tạo thông báo chung'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {dialogType === 'send-to-user' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    type="number"
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    required
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nội dung"
                                multiline
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Loại thông báo</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <MenuItem value="info">Thông tin</MenuItem>
                                    <MenuItem value="warning">Cảnh báo</MenuItem>
                                    <MenuItem value="error">Lỗi</MenuItem>
                                    <MenuItem value="success">Thành công</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Độ ưu tiên</InputLabel>
                                <Select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <MenuItem value="low">Thấp</MenuItem>
                                    <MenuItem value="normal">Bình thường</MenuItem>
                                    <MenuItem value="high">Cao</MenuItem>
                                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleSendNotification} variant="contained">
                        {dialogType === 'send-to-user' ? 'Gửi' : 'Tạo'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NotificationManagement;