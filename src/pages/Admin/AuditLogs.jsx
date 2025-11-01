import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, MenuItem, Chip, TextField,
    Pagination, InputAdornment
} from '@mui/material';
import {
    History as HistoryIcon, Search as SearchIcon,
    Person as PersonIcon, Event as EventIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import adminApi from '../../api/admin';

const AuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 1, // Fixed: pageIndex instead of page
        pageSize: 20, // Fixed: pageSize instead of limit
        total: 0,
        totalPages: 1
    });
    const [filters, setFilters] = useState({
        searchTerm: '',
        action: '',
        startDate: null,
        endDate: null,
        userId: ''
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        loadData();
    }, [pagination.pageIndex, filters]); // Fixed: pageIndex instead of page

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                pageIndex: pagination.pageIndex, // Fixed: pageIndex instead of page
                pageSize: pagination.pageSize,   // Fixed: pageSize instead of limit
                ...filters,
                startDate: filters.startDate ? filters.startDate.toISOString() : undefined,
                endDate: filters.endDate ? filters.endDate.toISOString() : undefined
            };

            const response = await adminApi.auditLogs.getAll(params);
            setAuditLogs(response.data?.auditLogs || []);
            setPagination(prev => ({
                ...prev,
                total: response.data?.total || 0,
                totalPages: Math.ceil((response.data?.total || 0) / prev.pageSize) // Fixed: pageSize
            }));
        } catch (error) {
            showAlert('Lỗi tải audit logs: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, pageIndex: 1 })); // Fixed: pageIndex instead of page
    };

    const getActionColor = (action) => {
        switch (action?.toLowerCase()) {
            case 'create': return 'success';
            case 'update': return 'info';
            case 'delete': return 'error';
            case 'login': return 'primary';
            case 'logout': return 'default';
            default: return 'default';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Audit Logs
                </Typography>

                {alert.open && (
                    <Alert severity={alert.severity} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Filters */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Bộ lọc</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Tìm kiếm"
                                            value={filters.searchTerm}
                                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth>
                                            <InputLabel>Hành động</InputLabel>
                                            <Select
                                                value={filters.action}
                                                onChange={(e) => handleFilterChange('action', e.target.value)}
                                            >
                                                <MenuItem value="">Tất cả</MenuItem>
                                                <MenuItem value="create">Tạo mới</MenuItem>
                                                <MenuItem value="update">Cập nhật</MenuItem>
                                                <MenuItem value="delete">Xóa</MenuItem>
                                                <MenuItem value="login">Đăng nhập</MenuItem>
                                                <MenuItem value="logout">Đăng xuất</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <DatePicker
                                            label="Từ ngày"
                                            value={filters.startDate}
                                            onChange={(newValue) => handleFilterChange('startDate', newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <DatePicker
                                            label="Đến ngày"
                                            value={filters.endDate}
                                            onChange={(newValue) => handleFilterChange('endDate', newValue)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Audit Logs Table */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Thời gian</TableCell>
                                                <TableCell>Người dùng</TableCell>
                                                <TableCell>Hành động</TableCell>
                                                <TableCell>Đối tượng</TableCell>
                                                <TableCell>Chi tiết</TableCell>
                                                <TableCell>IP Address</TableCell>
                                                <TableCell>Mức độ</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {auditLogs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell>
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                                                            {log.userName || log.userId}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={log.action}
                                                            color={getActionColor(log.action)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{log.entityType}</TableCell>
                                                    <TableCell sx={{ maxWidth: 200 }}>
                                                        <Typography variant="body2" noWrap>
                                                            {log.details || log.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{log.ipAddress}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={log.severity || 'Low'}
                                                            color={getSeverityColor(log.severity)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Pagination
                                        count={pagination.totalPages}
                                        page={pagination.page}
                                        onChange={(e, newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
                                        color="primary"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};

export default AuditLogs;