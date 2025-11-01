import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider
} from '@mui/material';
import {
    Event as BookingIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import coOwnerApi from '../../api/coowner';

const BookingManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [slotRequests, setSlotRequests] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '',
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2 hours
        purpose: '',
        pickupLocationId: '',
        dropoffLocationId: '',
        additionalNotes: ''
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const results = await Promise.allSettled([
                coOwnerApi.bookings.getMy().catch(() => ({ data: { bookings: [] } })),
                coOwnerApi.vehicles.getMyVehicles().catch(() => ({ data: [] })),
                coOwnerApi.bookings.getPendingConflicts().catch(() => ({ data: { conflicts: [] } })),
                coOwnerApi.bookings.getSlotRequests().catch(() => ({ data: { requests: [] } }))
            ]);

            const [bookingsRes, vehiclesRes, conflictsRes, slotsRes] = results.map(r =>
                r.status === 'fulfilled' ? r.value : { data: null }
            );

            // Always set bookings as an array
            let safeBookings = bookingsRes.data?.bookings || bookingsRes.data;
            if (!Array.isArray(safeBookings)) safeBookings = safeBookings ? [safeBookings] : [];
            setBookings(safeBookings);
            // Always set vehicles as an array
            let safeVehicles = vehiclesRes.data;
            if (!Array.isArray(safeVehicles)) safeVehicles = safeVehicles ? [safeVehicles] : [];
            setVehicles(safeVehicles);
            // Always set conflicts as an array
            let safeConflicts = conflictsRes.data?.conflicts || conflictsRes.data;
            if (!Array.isArray(safeConflicts)) safeConflicts = safeConflicts ? [safeConflicts] : [];
            setConflicts(safeConflicts);
            setSlotRequests(slotsRes.data?.requests || slotsRes.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            showAlert('Một số dữ liệu không tải được. Vui lòng thử lại.', 'warning');
        }
        setLoading(false);
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleCreateBooking = async () => {
        try {
            await coOwnerApi.bookings.create(formData);
            showAlert('Tạo booking thành công!', 'success');
            setOpenDialog(false);
            loadData();
        } catch (error) {
            showAlert('Lỗi tạo booking: ' + error.message, 'error');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await coOwnerApi.bookings.cancel(bookingId, 'Cancelled by user');
            showAlert('Hủy booking thành công!', 'success');
            loadData();
        } catch (error) {
            showAlert('Lỗi hủy booking: ' + error.message, 'error');
        }
    };

    const handleResolveConflict = async (conflictId, resolution) => {
        try {
            await coOwnerApi.bookings.resolveConflict(conflictId, resolution);
            showAlert('Giải quyết xung đột thành công!', 'success');
            loadData();
        } catch (error) {
            showAlert('Lỗi giải quyết xung đột: ' + error.message, 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'completed': return 'info';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'Đang hoạt động';
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xử lý';
            case 'cancelled': return 'Đã hủy';
            case 'completed': return 'Hoàn thành';
            default: return status || 'Không xác định';
        }
    };

    const renderBookingCard = (booking) => (
        <Card key={booking.bookingId} sx={{ mb: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                            <BookingIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                            {(Array.isArray(vehicles) ? vehicles : []).find(v => v.id === booking.vehicleId)?.name || 'Xe không xác định'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <TimeIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {new Date(booking.startTime).toLocaleString('vi-VN')} - {new Date(booking.endTime).toLocaleString('vi-VN')}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            {booking.purpose || 'Không có mục đích'}
                        </Typography>
                        {booking.notes && (
                            <Typography variant="body2" color="text.secondary">
                                Ghi chú: {booking.notes}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Chip
                                label={getStatusLabel(booking.status)}
                                color={getStatusColor(booking.status)}
                                size="small"
                                sx={{ mb: 1 }}
                            />
                            {booking.priority > 1 && (
                                <Chip
                                    label={`Ưu tiên ${booking.priority}`}
                                    color="secondary"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button size="small" startIcon={<EditIcon />}>
                    Chỉnh sửa
                </Button>
                {booking.status?.toLowerCase() !== 'cancelled' && (
                    <Button
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelBooking(booking.bookingId)}
                    >
                        Hủy
                    </Button>
                )}
            </CardActions>
        </Card>
    );

    const renderConflictItem = (conflict) => (
        <ListItem key={conflict.conflictId}>
            <ListItemText
                primary={`Xung đột: ${conflict.description || 'Không có mô tả'}`}
                secondary={`Thời gian: ${new Date(conflict.conflictTime).toLocaleString('vi-VN')}`}
            />
            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    color="success"
                    onClick={() => handleResolveConflict(conflict.conflictId, { action: 'approve' })}
                >
                    <CheckIcon />
                </IconButton>
                <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleResolveConflict(conflict.conflictId, { action: 'reject' })}
                >
                    <CancelIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );

    const renderSlotRequestItem = (request) => (
        <ListItem key={request.requestId}>
            <ListItemText
                primary={`Yêu cầu slot: ${request.requestedSlot || 'Không xác định'}`}
                secondary={`Trạng thái: ${getStatusLabel(request.status)} - ${new Date(request.requestDate).toLocaleDateString('vi-VN')}`}
            />
        </ListItem>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý Booking
                </Typography>

                {alert.open && (
                    <Alert severity={alert.severity} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{ mr: 2 }}
                    >
                        Tạo Booking
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadData}
                    >
                        Tải lại
                    </Button>
                </Box>

                <Paper sx={{ width: '100%' }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label={`Booking (${bookings.length})`} />
                        <Tab label={`Xung đột (${conflicts.length})`} />
                        <Tab label={`Yêu cầu slot (${slotRequests.length})`} />
                    </Tabs>

                    <Box sx={{ p: 2 }}>
                        {activeTab === 0 && (
                            <Grid container spacing={2}>
                                {bookings.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography variant="body1" color="text.secondary" textAlign="center">
                                            Chưa có booking nào
                                        </Typography>
                                    </Grid>
                                ) : (
                                    bookings.map(booking => (
                                        <Grid item xs={12} md={6} key={booking.bookingId}>
                                            {renderBookingCard(booking)}
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        )}

                        {activeTab === 1 && (
                            <List>
                                {conflicts.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="Không có xung đột nào" />
                                    </ListItem>
                                ) : (
                                    conflicts.map((conflict, index) => (
                                        <React.Fragment key={conflict.conflictId}>
                                            {renderConflictItem(conflict)}
                                            {index < conflicts.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                )}
                            </List>
                        )}

                        {activeTab === 2 && (
                            <List>
                                {slotRequests.length === 0 ? (
                                    <ListItem>
                                        <ListItemText primary="Không có yêu cầu slot nào" />
                                    </ListItem>
                                ) : (
                                    slotRequests.map((request, index) => (
                                        <React.Fragment key={request.requestId}>
                                            {renderSlotRequestItem(request)}
                                            {index < slotRequests.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                )}
                            </List>
                        )}
                    </Box>
                </Paper>

                {/* Create Booking Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Tạo Booking Mới</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Chọn xe</InputLabel>
                                        <Select
                                            value={formData.vehicleId}
                                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                                        >
                                            {vehicles.map(vehicle => (
                                                <MenuItem key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.name || vehicle.licensePlate}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="Thời gian bắt đầu"
                                        value={formData.startTime}
                                        onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="Thời gian kết thúc"
                                        value={formData.endTime}
                                        onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Mục đích sử dụng"
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Điểm đón (Location ID)"
                                        type="number"
                                        value={formData.pickupLocationId}
                                        onChange={(e) => setFormData({ ...formData, pickupLocationId: parseInt(e.target.value) || '' })}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Điểm trả (Location ID)"
                                        type="number"
                                        value={formData.dropoffLocationId}
                                        onChange={(e) => setFormData({ ...formData, dropoffLocationId: parseInt(e.target.value) || '' })}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ghi chú thêm"
                                        value={formData.additionalNotes}
                                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button onClick={handleCreateBooking} variant="contained">
                            Tạo Booking
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default BookingManagement;