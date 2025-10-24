import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Badge,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import {
    Gavel,
    Add,
    Visibility,
    Reply,
    Warning,
    CheckCircle,
    Cancel,
    History,
    ExpandMore,
    AttachFile,
    Send,
    MonetizationOn,
    Group,
    HowToVote
} from '@mui/icons-material';
import disputeApi from '../../api/disputeApi';
import vehicleApi from '../../api/vehicleApi';
import bookingApi from '../../api/bookingApi';
import userApi from '../../api/userApi';

const DisputeManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [disputes, setDisputes] = useState([]);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Create dispute form
    const [createDisputeForm, setCreateDisputeForm] = useState({
        disputeType: 'booking', // booking, cost-sharing, group-decision
        vehicleId: '',
        bookingId: '',
        maintenanceCostId: '',
        vehicleUpgradeProposalId: '',
        title: '',
        description: '',
        priority: 'Medium',
        category: '',
        respondentUserIds: [],
        evidenceUrls: [],
        requestedResolution: '',
        disputedAmount: '',
        expectedAmount: '',
        violatedPolicy: ''
    });

    // Response form
    const [responseForm, setResponseForm] = useState({
        message: '',
        evidenceUrls: [],
        agreesWithDispute: false,
        proposedSolution: ''
    });

    // Filters
    const [filters, setFilters] = useState({
        disputeType: '',
        status: '',
        priority: '',
        vehicleId: '',
        isInitiator: false,
        isRespondent: false
    });

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Dialogs
    const [createDisputeDialogOpen, setCreateDisputeDialogOpen] = useState(false);
    const [disputeDetailsDialogOpen, setDisputeDetailsDialogOpen] = useState(false);
    const [respondDialogOpen, setRespondDialogOpen] = useState(false);
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState('');

    useEffect(() => {
        loadInitialData();
        loadDisputes();
    }, []);

    useEffect(() => {
        loadDisputes();
    }, [tabValue, filters, page, rowsPerPage]);

    const loadInitialData = async () => {
        try {
            const [vehiclesResponse, usersResponse] = await Promise.all([
                vehicleApi.getMyVehicles().catch(() => ({ data: [] })),
                userApi.getCoOwners().catch(() => ({ data: [] }))
            ]);

            setVehicles(vehiclesResponse.data || []);
            setUsers(usersResponse.data || []);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    };

    const loadDisputes = async () => {
        try {
            setLoading(true);
            const response = await disputeApi.list({
                ...filters,
                pageNumber: page + 1,
                pageSize: rowsPerPage
            });

            if (response.data?.items) {
                const formattedDisputes = response.data.items.map(dispute =>
                    disputeApi.formatDisputeForDisplay(dispute)
                );
                setDisputes(formattedDisputes);
            }
        } catch (error) {
            console.error('Error loading disputes:', error);
            setError('Không thể tải danh sách tranh chấp');
        } finally {
            setLoading(false);
        }
    };

    const loadBookingsForVehicle = async (vehicleId) => {
        try {
            const response = await bookingApi.getByVehicle(vehicleId);
            setBookings(response.data?.items || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    };

    const handleCreateDisputeFormChange = (field, value) => {
        setCreateDisputeForm(prev => {
            const updated = { ...prev, [field]: value };

            // Load bookings when vehicle changes
            if (field === 'vehicleId' && value) {
                loadBookingsForVehicle(value);
            }

            // Clear dependent fields when dispute type changes
            if (field === 'disputeType') {
                updated.category = '';
                updated.bookingId = '';
                updated.maintenanceCostId = '';
                updated.vehicleUpgradeProposalId = '';
            }

            return updated;
        });
    };

    const createDispute = async () => {
        try {
            // Validate dispute data
            const validation = disputeApi.validateDisputeData(createDisputeForm, createDisputeForm.disputeType);
            if (!validation.isValid) {
                setError(validation.errors.join(', '));
                return;
            }

            setLoading(true);
            setError('');

            let response;
            if (createDisputeForm.disputeType === 'booking') {
                response = await disputeApi.raiseBookingDispute(createDisputeForm);
            } else if (createDisputeForm.disputeType === 'cost-sharing') {
                response = await disputeApi.raiseCostSharingDispute({
                    ...createDisputeForm,
                    disputedAmount: parseFloat(createDisputeForm.disputedAmount),
                    expectedAmount: parseFloat(createDisputeForm.expectedAmount)
                });
            } else if (createDisputeForm.disputeType === 'group-decision') {
                response = await disputeApi.raiseGroupDecisionDispute(createDisputeForm);
            }

            setSuccess('Tranh chấp đã được tạo thành công');
            setCreateDisputeDialogOpen(false);
            resetCreateDisputeForm();
            loadDisputes();
        } catch (error) {
            console.error('Error creating dispute:', error);
            setError(error.response?.data?.message || 'Không thể tạo tranh chấp');
        } finally {
            setLoading(false);
        }
    };

    const viewDisputeDetails = async (disputeId) => {
        try {
            setLoading(true);
            const response = await disputeApi.getById(disputeId);

            setSelectedDispute(disputeApi.formatDisputeForDisplay(response.data));
            setDisputeDetailsDialogOpen(true);
        } catch (error) {
            console.error('Error loading dispute details:', error);
            setError('Không thể tải chi tiết tranh chấp');
        } finally {
            setLoading(false);
        }
    };

    const respondToDispute = async (disputeId) => {
        try {
            if (!responseForm.message.trim()) {
                setError('Vui lòng nhập nội dung phản hồi');
                return;
            }

            setLoading(true);
            setError('');

            await disputeApi.respond(disputeId, responseForm);

            setSuccess('Phản hồi đã được gửi thành công');
            setRespondDialogOpen(false);
            resetResponseForm();
            loadDisputes();

            if (selectedDispute) {
                viewDisputeDetails(selectedDispute.id);
            }
        } catch (error) {
            console.error('Error responding to dispute:', error);
            setError(error.response?.data?.message || 'Không thể gửi phản hồi');
        } finally {
            setLoading(false);
        }
    };

    const withdrawDispute = async (disputeId) => {
        try {
            if (!withdrawReason.trim()) {
                setError('Vui lòng nhập lý do rút lại tranh chấp');
                return;
            }

            setLoading(true);
            setError('');

            await disputeApi.withdraw(disputeId, { reason: withdrawReason });

            setSuccess('Tranh chấp đã được rút lại');
            setWithdrawDialogOpen(false);
            setWithdrawReason('');
            loadDisputes();
            setDisputeDetailsDialogOpen(false);
        } catch (error) {
            console.error('Error withdrawing dispute:', error);
            setError(error.response?.data?.message || 'Không thể rút lại tranh chấp');
        } finally {
            setLoading(false);
        }
    };

    const resetCreateDisputeForm = () => {
        setCreateDisputeForm({
            disputeType: 'booking',
            vehicleId: '',
            bookingId: '',
            maintenanceCostId: '',
            vehicleUpgradeProposalId: '',
            title: '',
            description: '',
            priority: 'Medium',
            category: '',
            respondentUserIds: [],
            evidenceUrls: [],
            requestedResolution: '',
            disputedAmount: '',
            expectedAmount: '',
            violatedPolicy: ''
        });
    };

    const resetResponseForm = () => {
        setResponseForm({
            message: '',
            evidenceUrls: [],
            agreesWithDispute: false,
            proposedSolution: ''
        });
    };

    const getDisputeTypeIcon = (type) => {
        const icons = {
            'Booking': <History />,
            'CostSharing': <MonetizationOn />,
            'GroupDecision': <HowToVote />
        };
        return icons[type] || <Gavel />;
    };

    const TabPanel = ({ children, value, index, ...other }) => (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    <Gavel sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Quản lý Tranh chấp
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab label="Tất cả tranh chấp" />
                        <Tab
                            label={
                                <Badge badgeContent={disputes.filter(d => d.canRespond).length} color="error">
                                    Cần phản hồi
                                </Badge>
                            }
                        />
                        <Tab label="Tôi tạo" />
                    </Tabs>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setCreateDisputeDialogOpen(true)}
                    >
                        Tạo tranh chấp
                    </Button>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {/* Filters */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Loại tranh chấp</InputLabel>
                                    <Select
                                        value={filters.disputeType}
                                        onChange={(e) => setFilters(prev => ({ ...prev, disputeType: e.target.value }))}
                                        label="Loại tranh chấp"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="Booking">Đặt xe</MenuItem>
                                        <MenuItem value="CostSharing">Chia sẻ chi phí</MenuItem>
                                        <MenuItem value="GroupDecision">Quyết định nhóm</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="Open">Mở</MenuItem>
                                        <MenuItem value="UnderReview">Đang xem xét</MenuItem>
                                        <MenuItem value="Resolved">Đã giải quyết</MenuItem>
                                        <MenuItem value="Rejected">Bị từ chối</MenuItem>
                                        <MenuItem value="Withdrawn">Đã rút lại</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Mức độ ưu tiên</InputLabel>
                                    <Select
                                        value={filters.priority}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                        label="Mức độ ưu tiên"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="Low">Thấp</MenuItem>
                                        <MenuItem value="Medium">Trung bình</MenuItem>
                                        <MenuItem value="High">Cao</MenuItem>
                                        <MenuItem value="Critical">Khẩn cấp</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Xe</InputLabel>
                                    <Select
                                        value={filters.vehicleId}
                                        onChange={(e) => setFilters(prev => ({ ...prev, vehicleId: e.target.value }))}
                                        label="Xe"
                                    >
                                        <MenuItem value="">Tất cả xe</MenuItem>
                                        {vehicles.map(vehicle => (
                                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Disputes Table */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiêu đề</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Mức độ</TableCell>
                                    <TableCell>Xe</TableCell>
                                    <TableCell>Người tạo</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : disputes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                Không có tranh chấp nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    disputes.map((dispute) => (
                                        <TableRow key={dispute.id}>
                                            <TableCell>
                                                <Typography variant="subtitle2">
                                                    {dispute.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {dispute.categoryName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {getDisputeTypeIcon(dispute.disputeType)}
                                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                                        {dispute.disputeTypeName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={dispute.statusName}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={dispute.priorityConfig.name}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: dispute.priorityConfig.bgColor,
                                                        color: dispute.priorityConfig.color
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{dispute.vehicleName}</TableCell>
                                            <TableCell>{dispute.initiatorName}</TableCell>
                                            <TableCell>{dispute.formattedCreatedAt}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => viewDisputeDetails(dispute.id)}
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {dispute.canRespond && (
                                                        <Tooltip title="Phản hồi">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => {
                                                                    setSelectedDispute(dispute);
                                                                    setRespondDialogOpen(true);
                                                                }}
                                                            >
                                                                <Reply />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {dispute.canWithdraw && (
                                                        <Tooltip title="Rút lại">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => {
                                                                    setSelectedDispute(dispute);
                                                                    setWithdrawDialogOpen(true);
                                                                }}
                                                            >
                                                                <Cancel />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={disputes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(parseInt(event.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </TableContainer>
                </TabPanel>

                {/* Similar TabPanels for other tabs... */}
            </Paper>

            {/* Create Dispute Dialog */}
            <Dialog
                open={createDisputeDialogOpen}
                onClose={() => setCreateDisputeDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Tạo tranh chấp mới</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Loại tranh chấp</InputLabel>
                                <Select
                                    value={createDisputeForm.disputeType}
                                    onChange={(e) => handleCreateDisputeFormChange('disputeType', e.target.value)}
                                    label="Loại tranh chấp"
                                >
                                    <MenuItem value="booking">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <History sx={{ mr: 1 }} />
                                            Tranh chấp đặt xe
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="cost-sharing">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <MonetizationOn sx={{ mr: 1 }} />
                                            Tranh chấp chia sẻ chi phí
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="group-decision">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <HowToVote sx={{ mr: 1 }} />
                                            Tranh chấp quyết định nhóm
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Xe</InputLabel>
                                <Select
                                    value={createDisputeForm.vehicleId}
                                    onChange={(e) => handleCreateDisputeFormChange('vehicleId', e.target.value)}
                                    label="Xe"
                                >
                                    {vehicles.map(vehicle => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {createDisputeForm.disputeType === 'booking' && (
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Đặt xe</InputLabel>
                                    <Select
                                        value={createDisputeForm.bookingId}
                                        onChange={(e) => handleCreateDisputeFormChange('bookingId', e.target.value)}
                                        label="Đặt xe"
                                        disabled={!createDisputeForm.vehicleId}
                                    >
                                        {bookings.map(booking => (
                                            <MenuItem key={booking.id} value={booking.id}>
                                                {new Date(booking.startTime).toLocaleDateString('vi-VN')} - {booking.purpose}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {createDisputeForm.disputeType === 'cost-sharing' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Số tiền tranh chấp (VNĐ)"
                                        value={createDisputeForm.disputedAmount}
                                        onChange={(e) => handleCreateDisputeFormChange('disputedAmount', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Số tiền mong muốn (VNĐ)"
                                        value={createDisputeForm.expectedAmount}
                                        onChange={(e) => handleCreateDisputeFormChange('expectedAmount', e.target.value)}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Mức độ ưu tiên</InputLabel>
                                <Select
                                    value={createDisputeForm.priority}
                                    onChange={(e) => handleCreateDisputeFormChange('priority', e.target.value)}
                                    label="Mức độ ưu tiên"
                                >
                                    {disputeApi.getDisputePriorities().map(priority => (
                                        <MenuItem key={priority.value} value={priority.value}>
                                            <Chip
                                                label={priority.label}
                                                size="small"
                                                sx={{ bgcolor: priority.color, color: 'white' }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Danh mục</InputLabel>
                                <Select
                                    value={createDisputeForm.category}
                                    onChange={(e) => handleCreateDisputeFormChange('category', e.target.value)}
                                    label="Danh mục"
                                >
                                    {disputeApi.getDisputeCategories(createDisputeForm.disputeType).map(category => (
                                        <MenuItem key={category.value} value={category.value}>
                                            {category.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                value={createDisputeForm.title}
                                onChange={(e) => handleCreateDisputeFormChange('title', e.target.value)}
                                placeholder="Tóm tắt ngắn gọn về tranh chấp..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Mô tả chi tiết"
                                value={createDisputeForm.description}
                                onChange={(e) => handleCreateDisputeFormChange('description', e.target.value)}
                                placeholder="Mô tả chi tiết về tình huống và vấn đề..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Người liên quan</InputLabel>
                                <Select
                                    multiple
                                    value={createDisputeForm.respondentUserIds}
                                    onChange={(e) => handleCreateDisputeFormChange('respondentUserIds', e.target.value)}
                                    label="Người liên quan"
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const user = users.find(u => u.id === value);
                                                return (
                                                    <Chip key={value} label={user?.name || value} size="small" />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {users.map(user => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Giải pháp mong muốn"
                                value={createDisputeForm.requestedResolution}
                                onChange={(e) => handleCreateDisputeFormChange('requestedResolution', e.target.value)}
                                placeholder="Mô tả giải pháp bạn mong muốn để giải quyết tranh chấp..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDisputeDialogOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={createDispute}
                        variant="contained"
                        disabled={loading || !createDisputeForm.title || !createDisputeForm.description}
                        startIcon={loading ? <CircularProgress size={16} /> : <Add />}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo tranh chấp'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Other dialogs for dispute details, respond, withdraw... */}
        </Container>
    );
};

export default DisputeManagement;