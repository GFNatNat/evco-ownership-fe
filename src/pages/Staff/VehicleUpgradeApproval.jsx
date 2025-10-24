import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Badge, LinearProgress, Avatar, Stepper, Step, StepLabel
} from '@mui/material';
import {
  Upgrade as UpgradeIcon, HowToVote as VoteIcon, CheckCircle as ApproveIcon,
  Cancel as RejectIcon, Visibility as ViewIcon, Edit as EditIcon,
  AttachMoney as MoneyIcon, Schedule as ScheduleIcon, Group as GroupIcon
} from '@mui/icons-material';
import vehicleUpgradeApi from '../../api/vehicleUpgradeApi';

const VehicleUpgradeApproval = () => {
  const [proposals, setProposals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState('approve'); // 'approve' or 'reject'
  const [approvalNotes, setApprovalNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockProposals = [
        {
          proposalId: 1,
          vehicleId: 1,
          vehicleName: 'Toyota Camry 2023',
          upgradeType: 0, // BatteryUpgrade
          title: 'Nâng cấp pin xe Toyota Camry',
          description: 'Nâng cấp pin lithium mới với dung lượng cao hơn',
          estimatedCost: 50000000,
          justification: 'Pin hiện tại đã giảm hiệu suất, cần thay thế để đảm bảo hiệu quả vận hành',
          proposedInstallationDate: '2024-12-01',
          estimatedDurationDays: 3,
          status: 'Pending',
          proposerInfo: {
            proposerId: 1,
            proposerName: 'Nguyễn Văn A',
            proposedAt: '2024-10-20T10:00:00Z'
          },
          votingInfo: {
            totalCoOwners: 5,
            votedCount: 3,
            approvedCount: 2,
            rejectedCount: 1,
            votingDeadline: '2024-11-30T23:59:59Z',
            userCanVote: false,
            userHasVoted: true,
            status: 'Pending'
          }
        },
        {
          proposalId: 2,
          vehicleId: 2,
          vehicleName: 'Honda Civic 2022',
          upgradeType: 2, // TechnologyUpgrade
          title: 'Lắp đặt hệ thống giải trí mới',
          description: 'Nâng cấp màn hình cảm ứng và hệ thống âm thanh',
          estimatedCost: 25000000,
          justification: 'Hệ thống hiện tại đã lỗi thời, cần nâng cấp để tăng trải nghiệm người dùng',
          proposedInstallationDate: '2024-11-15',
          estimatedDurationDays: 1,
          status: 'Approved',
          proposerInfo: {
            proposerId: 2,
            proposerName: 'Trần Thị B',
            proposedAt: '2024-10-15T14:30:00Z'
          },
          votingInfo: {
            totalCoOwners: 4,
            votedCount: 4,
            approvedCount: 3,
            rejectedCount: 1,
            votingDeadline: '2024-10-25T23:59:59Z',
            userCanVote: false,
            userHasVoted: true,
            status: 'Approved'
          }
        }
      ];

      const mockStatistics = {
        totalProposals: 15,
        pendingProposals: 5,
        approvedProposals: 8,
        rejectedProposals: 2,
        upgradeTypeBreakdown: [
          { upgradeTypeName: 'Nâng cấp pin', count: 6, totalCost: 300000000, executedCount: 4, executedCost: 200000000 },
          { upgradeTypeName: 'Gói bảo hiểm', count: 3, totalCost: 45000000, executedCount: 2, executedCost: 30000000 },
          { upgradeTypeName: 'Nâng cấp công nghệ', count: 4, totalCost: 80000000, executedCount: 2, executedCost: 50000000 },
          { upgradeTypeName: 'Nâng cấp nội thất', count: 2, totalCost: 40000000, executedCount: 0, executedCost: 0 }
        ]
      };

      setProposals(mockProposals);
      setStatistics(mockStatistics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
    setDetailDialogOpen(true);
  };

  const handleApprovalAction = (proposal, action) => {
    setSelectedProposal(proposal);
    setApprovalAction(action);
    setApprovalNotes('');
    setApprovalDialogOpen(true);
  };

  const handleSubmitApproval = async () => {
    try {
      const approvalData = {
        isApprove: approvalAction === 'approve',
        staffNotes: approvalNotes,
        reviewedAt: new Date().toISOString()
      };

      // In real implementation, this would be a staff approval API
      console.log('Staff approval:', selectedProposal.proposalId, approvalData);
      
      alert(`Đề xuất đã được ${approvalAction === 'approve' ? 'phê duyệt' : 'từ chối'} thành công!`);
      setApprovalDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error submitting approval:', error);
      alert('Có lỗi xảy ra khi xử lý phê duyệt');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Executed': return 'info';
      default: return 'default';
    }
  };

  const getVotingProgress = (votingInfo) => {
    if (!votingInfo) return 0;
    return (votingInfo.votedCount / votingInfo.totalCoOwners) * 100;
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Phê duyệt Nâng cấp xe
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {statistics?.totalProposals || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng đề xuất
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {statistics?.pendingProposals || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ phê duyệt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {statistics?.approvedProposals || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã phê duyệt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {statistics?.rejectedProposals || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã từ chối
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Chờ phê duyệt" />
        <Tab label="Đã xử lý" />
        <Tab label="Thống kê" />
      </Tabs>

      {/* Tab: Pending Approval */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Xe</TableCell>
                <TableCell>Loại nâng cấp</TableCell>
                <TableCell>Chi phí ước tính</TableCell>
                <TableCell>Tiến độ bỏ phiếu</TableCell>
                <TableCell>Thời hạn</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals
                .filter(p => p.status === 'Pending')
                .map((proposal) => (
                  <TableRow key={proposal.proposalId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {proposal.vehicleName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {proposal.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={vehicleUpgradeApi.getUpgradeTypeInfo(proposal.upgradeType).label}
                        size="small"
                        sx={{ bgcolor: vehicleUpgradeApi.getUpgradeTypeInfo(proposal.upgradeType).color + '20' }}
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(proposal.estimatedCost)}</TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={getVotingProgress(proposal.votingInfo)} 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption">
                          {proposal.votingInfo?.votedCount || 0}/{proposal.votingInfo?.totalCoOwners || 0} phiếu
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getDaysRemaining(proposal.votingInfo?.votingDeadline)} ngày
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(proposal)}>
                        <ViewIcon />
                      </IconButton>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleApprovalAction(proposal, 'approve')}
                        sx={{ ml: 1 }}
                      >
                        Phê duyệt
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleApprovalAction(proposal, 'reject')}
                        sx={{ ml: 1 }}
                      >
                        Từ chối
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: Processed */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Xe</TableCell>
                <TableCell>Loại nâng cấp</TableCell>
                <TableCell>Chi phí</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày xử lý</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals
                .filter(p => p.status !== 'Pending')
                .map((proposal) => (
                  <TableRow key={proposal.proposalId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {proposal.vehicleName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {proposal.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={vehicleUpgradeApi.getUpgradeTypeInfo(proposal.upgradeType).label}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatCurrency(proposal.estimatedCost)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={proposal.status}
                        color={getStatusColor(proposal.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(proposal.proposerInfo?.proposedAt)}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDetails(proposal)}>
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: Statistics */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê theo loại nâng cấp
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Loại nâng cấp</TableCell>
                        <TableCell>Số đề xuất</TableCell>
                        <TableCell>Tổng chi phí</TableCell>
                        <TableCell>Đã thực hiện</TableCell>
                        <TableCell>Chi phí thực tế</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statistics?.upgradeTypeBreakdown?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.upgradeTypeName}</TableCell>
                          <TableCell>{item.count}</TableCell>
                          <TableCell>{formatCurrency(item.totalCost)}</TableCell>
                          <TableCell>{item.executedCount}</TableCell>
                          <TableCell>{formatCurrency(item.executedCost)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đề xuất nâng cấp</DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedProposal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Xe: {selectedProposal.vehicleName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Mô tả:</Typography>
                <Typography variant="body2" paragraph>
                  {selectedProposal.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Lý do:</Typography>
                <Typography variant="body2" paragraph>
                  {selectedProposal.justification}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Chi phí ước tính:</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(selectedProposal.estimatedCost)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Ngày lắp đặt dự kiến:</Typography>
                <Typography variant="body2">
                  {formatDate(selectedProposal.proposedInstallationDate)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Tiến độ bỏ phiếu:</Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={getVotingProgress(selectedProposal.votingInfo)} 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">
                    {selectedProposal.votingInfo?.approvedCount || 0} đồng ý, {' '}
                    {selectedProposal.votingInfo?.rejectedCount || 0} từ chối, {' '}
                    {(selectedProposal.votingInfo?.totalCoOwners || 0) - (selectedProposal.votingInfo?.votedCount || 0)} chưa bỏ phiếu
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
          {selectedProposal?.status === 'Pending' && (
            <>
              <Button 
                color="success" 
                onClick={() => handleApprovalAction(selectedProposal, 'approve')}
              >
                Phê duyệt
              </Button>
              <Button 
                color="error" 
                onClick={() => handleApprovalAction(selectedProposal, 'reject')}
              >
                Từ chối
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'} đề xuất
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Ghi chú của Staff"
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            sx={{ mt: 2 }}
            placeholder={
              approvalAction === 'approve' 
                ? 'Nhập ghi chú phê duyệt (tùy chọn)...'
                : 'Nhập lý do từ chối...'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleSubmitApproval} 
            variant="contained"
            color={approvalAction === 'approve' ? 'success' : 'error'}
          >
            {approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleUpgradeApproval;