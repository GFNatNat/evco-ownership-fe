import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, TextField,
    FormControl, InputLabel, Select, MenuItem, Chip, Alert, Snackbar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Stack, LinearProgress, Tooltip, IconButton
} from '@mui/material';
import {
    Analytics, TrendingUp, DirectionsCar, Timeline,
    Refresh, FileDownload, Visibility, BarChart,
    ShowChart, PieChart
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import vehicleApi from '../../api/vehicleApi';

export default function VehicleAnalytics() {
    const [utilizationData, setUtilizationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Filter criteria
    const [dateRange, setDateRange] = useState({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(new Date())
    });

    const [sortBy, setSortBy] = useState('utilizationPercentage');
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        loadUtilizationData();
    }, []);

    const loadUtilizationData = async () => {
        setLoading(true);
        try {
            const response = await vehicleApi.compareUtilization({
                startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
                endDate: format(dateRange.endDate, 'yyyy-MM-dd')
            });
            setUtilizationData(response.data);
        } catch (err) {
            setError('Không thể tải dữ liệu phân tích');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadUtilizationData();
        setMessage('Đã cập nhật dữ liệu phân tích');
    };

    const getUtilizationColor = (percentage) => {
        if (percentage >= 70) return 'success';
        if (percentage >= 40) return 'warning';
        return 'error';
    };

    const getUtilizationLabel = (percentage) => {
        if (percentage >= 70) return 'Cao';
        if (percentage >= 40) return 'Trung bình';
        return 'Thấp';
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'gold';
        if (rank === 2) return 'silver';
        if (rank === 3) return '#CD7F32';
        return 'text.secondary';
    };

    const sortedVehicles = utilizationData?.vehicles?.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (sortDesc) {
            return bValue > aValue ? 1 : -1;
        } else {
            return aValue > bValue ? 1 : -1;
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics />
                    Phân tích Hiệu suất Sử dụng Xe
                </Typography>

                {/* Filter Controls */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Bộ lọc phân tích</Typography>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="Từ ngày"
                                    value={dateRange.startDate}
                                    onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="Đến ngày"
                                    value={dateRange.endDate}
                                    onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Sắp xếp theo</InputLabel>
                                    <Select
                                        value={sortBy}
                                        label="Sắp xếp theo"
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <MenuItem value="utilizationPercentage">Tỷ lệ sử dụng</MenuItem>
                                        <MenuItem value="totalBookings">Số lần đặt</MenuItem>
                                        <MenuItem value="totalBookedHours">Tổng giờ đặt</MenuItem>
                                        <MenuItem value="averageBookingDuration">Thời gian TB</MenuItem>
                                        <MenuItem value="vehicleName">Tên xe</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Thứ tự</InputLabel>
                                    <Select
                                        value={sortDesc}
                                        label="Thứ tự"
                                        onChange={(e) => setSortDesc(e.target.value)}
                                    >
                                        <MenuItem value={true}>Giảm dần</MenuItem>
                                        <MenuItem value={false}>Tăng dần</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<Refresh />}
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    fullWidth
                                >
                                    Cập nhật
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {loading && <LinearProgress sx={{ mb: 3 }} />}

                {utilizationData && (
                    <>
                        {/* Summary Cards */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Tổng số xe
                                        </Typography>
                                        <Typography variant="h4">
                                            {utilizationData.summary.totalVehicles}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Tỷ lệ sử dụng TB
                                        </Typography>
                                        <Typography variant="h4" color="primary">
                                            {utilizationData.summary.averageUtilization.toFixed(1)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Tổng lần đặt
                                        </Typography>
                                        <Typography variant="h4" color="success.main">
                                            {utilizationData.summary.totalBookings}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            Tổng giờ sử dụng
                                        </Typography>
                                        <Typography variant="h4" color="info.main">
                                            {utilizationData.summary.totalBookedHours.toFixed(0)}h
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Top and Bottom Performers */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="success.main">
                                            <TrendingUp sx={{ mr: 1 }} />
                                            Xe hiệu suất cao nhất
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <DirectionsCar color="success" />
                                            <Box>
                                                <Typography variant="h6">
                                                    {utilizationData.summary.highestUtilization.vehicleName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tỷ lệ sử dụng: {utilizationData.summary.highestUtilization.utilizationPercentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom color="error.main">
                                            <ShowChart sx={{ mr: 1 }} />
                                            Xe hiệu suất thấp nhất
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <DirectionsCar color="error" />
                                            <Box>
                                                <Typography variant="h6">
                                                    {utilizationData.summary.lowestUtilization.vehicleName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tỷ lệ sử dụng: {utilizationData.summary.lowestUtilization.utilizationPercentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Insights */}
                        {utilizationData.insights && utilizationData.insights.length > 0 && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <Timeline sx={{ mr: 1 }} />
                                        Phân tích chuyên sâu
                                    </Typography>
                                    {utilizationData.insights.map((insight, index) => (
                                        <Alert key={index} severity="info" sx={{ mb: 1 }}>
                                            {insight}
                                        </Alert>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Detailed Vehicle Table */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Chi tiết hiệu suất từng xe
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Hạng</TableCell>
                                                <TableCell>Tên xe</TableCell>
                                                <TableCell>Biển số</TableCell>
                                                <TableCell>Tỷ lệ sử dụng</TableCell>
                                                <TableCell>Tổng lần đặt</TableCell>
                                                <TableCell>Tổng giờ đặt</TableCell>
                                                <TableCell>TB mỗi lần</TableCell>
                                                <TableCell>Ngày bận nhất</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedVehicles?.map((vehicle) => (
                                                <TableRow key={vehicle.vehicleId}>
                                                    <TableCell>
                                                        <Typography
                                                            variant="h6"
                                                            color={getRankColor(vehicle.rank)}
                                                            sx={{ fontWeight: 'bold' }}
                                                        >
                                                            #{vehicle.rank}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="subtitle2">
                                                            {vehicle.vehicleName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{vehicle.licensePlate}</TableCell>
                                                    <TableCell>
                                                        <Stack spacing={1}>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={Math.min(vehicle.utilizationPercentage, 100)}
                                                                color={getUtilizationColor(vehicle.utilizationPercentage)}
                                                                sx={{ height: 8, borderRadius: 1 }}
                                                            />
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {vehicle.utilizationPercentage.toFixed(1)}%
                                                                </Typography>
                                                                <Chip
                                                                    label={getUtilizationLabel(vehicle.utilizationPercentage)}
                                                                    color={getUtilizationColor(vehicle.utilizationPercentage)}
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6" color="primary">
                                                            {vehicle.totalBookings}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1">
                                                            {vehicle.totalBookedHours.toFixed(1)}h
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            / {vehicle.totalAvailableHours}h
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {vehicle.averageBookingDuration.toFixed(1)}h
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={vehicle.mostActiveDay}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Notifications */}
                <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
                    <Alert severity="success" onClose={() => setMessage('')}>
                        {message}
                    </Alert>
                </Snackbar>

                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
}