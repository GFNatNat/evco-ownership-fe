import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  Divider,
  Badge,
  CardHeader,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material';
import HowToVote from '@mui/icons-material/HowToVote';
import Add from '@mui/icons-material/Add';
import Visibility from '@mui/icons-material/Visibility';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import Schedule from '@mui/icons-material/Schedule';
import Build from '@mui/icons-material/Build';
import ReportProblem from '@mui/icons-material/ReportProblem';
import Upgrade from '@mui/icons-material/Upgrade';
import Lightbulb from '@mui/icons-material/Lightbulb';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import History from '@mui/icons-material/History';
import PieChart from '@mui/icons-material/PieChart';
import People from '@mui/icons-material/People';
import Assignment from '@mui/icons-material/Assignment';
import Pending from '@mui/icons-material/Pending';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import maintenanceVoteApi from '../../api/maintenanceVoteApi';
import fileUploadApi from '../../api/fileUploadApi';

function MaintenanceVoteManagement({ vehicleId, currentUserId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [voteData, setVoteData] = useState({
    pendingProposals: [],
    history: [],
    proposalDetails: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Forms
  const [proposalForm, setProposalForm] = useState({
    maintenanceCostId: '',
    reason: '',
    amount: '',
    imageFile: null,
    maintenanceType: 0,
    priority: 1,
    title: '',
    estimatedCost: '',
    proposedDate: null,
    description: '',
    proposalReason: '',
    supportingDocuments: []
  });

  const [voteForm, setVoteForm] = useState({
    approve: true,
    comments: ''
  });

  const [filterForm, setFilterForm] = useState({
    status: '',
    maintenanceType: '',
    priority: ''
  });

  // Load vote data
  const loadVoteData = async () => {
    if (!vehicleId) return;

    setLoading(true);
    try {
      const [pendingRes, historyRes] = await Promise.all([
        maintenanceVoteApi.getPendingProposals(vehicleId, { pageSize: 50 }),
        maintenanceVoteApi.getMyVotingHistory({ pageSize: 50, status: filterForm.status })
      ]);

      setVoteData({
        pendingProposals: (pendingRes.data.data.items || []).map(maintenanceVoteApi.formatProposalForDisplay),
        history: (historyRes.data.data.items || []).map(maintenanceVoteApi.formatProposalForDisplay),
        proposalDetails: {}
      });
    } catch (err) {
      setError('Không thể tải dữ liệu bỏ phiếu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoteData();
  }, [vehicleId, filterForm.status]);

  // Load proposal details
  const loadProposalDetails = async (proposalId) => {
    setLoading(true);
    try {
      const response = await maintenanceVoteApi.getProposalDetails(proposalId);
      const proposal = maintenanceVoteApi.formatProposalForDisplay(response.data.data);

      setVoteData(prev => ({
        ...prev,
        proposalDetails: {
          ...prev.proposalDetails,
          [proposalId]: proposal
        }
      }));

      return proposal;
    } catch (err) {
      setError('Không thể tải chi tiết đề xuất: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle proposal submission
  const handleProposalSubmit = async () => {
    const validation = maintenanceVoteApi.validateProposalData(proposalForm);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';

      // Upload image if provided
      if (proposalForm.imageFile) {
        const formData = fileUploadApi.createFormData(proposalForm.imageFile, {
          fileType: 'MaintenanceEvidence',
          vehicleId: vehicleId
        });
        const uploadRes = await fileUploadApi.upload(formData);
        imageUrl = uploadRes.data.data.fileUrl;
      }

      const submitData = {
        vehicleId: vehicleId,
        maintenanceCostId: parseInt(proposalForm.maintenanceCostId),
        reason: proposalForm.reason,
        amount: parseFloat(proposalForm.amount),
        imageUrl: imageUrl
      };

      await maintenanceVoteApi.propose(submitData);
      setSuccess('Đề xuất bảo trì đã được tạo thành công!');

      setProposalDialogOpen(false);
      resetProposalForm();
      loadVoteData();
    } catch (err) {
      setError('Lỗi khi tạo đề xuất: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle vote submission
  const handleVoteSubmit = async () => {
    if (!selectedProposal) return;

    const validation = maintenanceVoteApi.validateVoteData(voteForm);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setLoading(true);
    try {
      await maintenanceVoteApi.vote(selectedProposal.id, voteForm);
      setSuccess('Bình chọn đã được ghi nhận!');

      setVoteDialogOpen(false);
      resetVoteForm();
      loadVoteData();
    } catch (err) {
      setError('Lỗi khi bình chọn: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel proposal
  const handleCancelProposal = async (proposalId, cancelReason) => {
    setLoading(true);
    try {
      await maintenanceVoteApi.cancelProposal(proposalId, cancelReason);
      setSuccess('Đề xuất đã được hủy thành công!');
      loadVoteData();
    } catch (err) {
      setError('Lỗi khi hủy đề xuất: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetProposalForm = () => {
    setProposalForm({
      maintenanceCostId: '',
      reason: '',
      amount: '',
      imageFile: null
    });
  };

  const resetVoteForm = () => {
    setVoteForm({
      approve: true,
      comments: ''
    });
  };

  // Open vote dialog
  const openVoteDialog = async (proposal) => {
    const canVote = maintenanceVoteApi.canUserVote(proposal, currentUserId);
    if (!canVote.canVote) {
      setError(canVote.reason);
      return;
    }

    setSelectedProposal(proposal);
    setVoteDialogOpen(true);
  };

  // Open proposal details
  const openProposalDetails = async (proposal) => {
    setSelectedProposal(proposal);
    if (!voteData.proposalDetails[proposal.id]) {
      await loadProposalDetails(proposal.id);
    }
    setDetailDialogOpen(true);
  };

  // Proposal Card Component
  const ProposalCard = ({ proposal, showVoteButton = true }) => {
    const canVote = maintenanceVoteApi.canUserVote(proposal, currentUserId);
    const canEdit = maintenanceVoteApi.canUserEditProposal(proposal, currentUserId);
    const votingStats = proposal.votes ? maintenanceVoteApi.calculateVotingStatistics(proposal.votes) : null;

    return (
      <Card sx={{ mb: 2, border: `2px solid ${proposal.priorityInfo.color}20` }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: proposal.maintenanceTypeInfo.color }}>
              {proposal.maintenanceTypeInfo.icon}
            </Avatar>
          }
          action={
            <Box>
              <Chip
                label={proposal.priorityInfo.name}
                sx={{
                  backgroundColor: proposal.priorityInfo.color,
                  color: 'white',
                  mr: 1
                }}
                size="small"
              />
              <Chip
                label={proposal.statusInfo.name}
                sx={{
                  backgroundColor: proposal.statusInfo.bgColor,
                  color: proposal.statusInfo.color
                }}
                size="small"
              />
            </Box>
          }
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {proposal.title}
              </Typography>
              {proposal.isExpired && (
                <Chip label="Hết hạn" color="error" size="small" sx={{ ml: 1 }} />
              )}
            </Box>
          }
          subheader={
            <Box>
              <Typography variant="body2" color="textSecondary">
                {proposal.maintenanceTypeInfo.name} • {proposal.formattedEstimatedCost}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Đề xuất: {proposal.formattedCreatedAt}
                {proposal.formattedDeadline && ` • Hạn chót: ${proposal.formattedDeadline}`}
              </Typography>
            </Box>
          }
        />

        <CardContent>
          <Typography variant="body1" gutterBottom>
            {proposal.description}
          </Typography>

          <Typography variant="body2" color="textSecondary" gutterBottom>
            <strong>Lý do đề xuất:</strong> {proposal.proposalReason}
          </Typography>

          {votingStats && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                <People sx={{ fontSize: 16, mr: 0.5 }} />
                Tình hình bình chọn: {votingStats.totalVotes} phiếu
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Box textAlign="center" p={1} bgcolor="success.light" borderRadius={1}>
                    <Typography variant="body2" color="success.contrastText">
                      <ThumbUp sx={{ fontSize: 16 }} /> {votingStats.approveVotes}
                    </Typography>
                    <Typography variant="caption">Đồng ý</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={1} bgcolor="error.light" borderRadius={1}>
                    <Typography variant="body2" color="error.contrastText">
                      <ThumbDown sx={{ fontSize: 16 }} /> {votingStats.rejectVotes}
                    </Typography>
                    <Typography variant="caption">Từ chối</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={1} bgcolor="warning.light" borderRadius={1}>
                    <Typography variant="body2" color="warning.contrastText">
                      <Warning sx={{ fontSize: 16 }} /> {votingStats.conditionalVotes}
                    </Typography>
                    <Typography variant="caption">Có điều kiện</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button
            size="small"
            startIcon={<Visibility />}
            onClick={() => openProposalDetails(proposal)}
          >
            Chi tiết
          </Button>

          {showVoteButton && canVote.canVote && (
            <Button
              size="small"
              variant="contained"
              startIcon={<HowToVote />}
              onClick={() => openVoteDialog(proposal)}
            >
              Bình chọn
            </Button>
          )}

          {canEdit.canEdit && (
            <Button
              size="small"
              color="error"
              startIcon={<Cancel />}
              onClick={() => {
                const reason = prompt('Lý do hủy đề xuất:');
                if (reason) {
                  handleCancelProposal(proposal.id, reason);
                }
              }}
            >
              Hủy
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  // Voting Statistics Chart
  const VotingStatsChart = () => {
    const proposals = [...voteData.pendingProposals, ...voteData.history];

    if (!proposals.length) return null;

    // Calculate statistics by type
    const typeStats = (maintenanceVoteApi.getMaintenanceTypes() || []).map(type => {
      const typeProposals = proposals.filter(p => p.maintenanceType === type.value);
      return {
        name: type.label,
        count: typeProposals.length,
        color: type.color
      };
    });

    // Calculate statistics by status
    const statusStats = (maintenanceVoteApi.getProposalStatuses() || []).map(status => {
      const statusProposals = proposals.filter(p => p.proposalStatus === status.value);
      return {
        name: status.label,
        count: statusProposals.length,
        color: status.color
      };
    });

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân bố theo loại bảo trì
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <RechartsPieChart data={typeStats}>
                    {typeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <RechartsTooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tình trạng đề xuất
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Proposal Dialog
  const ProposalDialog = () => (
    <Dialog open={proposalDialogOpen} onClose={() => setProposalDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Tạo đề xuất bảo trì</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Loại bảo trì</InputLabel>
              <Select
                value={proposalForm.maintenanceType}
                onChange={(e) => setProposalForm(prev => ({ ...prev, maintenanceType: e.target.value }))}
              >
                {(maintenanceVoteApi.getMaintenanceTypes() || []).map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: 8 }}>{type.icon}</span>
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Độ ưu tiên</InputLabel>
              <Select
                value={proposalForm.priority}
                onChange={(e) => setProposalForm(prev => ({ ...prev, priority: e.target.value }))}
              >
                {(maintenanceVoteApi.getPriorities() || []).map(priority => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Box display="flex" alignItems="center">
                      <span style={{ marginRight: 8 }}>{priority.icon}</span>
                      {priority.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tiêu đề đề xuất"
              value={proposalForm.title}
              onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Chi phí ước tính"
              type="number"
              value={proposalForm.estimatedCost}
              onChange={(e) => setProposalForm(prev => ({ ...prev, estimatedCost: e.target.value }))}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày đề xuất thực hiện"
                value={proposalForm.proposedDate}
                onChange={(date) => setProposalForm(prev => ({ ...prev, proposedDate: date }))}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả chi tiết"
              multiline
              rows={4}
              value={proposalForm.description}
              onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lý do đề xuất"
              multiline
              rows={3}
              value={proposalForm.proposalReason}
              onChange={(e) => setProposalForm(prev => ({ ...prev, proposalReason: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<Assignment />}
            >
              Tài liệu hỗ trợ ({(proposalForm.supportingDocuments || []).length} file)
              <input
                type="file"
                hidden
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setProposalForm(prev => ({
                  ...prev,
                  supportingDocuments: Array.from(e.target.files)
                }))}
              />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setProposalDialogOpen(false)}>Hủy</Button>
        <Button onClick={handleProposalSubmit} variant="contained" disabled={loading}>
          Tạo đề xuất
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Vote Dialog
  const VoteDialog = () => (
    <Dialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        Bình chọn đề xuất: {selectedProposal?.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormLabel component="legend">Quyết định bình chọn</FormLabel>
          <RadioGroup
            value={voteForm.voteDecision}
            onChange={(e) => setVoteForm(prev => ({ ...prev, voteDecision: parseInt(e.target.value) }))}
          >
            {(maintenanceVoteApi.getVoteDecisions() || []).map(decision => (
              <FormControlLabel
                key={decision.value}
                value={decision.value}
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center">
                    <span style={{ marginRight: 8 }}>{decision.icon}</span>
                    {decision.label}
                  </Box>
                }
              />
            ))}
          </RadioGroup>

          <TextField
            fullWidth
            label="Lý do bình chọn"
            multiline
            rows={3}
            value={voteForm.voteReason}
            onChange={(e) => setVoteForm(prev => ({ ...prev, voteReason: e.target.value }))}
            sx={{ mt: 2 }}
          />

          {voteForm.voteDecision === 2 && (
            <TextField
              fullWidth
              label="Yêu cầu điều kiện"
              multiline
              rows={2}
              value={voteForm.conditionalRequirements}
              onChange={(e) => setVoteForm(prev => ({ ...prev, conditionalRequirements: e.target.value }))}
              sx={{ mt: 2 }}
              helperText="Điều kiện cần thiết để bạn chấp nhận đề xuất này"
            />
          )}

          {voteForm.voteDecision === 0 && (
            <TextField
              fullWidth
              label="Đề xuất thay thế"
              multiline
              rows={2}
              value={voteForm.suggestedAlternatives}
              onChange={(e) => setVoteForm(prev => ({ ...prev, suggestedAlternatives: e.target.value }))}
              sx={{ mt: 2 }}
              helperText="Gợi ý giải pháp thay thế (tùy chọn)"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVoteDialogOpen(false)}>Hủy</Button>
        <Button onClick={handleVoteSubmit} variant="contained" disabled={loading}>
          Bình chọn
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Proposal Detail Dialog
  const ProposalDetailDialog = () => {
    const proposal = selectedProposal && voteData.proposalDetails[selectedProposal.id]
      ? voteData.proposalDetails[selectedProposal.id]
      : selectedProposal;

    return (
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết đề xuất bảo trì
        </DialogTitle>
        <DialogContent>
          {proposal && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{proposal.title}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {proposal.maintenanceTypeInfo.name} • Độ ưu tiên: {proposal.priorityInfo.name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Chi phí ước tính:</strong> {proposal.formattedEstimatedCost}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Ngày đề xuất thực hiện:</strong> {proposal.formattedProposedDate}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Mô tả:</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {proposal.description}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Lý do đề xuất:</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {proposal.proposalReason}
                  </Typography>
                </Grid>

                {proposal.votes && proposal.votes.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Kết quả bình chọn
                    </Typography>
                    <List>
                      {(proposal.votes || []).map((vote, index) => {
                        const formattedVote = maintenanceVoteApi.formatVoteForDisplay(vote);
                        return (
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: formattedVote.decisionInfo.color }}>
                                {formattedVote.decisionInfo.icon}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${vote.voterName} - ${formattedVote.voteDecisionName}`}
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    {vote.voteReason}
                                  </Typography>
                                  {vote.conditionalRequirements && (
                                    <Typography variant="body2" color="warning.main">
                                      Điều kiện: {vote.conditionalRequirements}
                                    </Typography>
                                  )}
                                  <Typography variant="caption" color="textSecondary">
                                    {formattedVote.formattedCreatedAt}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          <HowToVote sx={{ mr: 2, verticalAlign: 'middle' }} />
          Quản lý bỏ phiếu bảo trì
        </Typography>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Action Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setProposalDialogOpen(true)}
          >
            Tạo đề xuất mới
          </Button>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Lọc theo trạng thái</InputLabel>
            <Select
              value={filterForm.status}
              onChange={(e) => setFilterForm(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {(maintenanceVoteApi.getProposalStatuses() || []).map(status => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab
              label={
                <Badge badgeContent={voteData.pendingProposals.length} color="error">
                  <Box display="flex" alignItems="center">
                    <Pending sx={{ mr: 1 }} />
                    Đang chờ
                  </Box>
                </Badge>
              }
            />
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  <History sx={{ mr: 1 }} />
                  Lịch sử
                </Box>
              }
            />
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  <PieChart sx={{ mr: 1 }} />
                  Thống kê
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Đề xuất đang chờ bình chọn ({(voteData.pendingProposals || []).length})
            </Typography>
            {(voteData.pendingProposals || []).length === 0 ? (
              <Alert severity="info">Không có đề xuất nào đang chờ bình chọn</Alert>
            ) : (
              (voteData.pendingProposals || []).map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} showVoteButton={true} />
              ))
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Lịch sử đề xuất ({(voteData.history || []).length})
            </Typography>
            {(voteData.history || []).length === 0 ? (
              <Alert severity="info">Chưa có lịch sử đề xuất nào</Alert>
            ) : (
              (voteData.history || []).map(proposal => (
                <ProposalCard key={proposal.id} proposal={proposal} showVoteButton={false} />
              ))
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Thống kê bỏ phiếu bảo trì
            </Typography>
            <VotingStatsChart />
          </Box>
        )}

        {/* Dialogs */}
        <ProposalDialog />
        <VoteDialog />
        <ProposalDetailDialog />

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess('')}
        >
          <Alert onClose={() => setSuccess('')} severity="success">
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default MaintenanceVoteManagement;