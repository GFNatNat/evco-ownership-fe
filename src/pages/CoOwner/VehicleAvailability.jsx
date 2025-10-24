import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Alert, Snackbar, FormControl, InputLabel, Select, MenuItem,
    Stack, IconButton, Tooltip
} from '@mui/material';
import {
    CalendarToday, AccessTime, Search, Visibility,
    Schedule, Analytics, DirectionsCar, CheckCircle
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vehicleApi from '../../api/vehicleApi';
import { format, addDays, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function VehicleAvailability() {
    const [myVehicles, setMyVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Search criteria
    const [searchCriteria, setSearchCriteria] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        minimumDurationHours: 1
    });

    // Dialog states
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);

    useEffect(() => {
        loadMyVehicles();
    }, []);

    const loadMyVehicles = async () => {
        setLoading(true);
        try {
            const response = await vehicleApi.getMyVehicles();
            setMyVehicles(response.data || []);
            if (response.data?.length > 0) {
                setSelectedVehicle(response.data[0]);
            }
        } catch (err) {
            setError('Không thể tải danh sách xe của bạn');
        } finally {
            setLoading(false);
        }
    };

    const loadVehicleSchedule = async (vehicleId) => {
        if (!vehicleId) return;

        setLoading(true);
        try {
            const response = await vehicleApi.getAvailabilitySchedule(vehicleId, {
                startDate: format(searchCriteria.startDate, 'yyyy-MM-dd'),
                endDate: format(searchCriteria.endDate, 'yyyy-MM-dd')
            });
            setScheduleData(response.data);
            setScheduleDialogOpen(true);
        } catch (err) {
            setError('Không thể tải lịch trình xe');
        } finally {
            setLoading(false);
        }
    };

    const findAvailableSlots = async (vehicleId) => {
        if (!vehicleId) return;

        setLoading(true);
        try {
            const response = await vehicleApi.findAvailableSlots(vehicleId, {
                startDate: format(searchCriteria.startDate, 'yyyy-MM-dd'),
                endDate: format(searchCriteria.endDate, 'yyyy-MM-dd'),
                minimumDurationHours: searchCriteria.minimumDurationHours
            });
            setAvailableSlots(response.data?.availableSlots || []);
            setSlotsDialogOpen(true);
        } catch (err) {
            setError('Không thể tìm slot khả dụng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const formatDuration = (hours) => {
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return remainingHours > 0 ? `${days} ngày ${remainingHours}h` : `${days} ngày`;
        }
        return `${hours}h`;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday />
                    Quản lý Lịch trình Xe
                </Typography>

                {/* Vehicle Selection */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Chọn xe</Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Xe của tôi</InputLabel>
                                    <Select
                                        value={selectedVehicle?.vehicleId || ''}
                                        label="Xe của tôi"
                                        onChange={(e) => {
                                            const vehicle = myVehicles.find(v => v.vehicleId === e.target.value);
                                            setSelectedVehicle(vehicle);
                                        }}
                                    >
                                        {myVehicles.map((vehicle) => (
                                            <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                                <Box>
                                                    <Typography variant="body2">
                                                        {vehicle.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {vehicle.licensePlate} • Sở hữu: {vehicle.myOwnershipPercentage}%
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {selectedVehicle && (
                                <Grid item xs={12} md={8}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <DirectionsCar color="primary" />
                                                <Box>
                                                    <Typography variant="subtitle1">
                                                        {selectedVehicle.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Biển số: {selectedVehicle.licensePlate} •
                                                        Trạng thái: <Chip
                                                            label={selectedVehicle.status}
                                                            color={selectedVehicle.status === 'Available' ? 'success' : 'warning'}
                                                            size="small"
                                                        />
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Đồng sở hữu: {selectedVehicle.totalCoOwners} người •
                                                        Số dư: {selectedVehicle.currentBalance?.toLocaleString()} VND
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Search Criteria */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Tìm kiếm lịch trình</Typography>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="Từ ngày"
                                    value={searchCriteria.startDate}
                                    onChange={(date) => setSearchCriteria(prev => ({ ...prev, startDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="Đến ngày"
                                    value={searchCriteria.endDate}
                                    onChange={(date) => setSearchCriteria(prev => ({ ...prev, endDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    label="Tối thiểu (giờ)"
                                    type="number"
                                    value={searchCriteria.minimumDurationHours}
                                    onChange={(e) => setSearchCriteria(prev => ({
                                        ...prev,
                                        minimumDurationHours: Number(e.target.value)
                                    }))}
                                    inputProps={{ min: 1, max: 24 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Schedule />}
                                        onClick={() => selectedVehicle && loadVehicleSchedule(selectedVehicle.vehicleId)}
                                        disabled={!selectedVehicle || loading}
                                    >
                                        Xem Lịch
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Search />}
                                        onClick={() => selectedVehicle && findAvailableSlots(selectedVehicle.vehicleId)}
                                        disabled={!selectedVehicle || loading}
                                    >
                                        Tìm Slot Trống
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                {selectedVehicle && (
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Tỷ lệ sở hữu của tôi
                                    </Typography>
                                    <Typography variant="h4">
                                        {selectedVehicle.myOwnershipPercentage}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Đồng sở hữu
                                    </Typography>
                                    <Typography variant="h4">
                                        {selectedVehicle.totalCoOwners}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Hoạt động gần nhất
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedVehicle.lastActivityAt
                                            ? format(parseISO(selectedVehicle.lastActivityAt), 'dd/MM/yyyy', { locale: vi })
                                            : 'Chưa có'
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Số dư quỹ
                                    </Typography>
                                    <Typography variant="h6" color={selectedVehicle.currentBalance > 0 ? 'success.main' : 'error.main'}>
                                        {selectedVehicle.currentBalance?.toLocaleString()} VND
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Schedule Dialog */}
                <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="lg" fullWidth>
                    <DialogTitle>
                        Lịch trình sử dụng xe - {scheduleData?.vehicle?.name}
                    </DialogTitle>
                    <DialogContent>
                        {scheduleData && (
                            <Box>
                                {/* Period Info */}
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <Typography>
                                        <strong>Thời gian:</strong> {format(parseISO(scheduleData.period.startDate), 'dd/MM/yyyy')} - {format(parseISO(scheduleData.period.endDate), 'dd/MM/yyyy')}
                                        ({scheduleData.period.totalDays} ngày)
                                    </Typography>
                                </Alert>

                                {/* Utilization Stats */}
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Thống kê sử dụng</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <Typography color="text.secondary">Tổng giờ</Typography>
                                                <Typography variant="h6">{scheduleData.utilization.totalHoursInPeriod}h</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography color="text.secondary">Đã đặt</Typography>
                                                <Typography variant="h6">{scheduleData.utilization.bookedHours}h</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography color="text.secondary">Tỷ lệ sử dụng</Typography>
                                                <Typography variant="h6" color="primary">{scheduleData.utilization.utilizationPercentage.toFixed(1)}%</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography color="text.secondary">Số lần đặt</Typography>
                                                <Typography variant="h6">{scheduleData.utilization.totalBookings}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Booked Slots */}
                                <Typography variant="h6" gutterBottom>Lịch đã đặt</Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Người đặt</TableCell>
                                                <TableCell>Thời gian bắt đầu</TableCell>
                                                <TableCell>Thời gian kết thúc</TableCell>
                                                <TableCell>Thời lượng</TableCell>
                                                <TableCell>Mục đích</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {scheduleData.bookedSlots.map((slot) => (
                                                <TableRow key={slot.bookingId}>
                                                    <TableCell>{slot.coOwnerName}</TableCell>
                                                    <TableCell>
                                                        {format(parseISO(slot.startTime), 'dd/MM/yyyy HH:mm')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(parseISO(slot.endTime), 'dd/MM/yyyy HH:mm')}
                                                    </TableCell>
                                                    <TableCell>{formatDuration(slot.duration)}</TableCell>
                                                    <TableCell>{slot.purpose}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={slot.status}
                                                            color={getStatusColor(slot.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Available Days */}
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom>Ngày có sẵn</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {scheduleData.availableDays.map((date) => (
                                            <Chip
                                                key={date}
                                                label={format(parseISO(date), 'dd/MM', { locale: vi })}
                                                color="success"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setScheduleDialogOpen(false)}>Đóng</Button>
                    </DialogActions>
                </Dialog>

                {/* Available Slots Dialog */}
                <Dialog open={slotsDialogOpen} onClose={() => setSlotsDialogOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        Khung thời gian khả dụng
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mb: 2 }}>
                            <Alert severity="info">
                                Tìm thấy {availableSlots.length} khung thời gian phù hợp với yêu cầu tối thiểu {searchCriteria.minimumDurationHours} giờ
                            </Alert>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Thời gian bắt đầu</TableCell>
                                        <TableCell>Thời gian kết thúc</TableCell>
                                        <TableCell>Thời lượng</TableCell>
                                        <TableCell>Loại</TableCell>
                                        <TableCell>Gợi ý</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {availableSlots.map((slot, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {format(parseISO(slot.startTime), 'dd/MM/yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell>
                                                {format(parseISO(slot.endTime), 'dd/MM/yyyy HH:mm')}
                                            </TableCell>
                                            <TableCell>{formatDuration(slot.durationHours)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={slot.isFullDay ? 'Cả ngày' : 'Một phần'}
                                                    color={slot.isFullDay ? 'success' : 'primary'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{slot.recommendation}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSlotsDialogOpen(false)}>Đóng</Button>
                    </DialogActions>
                </Dialog>

                {/* Notifications */}
                <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage('')}>
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