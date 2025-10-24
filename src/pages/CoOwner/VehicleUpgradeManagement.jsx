import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Badge,
  LinearProgress,
  Fab,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import {
  Build,
  Add,
  ThumbUp,
  ThumbDown,
  Visibility,
  Cancel,
  CheckCircle,
  Schedule,
  Timeline,
  ExpandMore,
  HowToVote,
  Assessment,
  AttachMoney,
  CalendarToday,
  Person,
  Image,
  Phone,
  Business,
  PlayArrow,
  GetApp,
  Edit,
  Delete,
  History
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

import vehicleUpgradeApi from '../../api/vehicleUpgradeApi';
import vehicleApi from '../../api/vehicleApi';
import { useAuth } from '../../context/AuthContext';

const VehicleUpgradeManagement = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [pendingProposals, setPendingProposals] = useState([]);
  const [myHistory, setMyHistory] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [proposeDialog, setProposeDialog] = useState(false);
  const [voteDialog, setVoteDialog] = useState({ open: false, proposal: null });
  const [detailDialog, setDetailDialog] = useState({ open: false, proposal: null });
  const [executeDialog, setExecuteDialog] = useState({ open: false, proposal: null });

  // Form states
  const [proposalForm, setProposalForm] = useState({
    vehicleId: '',
    upgradeType: 0,
    title: '',
    description: '',
    estimatedCost: '',
    justification: '',
    imageUrl: '',
    vendorName: '',
    vendorContact: '',
    proposedInstallationDate: '',
    estimatedDurationDays: ''
  });

  const [voteForm, setVoteForm] = useState({
    isApprove: true,
    comments: ''
  });

  const [executeForm, setExecuteForm] = useState({
    actualCost: '',
    executionNotes: '',
    invoiceImageUrl: ''
  });

  useEffect(() => {
    loadVehicles();
    loadMyHistory();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      loadPendingProposals();
      loadStatistics();
    }
  }, [selectedVehicle]);

  const loadVehicles = async () => {
    try {
      const response = await vehicleApi.getAllVehicles();
      setVehicles(response.data.data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách xe:', error);
      setError('Không thể tải danh sách xe');
    }
  };

  const loadPendingProposals = async () => {
    try {
      setLoading(true);
      const response = await vehicleUpgradeApi.getPendingProposals(selectedVehicle);
      setPendingProposals(response.data.data?.pendingProposals || []);
    } catch (error) {
      console.error('Lỗi tải đề xuất:', error);
      setError('Không thể tải danh sách đề xuất');
    } finally {
      setLoading(false);
    }
  };

  const loadMyHistory = async () => {
    try {
      const response = await vehicleUpgradeApi.getMyVotingHistory();
      setMyHistory(response.data.data);
    } catch (error) {
      console.error('Lỗi tải lịch sử:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await vehicleUpgradeApi.getVehicleUpgradeStatistics(selectedVehicle);
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
    }
  };

  const handleProposeUpgrade = async () => {
    try {
      setLoading(true);
      setError('');

      const errors = vehicleUpgradeApi.validateProposalData(proposalForm);
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }

      const submitData = {
        ...proposalForm,
        vehicleId: selectedVehicle,
        estimatedCost: parseFloat(proposalForm.estimatedCost),
        estimatedDurationDays: proposalForm.estimatedDurationDays ? 
          parseInt(proposalForm.estimatedDurationDays) : undefined
      };

      await vehicleUpgradeApi.proposeUpgrade(submitData);
      setSuccess('Đề xuất nâng cấp được tạo thành công');
      setProposeDialog(false);
      resetProposalForm();
      loadPendingProposals();
    } catch (error) {
      console.error('Lỗi tạo đề xuất:', error);
      setError(error.response?.data?.message || 'Không thể tạo đề xuất');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    try {
      setLoading(true);
      setError('');

      const errors = vehicleUpgradeApi.validateVoteData(voteForm);
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }

      await vehicleUpgradeApi.voteOnProposal(voteDialog.proposal.proposalId, voteForm);
      setSuccess(`Bỏ phiếu ${voteForm.isApprove ? 'đồng ý' : 'từ chối'} thành công`);
      setVoteDialog({ open: false, proposal: null });
      setVoteForm({ isApprove: true, comments: '' });
      loadPendingProposals();
      loadMyHistory();
    } catch (error) {
      console.error('Lỗi bỏ phiếu:', error);
      setError(error.response?.data?.message || 'Không thể bỏ phiếu');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    try {
      setLoading(true);
      setError('');

      const errors = vehicleUpgradeApi.validateExecutionData(executeForm);
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }

      const submitData = {
        ...executeForm,
        actualCost: parseFloat(executeForm.actualCost)
      };

      await vehicleUpgradeApi.executeProposal(executeDialog.proposal.proposalId, submitData);
      setSuccess('Đánh dấu thực hiện thành công');
      setExecuteDialog({ open: false, proposal: null });
      setExecuteForm({ actualCost: '', executionNotes: '', invoiceImageUrl: '' });
      loadPendingProposals();
      loadStatistics();
    } catch (error) {
      console.error('Lỗi thực hiện:', error);
      setError(error.response?.data?.message || 'Không thể thực hiện');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (proposalId) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đề xuất này?')) return;

    try {
      setLoading(true);
      await vehicleUpgradeApi.cancelProposal(proposalId);
      setSuccess('Hủy đề xuất thành công');
      loadPendingProposals();
    } catch (error) {
      console.error('Lỗi hủy đề xuất:', error);
      setError(error.response?.data?.message || 'Không thể hủy đề xuất');
    } finally {
      setLoading(false);
    }
  };

  const resetProposalForm = () => {
    setProposalForm({
      vehicleId: '',
      upgradeType: 0,
      title: '',
      description: '',
      estimatedCost: '',
      justification: '',
      imageUrl: '',
      vendorName: '',
      vendorContact: '',
      proposedInstallationDate: '',
      estimatedDurationDays: ''
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleFormChange = (field) => (event) => {
    if (field === 'vehicleId') {
      setSelectedVehicle(event.target.value);
    }
    
    const form = field.startsWith('proposal') ? 'proposalForm' :
                 field.startsWith('vote') ? 'voteForm' : 'executeForm';
    const actualField = field.replace(/^(proposal|vote|execute)\./, '');
    
    if (form === 'proposalForm') {
      setProposalForm(prev => ({ ...prev, [actualField]: event.target.value }));
    } else if (form === 'voteForm') {
      setVoteForm(prev => ({ ...prev, [actualField]: event.target.value }));
    } else {
      setExecuteForm(prev => ({ ...prev, [actualField]: event.target.value }));
    }
  };

  const renderVehicleSelector = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Chọn xe để quản lý
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              select
              label="Chọn xe"
              value={selectedVehicle}
              onChange={handleFormChange('vehicleId')}
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setProposeDialog(true)}
              disabled={!selectedVehicle}
              fullWidth
            >
              Đề xuất nâng cấp
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderProposalCard = (proposal) => {
    const typeInfo = vehicleUpgradeApi.getUpgradeTypeInfo(proposal.upgradeType || proposal.upgradeTypeName);
    const statusInfo = vehicleUpgradeApi.getStatusInfo(proposal.status || proposal.votingProgress?.status);
    const progress = vehicleUpgradeApi.calculateVotingProgress(proposal.votingProgress);
    const daysRemaining = vehicleUpgradeApi.getDaysRemaining(proposal.votingDeadline);
    const canVote = vehicleUpgradeApi.canUserVote({ votingInfo: proposal.votingProgress }, user?.id);
    const canExecute = vehicleUpgradeApi.canUserExecute({ 
      votingInfo: { status: 'Approved' }, 
      proposerInfo: { proposerId: proposal.proposerId },
      executionInfo: { isExecuted: false }
    }, user?.id, user?.role === 'Admin');

    return (
      <Card key={proposal.proposalId} sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body1" sx={{ fontSize: '1.5rem' }}>
                  {typeInfo.icon}
                </Typography>
                <Typography variant="h6">{proposal.title}</Typography>
                <Chip
                  size="small"
                  label={statusInfo.label}
                  sx={{ 
                    backgroundColor: statusInfo.bgColor,
                    color: statusInfo.color
                  }}
                />
              </Box>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {typeInfo.label} • {vehicleUpgradeApi.formatCurrency(proposal.estimatedCost)}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                Đề xuất bởi: <strong>{proposal.proposerName}</strong>
              </Typography>

              {proposal.votingProgress && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Tiến độ bỏ phiếu: {proposal.votingProgress.votedCount}/{proposal.votingProgress.totalCoOwners}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress ? progress.progressPercentage : 0}
                    sx={{ mb: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {proposal.votingProgress.approvedCount} đồng ý • {proposal.votingProgress.rejectedCount} từ chối
                    {daysRemaining !== null && ` • Còn ${vehicleUpgradeApi.formatDaysRemaining(daysRemaining)}`}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => setDetailDialog({ open: true, proposal })}
                >
                  Chi tiết
                </Button>
                
                {canVote && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<HowToVote />}
                    onClick={() => setVoteDialog({ open: true, proposal })}
                    color="primary"
                  >
                    Bỏ phiếu
                  </Button>
                )}

                {canExecute && (
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => setExecuteDialog({ open: true, proposal })}
                    color="success"
                  >
                    Thực hiện
                  </Button>
                )}

                {(user?.role === 'Admin' || proposal.proposerId === user?.id) && 
                 ['Pending', 'Approved'].includes(proposal.status || proposal.votingProgress?.status) && (
                  <Button
                    size="small"
                    startIcon={<Cancel />}
                    onClick={() => handleCancel(proposal.proposalId)}
                    color="error"
                  >
                    Hủy
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderPendingTab = () => (
    <Box>
      {renderVehicleSelector()}
      
      {selectedVehicle && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Đề xuất đang chờ ({pendingProposals.length})
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : pendingProposals.length === 0 ? (
            <Alert severity="info">
              Không có đề xuất nào đang chờ bỏ phiếu
            </Alert>
          ) : (
            <Box>
              {vehicleUpgradeApi.sortProposalsByPriority(pendingProposals).map(renderProposalCard)}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const renderHistoryTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Lịch sử bỏ phiếu của tôi
      </Typography>
      
      {myHistory ? (
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {myHistory.summary.totalVotes}
                  </Typography>
                  <Typography variant="body2">Tổng số phiếu</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {myHistory.summary.approvedVotes}
                  </Typography>
                  <Typography variant="body2">Đồng ý</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {myHistory.summary.rejectedVotes}
                  </Typography>
                  <Typography variant="body2">Từ chối</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {myHistory.summary.proposalsCreated}
                  </Typography>
                  <Typography variant="body2">Đề xuất tạo</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Đề xuất</TableCell>
                  <TableCell>Xe</TableCell>
                  <TableCell>Loại nâng cấp</TableCell>
                  <TableCell align="right">Chi phí</TableCell>
                  <TableCell>Phiếu bầu</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày bỏ phiếu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myHistory.votingHistory.map((vote) => {
                  const typeInfo = vehicleUpgradeApi.getUpgradeTypeInfo(vote.upgradeType);
                  const statusInfo = vehicleUpgradeApi.getStatusInfo(vote.proposalStatus);
                  
                  return (
                    <TableRow key={vote.proposalId}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {vote.proposalTitle}
                          </Typography>
                          {vote.isUserProposer && (
                            <Chip size="small" label="Của tôi" color="primary" variant="outlined" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{vote.vehicleName}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{typeInfo.icon}</span>
                          {typeInfo.label}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {vehicleUpgradeApi.formatCurrency(vote.estimatedCost)}
                        {vote.actualCost && (
                          <Typography variant="body2" color="textSecondary">
                            Thực tế: {vehicleUpgradeApi.formatCurrency(vote.actualCost)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={vote.userVote === 'Approved' ? <ThumbUp /> : <ThumbDown />}
                          label={vote.userVote === 'Approved' ? 'Đồng ý' : 'Từ chối'}
                          color={vote.userVote === 'Approved' ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={statusInfo.label}
                          sx={{ 
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {vehicleUpgradeApi.formatDate(vote.votedAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Alert severity="info">Chưa có lịch sử bỏ phiếu</Alert>
      )}
    </Box>
  );

  const renderStatisticsTab = () => {
    if (!selectedVehicle) {
      return (
        <Alert severity="info">
          Vui lòng chọn xe để xem thống kê
        </Alert>
      );
    }

    if (!statistics) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    const chartData = vehicleUpgradeApi.prepareStatisticsChartData(statistics);
    const costData = vehicleUpgradeApi.prepareCostChartData(statistics);

    return (
      <Box>
        {renderVehicleSelector()}
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {statistics.overallStatistics.totalProposals}
                </Typography>
                <Typography variant="body2">Tổng đề xuất</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {statistics.overallStatistics.approvedProposals}
                </Typography>
                <Typography variant="body2">Đã phê duyệt</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {statistics.overallStatistics.executedProposals}
                </Typography>
                <Typography variant="body2">Đã thực hiện</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {vehicleUpgradeApi.formatPercentage(statistics.overallStatistics.executionRate)}
                </Typography>
                <Typography variant="body2">Tỷ lệ thực hiện</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân bố theo loại nâng cấp
                </Typography>
                {chartData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.datasets[0].data.map((value, index) => ({
                          name: chartData.labels[index],
                          value,
                          color: chartData.datasets[0].backgroundColor[index]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.datasets[0].data.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={chartData.datasets[0].backgroundColor[index]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chi phí theo loại
                </Typography>
                {costData && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costData.labels.map((label, index) => ({
                      name: label,
                      estimated: costData.estimatedCosts[index],
                      executed: costData.executedCosts[index]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => vehicleUpgradeApi.formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="estimated" fill="#8884d8" name="Ước tính" />
                      <Bar dataKey="executed" fill="#82ca9d" name="Thực tế" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thống kê chi tiết theo loại nâng cấp
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại nâng cấp</TableCell>
                    <TableCell align="center">Số đề xuất</TableCell>
                    <TableCell align="center">Đã thực hiện</TableCell>
                    <TableCell align="right">Chi phí ước tính</TableCell>
                    <TableCell align="right">Chi phí thực tế</TableCell>
                    <TableCell align="center">Tỷ lệ thực hiện</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics.upgradeTypeBreakdown.map((item) => (
                    <TableRow key={item.upgradeType}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{vehicleUpgradeApi.getUpgradeTypeInfo(item.upgradeType).icon}</span>
                          {item.upgradeTypeName}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip size="small" label={item.count} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip size="small" label={item.executedCount} color="success" />
                      </TableCell>
                      <TableCell align="right">
                        {vehicleUpgradeApi.formatCurrency(item.totalCost)}
                      </TableCell>
                      <TableCell align="right">
                        {vehicleUpgradeApi.formatCurrency(item.executedCost)}
                      </TableCell>
                      <TableCell align="center">
                        <LinearProgress
                          variant="determinate"
                          value={item.count > 0 ? (item.executedCount / item.count) * 100 : 0}
                          sx={{ width: 60, mx: 'auto' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderProposeDialog = () => (
    <Dialog open={proposeDialog} onClose={() => setProposeDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>Đề xuất nâng cấp xe</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Loại nâng cấp"
              value={proposalForm.upgradeType}
              onChange={handleFormChange('proposal.upgradeType')}
            >
              {Object.entries(vehicleUpgradeApi.upgradeTypes).map(([key, type]) => (
                <MenuItem key={key} value={parseInt(key)}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{type.icon}</span>
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Chi phí ước tính</InputLabel>
              <OutlinedInput
                label="Chi phí ước tính"
                value={proposalForm.estimatedCost}
                onChange={handleFormChange('proposal.estimatedCost')}
                startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                type="number"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tiêu đề đề xuất"
              value={proposalForm.title}
              onChange={handleFormChange('proposal.title')}
              placeholder="VD: Nâng cấp pin lên 100kWh"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả chi tiết"
              value={proposalForm.description}
              onChange={handleFormChange('proposal.description')}
              placeholder="Mô tả chi tiết về việc nâng cấp..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Lý do cần nâng cấp"
              value={proposalForm.justification}
              onChange={handleFormChange('proposal.justification')}
              placeholder="Giải thích lý do tại sao cần nâng cấp này..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên nhà cung cấp"
              value={proposalForm.vendorName}
              onChange={handleFormChange('proposal.vendorName')}
              placeholder="VD: Tesla Battery Solutions"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Liên hệ nhà cung cấp"
              value={proposalForm.vendorContact}
              onChange={handleFormChange('proposal.vendorContact')}
              placeholder="Số điện thoại hoặc email"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Ngày lắp đặt dự kiến"
              value={proposalForm.proposedInstallationDate}
              onChange={handleFormChange('proposal.proposedInstallationDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Thời gian ước tính (ngày)"
              value={proposalForm.estimatedDurationDays}
              onChange={handleFormChange('proposal.estimatedDurationDays')}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL hình ảnh minh họa"
              value={proposalForm.imageUrl}
              onChange={handleFormChange('proposal.imageUrl')}
              placeholder="https://example.com/image.jpg"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setProposeDialog(false)}>Hủy</Button>
        <Button 
          variant="contained" 
          onClick={handleProposeUpgrade}
          disabled={loading}
        >
          Tạo đề xuất
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderVoteDialog = () => (
    <Dialog 
      open={voteDialog.open} 
      onClose={() => setVoteDialog({ open: false, proposal: null })} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Bỏ phiếu cho đề xuất</DialogTitle>
      <DialogContent>
        {voteDialog.proposal && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {voteDialog.proposal.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Chi phí: {vehicleUpgradeApi.formatCurrency(voteDialog.proposal.estimatedCost)}
            </Typography>

            <TextField
              fullWidth
              select
              label="Quyết định"
              value={voteForm.isApprove}
              onChange={handleFormChange('vote.isApprove')}
              sx={{ mb: 3 }}
            >
              <MenuItem value={true}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThumbUp color="success" />
                  Đồng ý
                </Box>
              </MenuItem>
              <MenuItem value={false}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThumbDown color="error" />
                  Từ chối
                </Box>
              </MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Nhận xét (tùy chọn)"
              value={voteForm.comments}
              onChange={handleFormChange('vote.comments')}
              placeholder="Chia sẻ ý kiến của bạn về đề xuất này..."
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVoteDialog({ open: false, proposal: null })}>
          Hủy
        </Button>
        <Button 
          variant="contained" 
          onClick={handleVote}
          disabled={loading}
          color={voteForm.isApprove ? 'success' : 'error'}
        >
          {voteForm.isApprove ? 'Đồng ý' : 'Từ chối'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderExecuteDialog = () => (
    <Dialog 
      open={executeDialog.open} 
      onClose={() => setExecuteDialog({ open: false, proposal: null })} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Đánh dấu đã thực hiện</DialogTitle>
      <DialogContent>
        {executeDialog.proposal && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info">
                Đề xuất: <strong>{executeDialog.proposal.title}</strong><br/>
                Chi phí ước tính: <strong>{vehicleUpgradeApi.formatCurrency(executeDialog.proposal.estimatedCost)}</strong>
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chi phí thực tế</InputLabel>
                <OutlinedInput
                  label="Chi phí thực tế"
                  value={executeForm.actualCost}
                  onChange={handleFormChange('execute.actualCost')}
                  startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú thực hiện (tùy chọn)"
                value={executeForm.executionNotes}
                onChange={handleFormChange('execute.executionNotes')}
                placeholder="Ghi chú về quá trình thực hiện..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL hóa đơn (tùy chọn)"
                value={executeForm.invoiceImageUrl}
                onChange={handleFormChange('execute.invoiceImageUrl')}
                placeholder="https://example.com/invoice.pdf"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExecuteDialog({ open: false, proposal: null })}>
          Hủy
        </Button>
        <Button 
          variant="contained" 
          onClick={handleExecute}
          disabled={loading}
          color="success"
        >
          Đánh dấu hoàn thành
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Build /> Quản lý nâng cấp xe
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab 
          icon={<Schedule />} 
          label="Đề xuất đang chờ"
          iconPosition="start"
        />
        <Tab 
          icon={<History />} 
          label="Lịch sử của tôi" 
          iconPosition="start"
        />
        <Tab 
          icon={<Assessment />} 
          label="Thống kê" 
          iconPosition="start"
        />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {tabValue === 0 && renderPendingTab()}
      {tabValue === 1 && renderHistoryTab()}
      {tabValue === 2 && renderStatisticsTab()}

      {renderProposeDialog()}
      {renderVoteDialog()}
      {renderExecuteDialog()}
    </Container>
  );
};

export default VehicleUpgradeManagement;