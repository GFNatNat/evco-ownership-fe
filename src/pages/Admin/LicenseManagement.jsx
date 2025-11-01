import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip, IconButton, Snackbar, Alert, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import {
    Visibility, Check, Close, Search, FilterList,
    CloudDownload, Description, VerifiedUser
} from '@mui/icons-material';
import adminApi from '../../api/admin';

export default function LicenseManagement() {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [verificationForm, setVerificationForm] = useState({
        status: '',
        notes: ''
    });
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadLicenses();
    }, [filters]);

    const loadLicenses = async () => {
        setLoading(true);
        try {
            const params = {
                pageIndex: 1,
                pageSize: 100
            };
            if (filters.status !== 'all') {
                params.status = filters.status;
            }
            if (filters.search) {
                params.search = filters.search;
            }

            const response = await adminApi.licenses.getAll(params).catch(() => ({ data: { items: [] } }));
            setLicenses(response.data?.items || []);
            console.log('✅ Loaded licenses:', response.data?.items?.length || 0);
        } catch (err) {
            console.error('❌ Failed to load licenses:', err);
            setLicenses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewLicense = async (licenseId) => {
        try {
            const response = await adminApi.licenses.getById(licenseId).catch(() => ({ data: null }));
            if (response.data) {
                setSelectedLicense(response.data);
                setVerificationForm({
                    status: response.data.status || 'pending',
                    notes: ''
                });
                setDialogOpen(true);
                console.log('✅ Loaded license details:', licenseId);
            } else {
                console.warn('⚠️ No license data found for:', licenseId);
            }
        } catch (err) {
            console.error('❌ Failed to load license details:', err);
        }
    };

    const handleVerifyLicense = async () => {
        if (!selectedLicense) return;

        try {
            if (verificationForm.status === 'approved') {
                await adminApi.licenses.approve(selectedLicense.id, verificationForm.notes);
                setMessage('Phê duyệt giấy phép thành công');
            } else if (verificationForm.status === 'rejected') {
                await adminApi.licenses.reject(selectedLicense.id, verificationForm.notes);
                setMessage('Từ chối giấy phép thành công');
            }

            setDialogOpen(false);
            loadLicenses();
            console.log('✅ License verification completed:', selectedLicense.id);
        } catch (err) {
            console.error('❌ Failed to verify license:', err);
            setError('Không thể xác minh giấy phép');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'verified': return 'Đã xác minh';
            case 'rejected': return 'Bị từ chối';
            case 'pending': return 'Chờ xác minh';
            default: return 'Không xác định';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Quản lý Giấy phép Lái xe
            </Typography>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo số giấy phép..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                InputProps={{
                                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Trạng thái"
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value="pending">Chờ xác minh</MenuItem>
                                    <MenuItem value="verified">Đã xác minh</MenuItem>
                                    <MenuItem value="rejected">Bị từ chối</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<FilterList />}
                                onClick={loadLicenses}
                            >
                                Lọc
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Licenses Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Số GPLX</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Ngày cấp</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày tải lên</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {licenses.map((license) => (
                            <TableRow key={license.id}>
                                <TableCell>{license.licenseNumber}</TableCell>
                                <TableCell>{license.firstName} {license.lastName}</TableCell>
                                <TableCell>
                                    {license.issueDate ? new Date(license.issueDate).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(license.status)}
                                        color={getStatusColor(license.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(license.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewLicense(license.id)}
                                        color="primary"
                                    >
                                        <Visibility />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Verification Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Chi tiết Giấy phép Lái xe
                </DialogTitle>
                <DialogContent>
                    {selectedLicense && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Số GPLX"
                                        value={selectedLicense.licenseNumber}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Ngày cấp"
                                        value={selectedLicense.issueDate ? new Date(selectedLicense.issueDate).toLocaleDateString() : ''}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Tên"
                                        value={selectedLicense.firstName}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Họ"
                                        value={selectedLicense.lastName}
                                        fullWidth
                                        disabled
                                    />
                                </Grid>

                                {/* License Image Display */}
                                {selectedLicense.imageUrl && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Ảnh giấy phép:
                                        </Typography>
                                        <img
                                            src={selectedLicense.imageUrl}
                                            alt="License"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                border: '1px solid #ddd',
                                                borderRadius: 4
                                            }}
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Trạng thái xác minh</InputLabel>
                                        <Select
                                            value={verificationForm.status}
                                            label="Trạng thái xác minh"
                                            onChange={(e) => setVerificationForm(prev => ({
                                                ...prev,
                                                status: e.target.value
                                            }))}
                                        >
                                            <MenuItem value="pending">Chờ xác minh</MenuItem>
                                            <MenuItem value="verified">Xác minh thành công</MenuItem>
                                            <MenuItem value="rejected">Từ chối</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Ghi chú"
                                        value={verificationForm.notes}
                                        onChange={(e) => setVerificationForm(prev => ({
                                            ...prev,
                                            notes: e.target.value
                                        }))}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        placeholder="Nhập ghi chú xác minh..."
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleVerifyLicense}
                        variant="contained"
                        startIcon={<VerifiedUser />}
                        disabled={!verificationForm.status}
                    >
                        Xác minh
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notifications */}
            <Snackbar
                open={!!message}
                autoHideDuration={6000}
                onClose={() => setMessage('')}
            >
                <Alert severity="success" onClose={() => setMessage('')}>
                    {message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
            >
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}