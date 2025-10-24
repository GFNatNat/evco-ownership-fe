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
    LinearProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {
    Assignment,
    Add,
    Visibility,
    Download,
    CheckCircle,
    Cancel,
    Warning,
    Schedule,
    FilterList
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import contractApi from '../../api/contractApi';
import vehicleApi from '../../api/vehicleApi';
import userApi from '../../api/userApi';

const ContractManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [contracts, setContracts] = useState([]);
    const [pendingContracts, setPendingContracts] = useState([]);
    const [signedContracts, setSignedContracts] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Contract creation form
    const [contractForm, setContractForm] = useState({
        vehicleId: '',
        templateType: '',
        title: '',
        description: '',
        signatoryUserIds: [],
        effectiveDate: null,
        expiryDate: null,
        signatureDeadline: null,
        autoActivate: true,
        customTerms: {},
        attachmentUrls: []
    });

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        templateType: '',
        vehicleId: '',
        isCreator: false,
        pendingMySignature: false
    });

    // Selected contract for actions
    const [selectedContract, setSelectedContract] = useState(null);
    const [contractDetails, setContractDetails] = useState(null);

    // Dialogs
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [signDialogOpen, setSignDialogOpen] = useState(false);
    const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
    const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);

    // Sign/Decline form
    const [signForm, setSignForm] = useState({
        signature: '',
        agreementConfirmation: '',
        signerNotes: ''
    });

    const [declineForm, setDeclineForm] = useState({
        reason: '',
        suggestedChanges: ''
    });

    const [terminateForm, setTerminateForm] = useState({
        reason: '',
        effectiveDate: null,
        notes: ''
    });

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadContracts();
    }, [tabValue, filters, page, rowsPerPage]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [templatesResponse, vehiclesResponse, usersResponse] = await Promise.all([
                contractApi.getTemplates(),
                vehicleApi.getMyVehicles(),
                userApi.getCoOwners().catch(() => ({ data: [] }))
            ]);

            setTemplates(templatesResponse.data || []);
            setVehicles(vehiclesResponse.data || []);
            setUsers(usersResponse.data || []);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setError('Không thể tải dữ liệu ban đầu');
        } finally {
            setLoading(false);
        }
    };

    const loadContracts = async () => {
        try {
            setLoading(true);

            if (tabValue === 0) {
                // All contracts
                const response = await contractApi.list({
                    ...filters,
                    pageNumber: page + 1,
                    pageSize: rowsPerPage
                });
                setContracts(response.data?.contracts || []);
            } else if (tabValue === 1) {
                // Pending signature contracts
                const response = await contractApi.getPendingSignature();
                setPendingContracts(response.data || []);
            } else if (tabValue === 2) {
                // Signed contracts
                const response = await contractApi.getSigned({ vehicleId: filters.vehicleId });
                setSignedContracts(response.data || []);
            }
        } catch (error) {
            console.error('Error loading contracts:', error);
            setError('Không thể tải danh sách hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const handleContractFormChange = (field, value) => {
        setContractForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const createContract = async () => {
        try {
            // Validate contract data
            const validation = contractApi.validateContractData(contractForm);
            if (!validation.isValid) {
                setError(validation.errors.join(', '));
                return;
            }

            setLoading(true);
            setError('');

            await contractApi.create(contractForm);

            setSuccess('Hợp đồng đã được tạo thành công');
            resetContractForm();
            loadContracts();
        } catch (error) {
            console.error('Error creating contract:', error);
            setError(error.response?.data?.message || 'Không thể tạo hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const loadContractDetails = async (contractId) => {
        try {
            setLoading(true);
            const response = await contractApi.getById(contractId);
            setContractDetails(response.data);
            setDetailsDialogOpen(true);
        } catch (error) {
            console.error('Error loading contract details:', error);
            setError('Không thể tải chi tiết hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const signContract = async (contractId) => {
        try {
            // Validate signature data
            const validation = contractApi.validateSignatureData(signForm);
            if (!validation.isValid) {
                setError(validation.errors.join(', '));
                return;
            }

            setLoading(true);
            setError('');

            // Generate signature if not provided
            if (!signForm.signature) {
                const signature = contractApi.generateSignatureHash(
                    contractDetails?.contractContent || '',
                    'user-private-key' // This should be actual user's private key
                );
                signForm.signature = signature;
            }

            await contractApi.sign(contractId, {
                ...signForm,
                ipAddress: await getClientIP(),
                deviceInfo: getDeviceInfo(),
                geolocation: await getCurrentPosition()
            });

            setSuccess('Ký hợp đồng thành công!');
            setSignDialogOpen(false);
            resetSignForm();
            loadContracts();
        } catch (error) {
            console.error('Error signing contract:', error);
            setError(error.response?.data?.message || 'Không thể ký hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const declineContract = async (contractId) => {
        try {
            if (!declineForm.reason.trim()) {
                setError('Vui lòng nhập lý do từ chối');
                return;
            }

            setLoading(true);
            setError('');

            await contractApi.decline(contractId, declineForm);

            setSuccess('Đã từ chối hợp đồng');
            setDeclineDialogOpen(false);
            resetDeclineForm();
            loadContracts();
        } catch (error) {
            console.error('Error declining contract:', error);
            setError(error.response?.data?.message || 'Không thể từ chối hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const terminateContract = async (contractId) => {
        try {
            if (!terminateForm.reason.trim()) {
                setError('Vui lòng nhập lý do chấm dứt');
                return;
            }

            setLoading(true);
            setError('');

            await contractApi.terminate(contractId, terminateForm);

            setSuccess('Đã chấm dứt hợp đồng');
            setTerminateDialogOpen(false);
            resetTerminateForm();
            loadContracts();
        } catch (error) {
            console.error('Error terminating contract:', error);
            setError(error.response?.data?.message || 'Không thể chấm dứt hợp đồng');
        } finally {
            setLoading(false);
        }
    };

    const downloadContract = async (contractId, title) => {
        try {
            const response = await contractApi.download(contractId);

            // Create download link
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'contract'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSuccess('Tải hợp đồng thành công');
        } catch (error) {
            console.error('Error downloading contract:', error);
            setError('Không thể tải hợp đồng');
        }
    };

    // Helper functions
    const getClientIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return '0.0.0.0';
        }
    };

    const getDeviceInfo = () => {
        return `${navigator.userAgent}`;
    };

    const getCurrentPosition = () => {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(`${position.coords.latitude},${position.coords.longitude}`);
                    },
                    () => resolve('')
                );
            } else {
                resolve('');
            }
        });
    };

    const resetContractForm = () => {
        setContractForm({
            vehicleId: '',
            templateType: '',
            title: '',
            description: '',
            signatoryUserIds: [],
            effectiveDate: null,
            expiryDate: null,
            signatureDeadline: null,
            autoActivate: true,
            customTerms: {},
            attachmentUrls: []
        });
    };

    const resetSignForm = () => {
        setSignForm({
            signature: '',
            agreementConfirmation: '',
            signerNotes: ''
        });
    };

    const resetDeclineForm = () => {
        setDeclineForm({
            reason: '',
            suggestedChanges: ''
        });
    };

    const resetTerminateForm = () => {
        setTerminateForm({
            reason: '',
            effectiveDate: null,
            notes: ''
        });
    };

    const formatContractForDisplay = (contract) => {
        return contractApi.formatContractForDisplay(contract);
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
                    <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Quản lý Hợp đồng Điện tử
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab label="Tất cả hợp đồng" />
                        <Tab
                            label={
                                <Badge badgeContent={pendingContracts.length} color="warning">
                                    Chờ ký
                                </Badge>
                            }
                        />
                        <Tab label="Đã ký" />
                        <Tab label="Tạo hợp đồng" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {/* Filters */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            <FilterList sx={{ mr: 1 }} /> Bộ lọc
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        label="Trạng thái"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        <MenuItem value="Draft">Bản nháp</MenuItem>
                                        <MenuItem value="PendingSignatures">Chờ ký</MenuItem>
                                        <MenuItem value="FullySigned">Đã ký đầy đủ</MenuItem>
                                        <MenuItem value="Active">Đang hoạt động</MenuItem>
                                        <MenuItem value="Expired">Hết hạn</MenuItem>
                                        <MenuItem value="Terminated">Đã chấm dứt</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Loại hợp đồng</InputLabel>
                                    <Select
                                        value={filters.templateType}
                                        onChange={(e) => setFilters(prev => ({ ...prev, templateType: e.target.value }))}
                                        label="Loại hợp đồng"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                        {templates.map(template => (
                                            <MenuItem key={template.templateType} value={template.templateType}>
                                                {contractApi.getTemplateTypeDisplayName(template.templateType)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={3}>
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

                            <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.isCreator}
                                                onChange={(e) => setFilters(prev => ({ ...prev, isCreator: e.target.checked }))}
                                            />
                                        }
                                        label="Do tôi tạo"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filters.pendingMySignature}
                                                onChange={(e) => setFilters(prev => ({ ...prev, pendingMySignature: e.target.checked }))}
                                            />
                                        }
                                        label="Chờ ký của tôi"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Contracts Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiêu đề</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Xe</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Tiến độ ký</TableCell>
                                    <TableCell>Hạn ký</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contracts
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((contract) => {
                                        const formatted = formatContractForDisplay(contract);
                                        return (
                                            <TableRow key={contract.contractId}>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="subtitle2">
                                                            {formatted.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Tạo bởi: {formatted.creatorName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{formatted.templateDisplayName}</TableCell>
                                                <TableCell>{formatted.vehicleName}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={formatted.status}
                                                        size="small"
                                                        sx={{ bgcolor: formatted.statusColor, color: 'white' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={formatted.signatureProgress}
                                                            sx={{ width: 60, height: 8, borderRadius: 4 }}
                                                        />
                                                        <Typography variant="caption">
                                                            {formatted.completedSignatures}/{formatted.totalSignatories}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {formatted.formattedSignatureDeadline}
                                                    {formatted.isUrgent && (
                                                        <Chip label="Gấp" color="error" size="small" sx={{ ml: 1 }} />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Xem chi tiết">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => loadContractDetails(contract.contractId)}
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                        </Tooltip>

                                                        {formatted.mySignatureStatus === 'Pending' && (
                                                            <>
                                                                <Tooltip title="Ký hợp đồng">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            setSelectedContract(contract);
                                                                            setSignDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <CheckCircle />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="Từ chối">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => {
                                                                            setSelectedContract(contract);
                                                                            setDeclineDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Cancel />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}

                                                        {['Active', 'FullySigned'].includes(formatted.status) && (
                                                            <>
                                                                <Tooltip title="Tải PDF">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => downloadContract(contract.contractId, formatted.title)}
                                                                    >
                                                                        <Download />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                {formatted.myRole === 'Creator' && (
                                                                    <Tooltip title="Chấm dứt">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="warning"
                                                                            onClick={() => {
                                                                                setSelectedContract(contract);
                                                                                setTerminateDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <Warning />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={contracts.length}
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

                <TabPanel value={tabValue} index={1}>
                    <Typography variant="h6" gutterBottom>
                        Hợp đồng chờ ký của tôi ({pendingContracts.length})
                    </Typography>

                    {pendingContracts.length === 0 ? (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Không có hợp đồng nào chờ ký
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {pendingContracts.map((contract) => {
                                const formatted = formatContractForDisplay(contract);
                                return (
                                    <Grid item xs={12} md={6} key={contract.contractId}>
                                        <Card sx={{
                                            border: formatted.isUrgent ? '2px solid' : '1px solid',
                                            borderColor: formatted.isUrgent ? 'error.main' : 'grey.300'
                                        }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="h6" component="div">
                                                        {formatted.title}
                                                    </Typography>
                                                    {formatted.isUrgent && (
                                                        <Chip label="Gấp" color="error" size="small" />
                                                    )}
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {formatted.templateDisplayName}
                                                </Typography>

                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Xe:</strong> {formatted.vehicleName}
                                                </Typography>

                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Người tạo:</strong> {formatted.creatorName}
                                                </Typography>

                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Hạn ký:</strong> {formatted.formattedSignatureDeadline}
                                                </Typography>

                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Tiến độ:</strong> {formatted.completedSignatures}/{formatted.totalSignatories} đã ký
                                                </Typography>

                                                <LinearProgress
                                                    variant="determinate"
                                                    value={formatted.signatureProgress}
                                                    sx={{ my: 2, height: 8, borderRadius: 4 }}
                                                />

                                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<Visibility />}
                                                        onClick={() => loadContractDetails(contract.contractId)}
                                                    >
                                                        Xem chi tiết
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircle />}
                                                        onClick={() => {
                                                            setSelectedContract(contract);
                                                            loadContractDetails(contract.contractId);
                                                            setSignDialogOpen(true);
                                                        }}
                                                    >
                                                        Ký hợp đồng
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Cancel />}
                                                        onClick={() => {
                                                            setSelectedContract(contract);
                                                            setDeclineDialogOpen(true);
                                                        }}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom>
                        Hợp đồng đã ký ({signedContracts.length})
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiêu đề</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Xe</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày ký</TableCell>
                                    <TableCell>Ngày hết hạn</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {signedContracts.map((contract) => {
                                    const formatted = formatContractForDisplay(contract);
                                    return (
                                        <TableRow key={contract.contractId}>
                                            <TableCell>{formatted.title}</TableCell>
                                            <TableCell>{formatted.templateDisplayName}</TableCell>
                                            <TableCell>{formatted.vehicleName}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={formatted.status}
                                                    size="small"
                                                    sx={{ bgcolor: formatted.statusColor, color: 'white' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(contract.mySignedAt).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell>
                                                {formatted.formattedExpiryDate || 'Không xác định'}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => loadContractDetails(contract.contractId)}
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Tải PDF">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => downloadContract(contract.contractId, formatted.title)}
                                                        >
                                                            <Download />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Typography variant="h6" gutterBottom>
                        Tạo hợp đồng điện tử mới
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Chọn xe</InputLabel>
                                <Select
                                    value={contractForm.vehicleId}
                                    onChange={(e) => handleContractFormChange('vehicleId', e.target.value)}
                                    label="Chọn xe"
                                >
                                    {vehicles.map(vehicle => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Loại hợp đồng</InputLabel>
                                <Select
                                    value={contractForm.templateType}
                                    onChange={(e) => handleContractFormChange('templateType', e.target.value)}
                                    label="Loại hợp đồng"
                                >
                                    {templates.map(template => (
                                        <MenuItem key={template.templateType} value={template.templateType}>
                                            {template.templateName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề hợp đồng"
                                value={contractForm.title}
                                onChange={(e) => handleContractFormChange('title', e.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Mô tả"
                                value={contractForm.description}
                                onChange={(e) => handleContractFormChange('description', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Người ký hợp đồng</InputLabel>
                                <Select
                                    multiple
                                    value={contractForm.signatoryUserIds}
                                    onChange={(e) => handleContractFormChange('signatoryUserIds', e.target.value)}
                                    label="Người ký hợp đồng"
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

                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Ngày có hiệu lực"
                                    value={contractForm.effectiveDate}
                                    onChange={(date) => handleContractFormChange('effectiveDate', date)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={new Date()}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Ngày hết hạn"
                                    value={contractForm.expiryDate}
                                    onChange={(date) => handleContractFormChange('expiryDate', date)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={contractForm.effectiveDate || new Date()}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Hạn chót ký"
                                    value={contractForm.signatureDeadline}
                                    onChange={(date) => handleContractFormChange('signatureDeadline', date)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={new Date()}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={resetContractForm}
                                >
                                    Xóa form
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={createContract}
                                    disabled={loading || !contractForm.vehicleId || !contractForm.templateType || !contractForm.title}
                                    startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                                >
                                    {loading ? 'Đang tạo...' : 'Tạo hợp đồng'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Contract Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Chi tiết hợp đồng</DialogTitle>
                <DialogContent>
                    {contractDetails && (
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" gutterBottom>
                                        {contractDetails.title}
                                    </Typography>

                                    <Typography variant="body2" paragraph>
                                        <strong>Loại:</strong> {contractApi.getTemplateTypeDisplayName(contractDetails.templateType)}
                                    </Typography>

                                    <Typography variant="body2" paragraph>
                                        <strong>Xe:</strong> {contractDetails.vehicleInfo?.vehicleName} ({contractDetails.vehicleInfo?.licensePlate})
                                    </Typography>

                                    <Typography variant="body2" paragraph>
                                        <strong>Người tạo:</strong> {contractDetails.creatorInfo?.userName}
                                    </Typography>

                                    <Typography variant="body2" paragraph>
                                        <strong>Mô tả:</strong> {contractDetails.description}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" gutterBottom>
                                        Nội dung hợp đồng
                                    </Typography>

                                    <Box sx={{
                                        maxHeight: 400,
                                        overflow: 'auto',
                                        p: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 1,
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem'
                                    }}>
                                        {contractDetails.contractContent}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin ký
                                    </Typography>

                                    <List>
                                        {contractDetails.signatories?.map((signatory, index) => (
                                            <ListItem key={index} divider>
                                                <ListItemIcon>
                                                    <Avatar sx={{
                                                        bgcolor: signatory.signatureStatus === 'Signed' ? 'success.main' :
                                                            signatory.signatureStatus === 'Declined' ? 'error.main' : 'warning.main'
                                                    }}>
                                                        {signatory.signatureStatus === 'Signed' ? <CheckCircle /> :
                                                            signatory.signatureStatus === 'Declined' ? <Cancel /> : <Schedule />}
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={signatory.userName}
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2">
                                                                Trạng thái: {signatory.signatureStatus === 'Signed' ? 'Đã ký' :
                                                                    signatory.signatureStatus === 'Declined' ? 'Từ chối' : 'Chờ ký'}
                                                            </Typography>
                                                            {signatory.signedAt && (
                                                                <Typography variant="body2">
                                                                    Ký lúc: {new Date(signatory.signedAt).toLocaleString('vi-VN')}
                                                                </Typography>
                                                            )}
                                                            {signatory.isCreator && (
                                                                <Chip label="Người tạo" size="small" variant="outlined" />
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Ngày có hiệu lực:</strong> {contractDetails.effectiveDate ?
                                                new Date(contractDetails.effectiveDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                                        </Typography>

                                        <Typography variant="body2" gutterBottom>
                                            <strong>Ngày hết hạn:</strong> {contractDetails.expiryDate ?
                                                new Date(contractDetails.expiryDate).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                                        </Typography>

                                        <Typography variant="body2" gutterBottom>
                                            <strong>Hạn ký:</strong> {contractDetails.signatureDeadline ?
                                                new Date(contractDetails.signatureDeadline).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)}>Đóng</Button>
                    {contractDetails && contractDetails.status === 'FullySigned' && (
                        <Button
                            onClick={() => downloadContract(contractDetails.contractId, contractDetails.title)}
                            variant="contained"
                            startIcon={<Download />}
                        >
                            Tải PDF
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Sign Dialog */}
            <Dialog
                open={signDialogOpen}
                onClose={() => setSignDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Ký hợp đồng điện tử</DialogTitle>
                <DialogContent>
                    {selectedContract && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedContract.title}
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Bằng cách ký hợp đồng này, bạn xác nhận rằng đã đọc, hiểu và đồng ý với tất cả các điều khoản.
                            </Alert>

                            <TextField
                                fullWidth
                                label="Xác nhận đồng ý"
                                value={signForm.agreementConfirmation}
                                onChange={(e) => setSignForm(prev => ({ ...prev, agreementConfirmation: e.target.value }))}
                                placeholder="Gõ: 'Tôi đồng ý với tất cả các điều khoản'"
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Ghi chú (tùy chọn)"
                                value={signForm.signerNotes}
                                onChange={(e) => setSignForm(prev => ({ ...prev, signerNotes: e.target.value }))}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSignDialogOpen(false)}>Hủy</Button>
                    <Button
                        onClick={() => signContract(selectedContract?.contractId)}
                        variant="contained"
                        color="success"
                        disabled={loading || !signForm.agreementConfirmation.includes('đồng ý')}
                        startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
                    >
                        {loading ? 'Đang ký...' : 'Ký hợp đồng'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Decline Dialog */}
            <Dialog
                open={declineDialogOpen}
                onClose={() => setDeclineDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Từ chối ký hợp đồng</DialogTitle>
                <DialogContent>
                    {selectedContract && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedContract.title}
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Lý do từ chối *"
                                value={declineForm.reason}
                                onChange={(e) => setDeclineForm(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Vui lòng nêu rõ lý do từ chối ký hợp đồng"
                                sx={{ mb: 2 }}
                                required
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Đề xuất thay đổi (tùy chọn)"
                                value={declineForm.suggestedChanges}
                                onChange={(e) => setDeclineForm(prev => ({ ...prev, suggestedChanges: e.target.value }))}
                                placeholder="Đề xuất các thay đổi để cải thiện hợp đồng"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeclineDialogOpen(false)}>Hủy</Button>
                    <Button
                        onClick={() => declineContract(selectedContract?.contractId)}
                        variant="contained"
                        color="error"
                        disabled={loading || !declineForm.reason.trim()}
                        startIcon={loading ? <CircularProgress size={16} /> : <Cancel />}
                    >
                        {loading ? 'Đang từ chối...' : 'Từ chối'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Terminate Dialog */}
            <Dialog
                open={terminateDialogOpen}
                onClose={() => setTerminateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Chấm dứt hợp đồng</DialogTitle>
                <DialogContent>
                    {selectedContract && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedContract.title}
                            </Typography>

                            <Alert severity="warning" sx={{ mb: 3 }}>
                                Chấm dứt hợp đồng là hành động không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
                            </Alert>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Lý do chấm dứt *"
                                value={terminateForm.reason}
                                onChange={(e) => setTerminateForm(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Vui lòng nêu rõ lý do chấm dứt hợp đồng"
                                sx={{ mb: 2 }}
                                required
                            />

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Ngày có hiệu lực chấm dứt"
                                    value={terminateForm.effectiveDate}
                                    onChange={(date) => setTerminateForm(prev => ({ ...prev, effectiveDate: date }))}
                                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                                    minDate={new Date()}
                                />
                            </LocalizationProvider>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Ghi chú bổ sung (tùy chọn)"
                                value={terminateForm.notes}
                                onChange={(e) => setTerminateForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Các ghi chú bổ sung về việc chấm dứt hợp đồng"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTerminateDialogOpen(false)}>Hủy</Button>
                    <Button
                        onClick={() => terminateContract(selectedContract?.contractId)}
                        variant="contained"
                        color="error"
                        disabled={loading || !terminateForm.reason.trim()}
                        startIcon={loading ? <CircularProgress size={16} /> : <Warning />}
                    >
                        {loading ? 'Đang chấm dứt...' : 'Chấm dứt hợp đồng'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ContractManagement;