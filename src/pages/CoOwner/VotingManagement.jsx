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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    LinearProgress,
    Tabs,
    Tab,
    Divider,
    Stack,
    Avatar,
    Badge,
    AccordionSummary,
    AccordionDetails,
    Accordion
} from '@mui/material';
import {
    HowToVote,
    ThumbUp,
    ThumbDown,
    RemoveCircle,
    Add,
    Visibility,
    Edit,
    History,
    TrendingUp,
    Schedule,
    AttachMoney,
    Build,
    ExpandMore,
    CheckCircle,
    Cancel,
    Pending,
    Group
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import votingApi from '../../api/votingApi';
import vehicleApi from '../../api/vehicleApi';

const VotingManagement = () => {
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [vehicles, setVehicles] = useState([]);
    const [pendingProposals, setPendingProposals] = useState([]);
    const [myVotingHistory, setMyVotingHistory] = useState([]);
    const [upgradeTypes, setUpgradeTypes] = useState([]);

    // Pagination states
    const [proposalsPagination, setProposalsPagination] = useState({ page: 0, rowsPerPage: 10 });
    const [historyPagination, setHistoryPagination] = useState({ page: 0, rowsPerPage: 10 });
    const [totalProposals, setTotalProposals] = useState(0);
    const [totalHistory, setTotalHistory] = useState(0);

    // Dialog states
    const [createDialog, setCreateDialog] = useState({ open: false });
    const [detailDialog, setDetailDialog] = useState({ open: false, proposal: null });
    const [voteDialog, setVoteDialog] = useState({ open: false, proposal: null });

    // Form states
    const [newProposal, setNewProposal] = useState({
        vehicleId: '',
        upgradeType: '',
        description: '',
        estimatedCost: '',
        proposedDate: dayjs().add(7, 'day'),
        benefits: '',
        supportingDocuments: []
    });

    const [voteData, setVoteData] = useState({
        vote: 'Approve',
        comment: '',
        reasonCode: ''
    });

    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

    // Load initial data
    useEffect(() => {
        loadVehicles();
        loadUpgradeTypes();
    }, []);

    useEffect(() => {
        if (currentTab === 0) {
            loadPendingProposals();
        } else if (currentTab === 2) {
            loadMyVotingHistory();
        }
    }, [currentTab, proposalsPagination, historyPagination]);

    const loadVehicles = async () => {
        try {
            const response = await vehicleApi.getMyVehicles().catch(() => ({ data: [] }));
            const vehiclesData = response?.data || [];
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        } catch (error) {
            console.error('Lỗi tải danh sách xe:', error);
            setVehicles([]);
        }
    };

    const loadUpgradeTypes = async () => {
        try {
            const response = await votingApi.getUpgradeTypes();
            setUpgradeTypes(response.data || [
                'Nâng cấp động cơ',
                'Cải thiện nội thất',
                'Hệ thống âm thanh',
                'Hệ thống định vị GPS',
                'Camera hành trình',
                'Bảo trì tổng thể',
                'Thay thế phụ tùng',
                'Nâng cấp an toàn'
            ]);
        } catch (error) {
            console.error('Error loading upgrade types:', error);
        }
    };

    const loadPendingProposals = async () => {
        setLoading(true);
        try {
            const response = await votingApi.getPendingProposals({
                pageIndex: proposalsPagination.page + 1,
                pageSize: proposalsPagination.rowsPerPage
            }).catch(() => ({ data: { items: [], totalItems: 0 } }));

            setPendingProposals(response?.data?.items || []);
            setTotalProposals(response?.data?.totalItems || 0);
        } catch (error) {
            console.error('Lỗi tải danh sách đề xuất:', error);
            setPendingProposals([]);
            setTotalProposals(0);
        } finally {
            setLoading(false);
        }
    };

    const loadMyVotingHistory = async () => {
        setLoading(true);
        try {
            const response = await votingApi.getMyVotingHistory({
                pageIndex: historyPagination.page + 1,
                pageSize: historyPagination.rowsPerPage
            }).catch(() => ({ data: { items: [], totalItems: 0 } }));

            setMyVotingHistory(response?.data?.items || []);
            setTotalHistory(response?.data?.totalItems || 0);
        } catch (error) {
            console.error('Lỗi tải lịch sử bình chọn:', error);
            setMyVotingHistory([]);
            setTotalHistory(0);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: 'info', message: '' }), 5000);
    };

    const handleCreateProposal = async () => {
        const validation = votingApi.validateProposalData(newProposal);
        if (!validation.isValid) {
            showAlert('error', 'Lỗi validation: ' + validation.errors.join(', '));
            return;
        }

        setLoading(true);
        try {
            const proposalData = {
                ...newProposal,
                estimatedCost: parseFloat(newProposal.estimatedCost),
                proposedDate: newProposal.proposedDate.toISOString()
            };

            await votingApi.proposeUpgrade(proposalData);

            setCreateDialog({ open: false });
            setNewProposal({
                vehicleId: '',
                upgradeType: '',
                description: '',
                estimatedCost: '',
                proposedDate: dayjs().add(7, 'day'),
                benefits: '',
                supportingDocuments: []
            });

            loadPendingProposals();
            showAlert('success', 'Đề xuất nâng cấp đã được tạo thành công');
        } catch (error) {
            showAlert('error', 'Lỗi khi tạo đề xuất: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        setLoading(true);
        try {
            await votingApi.voteOnProposal({
                proposalId: voteDialog.proposal.proposalId,
                vote: voteData.vote,
                comment: voteData.comment,
                reasonCode: voteData.reasonCode
            });

            setVoteDialog({ open: false, proposal: null });
            setVoteData({ vote: 'Approve', comment: '', reasonCode: '' });

            loadPendingProposals();
            showAlert('success', 'Bình chọn đã được ghi nhận thành công');
        } catch (error) {
            showAlert('error', 'Lỗi khi bình chọn: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (proposalId) => {
        try {
            const response = await votingApi.getProposalDetails(proposalId);
            setDetailDialog({ open: true, proposal: response.data });
        } catch (error) {
            showAlert('error', 'Không thể tải chi tiết đề xuất: ' + error.message);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const formatDateTime = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Pending': 'warning',
            'Approved': 'success',
            'Rejected': 'error',
            'Cancelled': 'default'
        };
        return statusColors[status] || 'default';
    };

    const getStatusIcon = (status) => {
        const statusIcons = {
            'Pending': <Pending />,
            'Approved': <CheckCircle />,
            'Rejected': <Cancel />,
            'Cancelled': <RemoveCircle />
        };
        return statusIcons[status] || <Schedule />;
    };

    const getVoteIcon = (vote) => {
        const voteIcons = {
            'Approve': <ThumbUp color="success" />,
            'Reject': <ThumbDown color="error" />,
            'Abstain': <RemoveCircle color="warning" />
        };
        return voteIcons[vote] || <HowToVote />;
    };

    const ProposalCard = ({ proposal }) => {
        const formattedProposal = votingApi.formatProposal(proposal);

        return (
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" component="div">
                            {proposal.upgradeType}
                        </Typography>
                        <Chip
                            icon={getStatusIcon(proposal.status)}
                            label={formattedProposal.statusText}
                            color={getStatusColor(proposal.status)}
                            size="small"
                        />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                {proposal.description}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <AttachMoney fontSize="small" />
                                <Typography variant="body2">
                                    Chi phí ước tính: <strong>{formattedProposal.formattedCost}</strong>
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <Schedule fontSize="small" />
                                <Typography variant="body2">
                                    Ngày thực hiện: <strong>{formattedProposal.formattedProposedDate}</strong>
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Group fontSize="small" />
                                <Typography variant="body2">
                                    Người đề xuất: <strong>{proposal.proposerName}</strong>
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {proposal.votingSummary && (
                                <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Tiến độ bình chọn
                                    </Typography>

                                    <Box mb={1}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2">Tán thành: {proposal.votingSummary.approveCount}</Typography>
                                            <Typography variant="body2">Phản đối: {proposal.votingSummary.rejectCount}</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(proposal.votingSummary.approveCount / proposal.votingSummary.totalVoters) * 100}
                                            color="success"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>

                                    <Typography variant="caption" color="textSecondary">
                                        {proposal.votingSummary.totalVotes}/{proposal.votingSummary.totalVoters} đã bình chọn
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    {proposal.benefits && (
                        <Accordion sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle2">Lợi ích mong đợi</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2">{proposal.benefits}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </CardContent>

                <CardActions>
                    <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(proposal.proposalId)}
                    >
                        Xem chi tiết
                    </Button>

                    {proposal.status === 'Pending' && !proposal.hasVoted && (
                        <Button
                            size="small"
                            variant="contained"
                            startIcon={<HowToVote />}
                            onClick={() => setVoteDialog({ open: true, proposal })}
                        >
                            Bình chọn
                        </Button>
                    )}

                    {proposal.hasVoted && (
                        <Chip
                            icon={getVoteIcon(proposal.myVote)}
                            label={`Đã bình chọn: ${proposal.myVote}`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                </CardActions>
            </Card>
        );
    };

    const CreateProposalDialog = () => (
        <Dialog open={createDialog.open} onClose={() => setCreateDialog({ open: false })} maxWidth="md" fullWidth>
            <DialogTitle>Tạo đề xuất nâng cấp xe</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Chọn xe</InputLabel>
                            <Select
                                value={newProposal.vehicleId}
                                onChange={(e) => setNewProposal(prev => ({ ...prev, vehicleId: e.target.value }))}
                                label="Chọn xe"
                            >
                                {vehicles.map((vehicle) => (
                                    <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                                        {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Loại nâng cấp</InputLabel>
                            <Select
                                value={newProposal.upgradeType}
                                onChange={(e) => setNewProposal(prev => ({ ...prev, upgradeType: e.target.value }))}
                                label="Loại nâng cấp"
                            >
                                {upgradeTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
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
                            label="Mô tả nâng cấp"
                            value={newProposal.description}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Mô tả chi tiết về việc nâng cấp cần thực hiện..."
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Chi phí ước tính (VND)"
                            value={newProposal.estimatedCost}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, estimatedCost: e.target.value }))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="Ngày thực hiện dự kiến"
                            value={newProposal.proposedDate}
                            onChange={(newValue) => setNewProposal(prev => ({ ...prev, proposedDate: newValue }))}
                            sx={{ width: '100%' }}
                            minDateTime={dayjs().add(1, 'day')}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Lợi ích mong đợi"
                            value={newProposal.benefits}
                            onChange={(e) => setNewProposal(prev => ({ ...prev, benefits: e.target.value }))}
                            placeholder="Các lợi ích mà việc nâng cấp này sẽ mang lại..."
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setCreateDialog({ open: false })}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleCreateProposal}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                >
                    Tạo đề xuất
                </Button>
            </DialogActions>
        </Dialog>
    );

    const VoteDialog = () => (
        <Dialog open={voteDialog.open} onClose={() => setVoteDialog({ open: false, proposal: null })} maxWidth="sm" fullWidth>
            <DialogTitle>Bình chọn đề xuất</DialogTitle>
            <DialogContent>
                {voteDialog.proposal && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {voteDialog.proposal.upgradeType}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            {voteDialog.proposal.description}
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Quyết định bình chọn</InputLabel>
                                    <Select
                                        value={voteData.vote}
                                        onChange={(e) => setVoteData(prev => ({ ...prev, vote: e.target.value }))}
                                        label="Quyết định bình chọn"
                                    >
                                        <MenuItem value="Approve">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <ThumbUp color="success" fontSize="small" />
                                                Tán thành
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="Reject">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <ThumbDown color="error" fontSize="small" />
                                                Phản đối
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="Abstain">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <RemoveCircle color="warning" fontSize="small" />
                                                Kiêng vote
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Góp ý (tùy chọn)"
                                    value={voteData.comment}
                                    onChange={(e) => setVoteData(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Chia sẻ ý kiến của bạn về đề xuất này..."
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setVoteDialog({ open: false, proposal: null })}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleVote}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <HowToVote />}
                >
                    Xác nhận bình chọn
                </Button>
            </DialogActions>
        </Dialog>
    );

    const ProposalDetailsDialog = () => (
        <Dialog
            open={detailDialog.open}
            onClose={() => setDetailDialog({ open: false, proposal: null })}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>Chi tiết đề xuất nâng cấp</DialogTitle>
            <DialogContent dividers>
                {detailDialog.proposal && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>{detailDialog.proposal.upgradeType}</Typography>
                            <Typography variant="body1" paragraph>{detailDialog.proposal.description}</Typography>

                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Thông tin chi tiết</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Chi phí ước tính:</strong></Typography>
                                    <Typography variant="body1">{formatCurrency(detailDialog.proposal.estimatedCost)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2"><strong>Ngày thực hiện:</strong></Typography>
                                    <Typography variant="body1">{formatDateTime(detailDialog.proposal.proposedDate)}</Typography>
                                </Grid>
                            </Grid>

                            {detailDialog.proposal.benefits && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6" gutterBottom>Lợi ích mong đợi</Typography>
                                    <Typography variant="body1">{detailDialog.proposal.benefits}</Typography>
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Kết quả bình chọn</Typography>
                                {detailDialog.proposal.votingSummary && (
                                    <Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2">Tán thành:</Typography>
                                            <Typography variant="body2" color="success.main">
                                                {detailDialog.proposal.votingSummary.approveCount}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2">Phản đối:</Typography>
                                            <Typography variant="body2" color="error.main">
                                                {detailDialog.proposal.votingSummary.rejectCount}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography variant="body2">Kiêng vote:</Typography>
                                            <Typography variant="body2" color="warning.main">
                                                {detailDialog.proposal.votingSummary.abstainCount}
                                            </Typography>
                                        </Box>

                                        <LinearProgress
                                            variant="determinate"
                                            value={(detailDialog.proposal.votingSummary.approveCount / detailDialog.proposal.votingSummary.totalVoters) * 100}
                                            color="success"
                                            sx={{ height: 8, borderRadius: 1 }}
                                        />

                                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                                            {detailDialog.proposal.votingSummary.totalVotes}/{detailDialog.proposal.votingSummary.totalVoters} đã bình chọn
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDetailDialog({ open: false, proposal: null })}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                {alert.show && (
                    <Alert severity={alert.type} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
                    <Tab label="Đề xuất đang chờ" />
                    <Tab label="Tạo đề xuất mới" />
                    <Tab label="Lịch sử bình chọn" />
                </Tabs>

                {currentTab === 0 && (
                    <Box>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<TrendingUp />}
                                onClick={loadPendingProposals}
                            >
                                Tải lại danh sách
                            </Button>
                        </Paper>

                        {loading ? (
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box>
                                {pendingProposals.map((proposal) => (
                                    <ProposalCard key={proposal.proposalId} proposal={proposal} />
                                ))}

                                {pendingProposals.length === 0 && (
                                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="body1" color="textSecondary">
                                            Hiện tại không có đề xuất nâng cấp nào đang chờ bình chọn
                                        </Typography>
                                    </Paper>
                                )}

                                <TablePagination
                                    component="div"
                                    count={totalProposals}
                                    page={proposalsPagination.page}
                                    onPageChange={(_, newPage) => setProposalsPagination(prev => ({ ...prev, page: newPage }))}
                                    rowsPerPage={proposalsPagination.rowsPerPage}
                                    onRowsPerPageChange={(e) => setProposalsPagination(prev => ({ ...prev, rowsPerPage: parseInt(e.target.value, 10), page: 0 }))}
                                    labelRowsPerPage="Số đề xuất mỗi trang:"
                                />
                            </Box>
                        )}
                    </Box>
                )}

                {currentTab === 1 && (
                    <Box>
                        <Paper sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6">Tạo đề xuất nâng cấp mới</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => setCreateDialog({ open: true })}
                                >
                                    Tạo đề xuất
                                </Button>
                            </Stack>

                            <Typography variant="body2" color="textSecondary">
                                Tạo đề xuất nâng cấp cho xe của bạn. Đề xuất sẽ được gửi đến tất cả các đồng sở hữu để bình chọn.
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="primary" gutterBottom>
                                                <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Quy trình đề xuất
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                1. Chọn xe cần nâng cấp<br />
                                                2. Mô tả chi tiết việc nâng cấp<br />
                                                3. Ước tính chi phí và thời gian<br />
                                                4. Gửi đề xuất để các thành viên bình chọn<br />
                                                5. Theo dõi kết quả bình chọn
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="info.main" gutterBottom>
                                                <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                Lưu ý quan trọng
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                • Đề xuất cần có ít nhất 50% số phiếu tán thành để được thông qua<br />
                                                • Thời gian bình chọn tối đa là 7 ngày<br />
                                                • Chi phí được chia đều giữa các đồng sở hữu<br />
                                                • Có thể rút lại đề xuất trước khi bắt đầu bình chọn
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                )}

                {currentTab === 2 && (
                    <Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Đề xuất</TableCell>
                                        <TableCell>Xe</TableCell>
                                        <TableCell>Quyết định</TableCell>
                                        <TableCell>Ngày bình chọn</TableCell>
                                        <TableCell>Kết quả</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {myVotingHistory.map((vote) => (
                                        <TableRow key={vote.voteId}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {vote.proposalTitle}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {vote.upgradeType}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{vote.vehicleName}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getVoteIcon(vote.voteDecision)}
                                                    label={vote.voteDecision}
                                                    size="small"
                                                    color={vote.voteDecision === 'Approve' ? 'success' : vote.voteDecision === 'Reject' ? 'error' : 'warning'}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDateTime(vote.votedAt)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(vote.proposalStatus)}
                                                    label={vote.proposalStatus}
                                                    size="small"
                                                    color={getStatusColor(vote.proposalStatus)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <TablePagination
                                component="div"
                                count={totalHistory}
                                page={historyPagination.page}
                                onPageChange={(_, newPage) => setHistoryPagination(prev => ({ ...prev, page: newPage }))}
                                rowsPerPage={historyPagination.rowsPerPage}
                                onRowsPerPageChange={(e) => setHistoryPagination(prev => ({ ...prev, rowsPerPage: parseInt(e.target.value, 10), page: 0 }))}
                                labelRowsPerPage="Số dòng mỗi trang:"
                            />
                        </TableContainer>
                    </Box>
                )}

                {/* Dialogs */}
                <CreateProposalDialog />
                <VoteDialog />
                <ProposalDetailsDialog />
            </Box>
        </LocalizationProvider>
    );
};

export default VotingManagement;