import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Pending,
  History,
  TrendingUp,
  TrendingDown,
  Info,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';

import ownershipChangeApi from '../../api/ownershipChangeApi';
import vehicleApi from '../../api/vehicleApi';
import coOwnerApi from '../../api/coOwnerApi';

/**
 * Ownership Change Management Page
 * Handles proposing, approving, and tracking ownership percentage changes
 * Following README 22 specifications
 */
function OwnershipChangeManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [requests, setRequests] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [coOwners, setCoOwners] = useState([]);

  // Dialog states
  const [proposeDialog, setProposeDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState({ open: false, request: null });
  const [responseDialog, setResponseDialog] = useState({ open: false, request: null });

  // Form states
  const [proposeForm, setProposeForm] = useState({
    vehicleId: '',
    reason: '',
    proposedChanges: []
  });

  const [responseForm, setResponseForm] = useState({
    approve: true,
    comments: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load vehicles
      const vehiclesResponse = await vehicleApi.getAll();
      setVehicles(vehiclesResponse.data.data || []);

      // Load my requests
      const myRequestsResponse = await ownershipChangeApi.getMyRequests(true);
      setMyRequests(myRequestsResponse.data.data || []);

      // Load pending approvals
      const pendingResponse = await ownershipChangeApi.getPendingApprovals();
      setPendingApprovals(pendingResponse.data.data || []);

    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Lỗi khi tải dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load vehicle requests
  const loadVehicleRequests = async (vehicleId) => {
    try {
      const response = await ownershipChangeApi.getVehicleRequests(vehicleId, true);
      setRequests(response.data.data || []);
    } catch (err) {
      setError('Lỗi khi tải danh sách yêu cầu: ' + err.message);
    }
  };

  // Load co-owners for a vehicle
  const loadCoOwners = async (vehicleId) => {
    try {
      const response = await coOwnerApi.getByVehicle(vehicleId);
      const coOwnersData = response.data.data || [];
      setCoOwners(coOwnersData);
      
      // Initialize proposed changes with current ownership
      const changes = coOwnersData.map(coOwner => ({
        coOwnerId: coOwner.coOwnerId,
        coOwnerName: coOwner.userName,
        currentPercentage: coOwner.ownershipPercentage,
        proposedPercentage: coOwner.ownershipPercentage,
        proposedInvestment: coOwner.investmentAmount
      }));
      
      setProposeForm(prev => ({ ...prev, proposedChanges: changes }));
    } catch (err) {
      setError('Lỗi khi tải danh sách chủ sở hữu: ' + err.message);
    }
  };

  // Handle vehicle selection for propose form
  const handleVehicleSelect = (vehicleId) => {
    setProposeForm(prev => ({ ...prev, vehicleId }));
    if (vehicleId) {
      loadCoOwners(vehicleId);
      loadVehicleRequests(vehicleId);
    }
  };

  // Handle proposed change update
  const handleProposedChangeUpdate = (index, field, value) => {
    setProposeForm(prev => ({
      ...prev,
      proposedChanges: prev.proposedChanges.map((change, i) => 
        i === index ? { ...change, [field]: parseFloat(value) || 0 } : change
      )
    }));
  };

  // Handle propose ownership change
  const handleProposeChange = async () => {
    try {
      // Validate form
      const validation = ownershipChangeApi.validateChangeProposal(proposeForm);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Format proposed changes
      const formattedChanges = ownershipChangeApi.formatProposedChanges(proposeForm.proposedChanges);

      await ownershipChangeApi.proposeChange({
        vehicleId: proposeForm.vehicleId,
        reason: proposeForm.reason,
        proposedChanges: formattedChanges
      });

      setSuccess('Đề xuất thay đổi quyền sở hữu đã được gửi thành công');
      setProposeDialog(false);
      setProposeForm({ vehicleId: '', reason: '', proposedChanges: [] });
      loadInitialData();

    } catch (err) {
      setError('Lỗi khi gửi đề xuất: ' + err.message);
    }
  };

  // Handle view request details
  const handleViewDetails = async (requestId) => {
    try {
      const response = await ownershipChangeApi.getRequestDetails(requestId);
      setDetailDialog({ open: true, request: response.data.data });
    } catch (err) {
      setError('Lỗi khi tải chi tiết yêu cầu: ' + err.message);
    }
  };

  // Handle respond to request
  const handleRespondToRequest = async () => {
    try {
      await ownershipChangeApi.respondToRequest(responseDialog.request.requestId, responseForm);
      
      setSuccess(`Đã ${responseForm.approve ? 'phê duyệt' : 'từ chối'} yêu cầu thành công`);
      setResponseDialog({ open: false, request: null });
      setResponseForm({ approve: true, comments: '' });
      loadInitialData();

    } catch (err) {
      setError('Lỗi khi phản hồi yêu cầu: ' + err.message);
    }
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Bạn có chắc muốn hủy yêu cầu này?')) {
      return;
    }

    try {
      await ownershipChangeApi.cancelRequest(requestId);
      setSuccess('Đã hủy yêu cầu thành công');
      loadInitialData();
    } catch (err) {
      setError('Lỗi khi hủy yêu cầu: ' + err.message);
    }
  };

  // Get status color
  const getStatusColor = (status) => ownershipChangeApi.getStatusColor(status);

  // Calculate total percentage
  const getTotalPercentage = () => {
    return proposeForm.proposedChanges.reduce((sum, change) => sum + (change.proposedPercentage || 0), 0);
  };

  // Render propose dialog
  const renderProposeDialog = () => (
    <Dialog open={proposeDialog} onClose={() => setProposeDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>Đề xuất thay đổi quyền sở hữu</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Chọn xe</InputLabel>
              <Select
                value={proposeForm.vehicleId}
                onChange={(e) => handleVehicleSelect(e.target.value)}
                label="Chọn xe"
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Lý do thay đổi"
              value={proposeForm.reason}
              onChange={(e) => setProposeForm(prev => ({ ...prev, reason: e.target.value }))}
              multiline
              rows={3}
              fullWidth
              placeholder="Ví dụ: Điều chỉnh tỷ lệ sở hữu sau khi có đầu tư mới từ chủ sở hữu..."
            />
          </Grid>

          {proposeForm.proposedChanges.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Phân bổ quyền sở hữu mới
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Chủ sở hữu</TableCell>
                      <TableCell>Tỷ lệ hiện tại (%)</TableCell>
                      <TableCell>Tỷ lệ đề xuất (%)</TableCell>
                      <TableCell>Đầu tư đề xuất (VNĐ)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proposeForm.proposedChanges.map((change, index) => (
                      <TableRow key={change.coOwnerId}>
                        <TableCell>{change.coOwnerName}</TableCell>
                        <TableCell>{change.currentPercentage?.toFixed(2)}%</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={change.proposedPercentage || ''}
                            onChange={(e) => handleProposedChangeUpdate(index, 'proposedPercentage', e.target.value)}
                            size="small"
                            inputProps={{ min: 0, max: 100, step: 0.1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={change.proposedInvestment || ''}
                            onChange={(e) => handleProposedChangeUpdate(index, 'proposedInvestment', e.target.value)}
                            size="small"
                            inputProps={{ min: 0, step: 1000000 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={2} display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">
                  Tổng tỷ lệ: {getTotalPercentage().toFixed(2)}%
                </Typography>
                {Math.abs(getTotalPercentage() - 100) > 0.01 && (
                  <Typography variant="body2" color="error">
                    Tổng tỷ lệ phải bằng 100%
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setProposeDialog(false)}>Hủy</Button>
        <Button 
          onClick={handleProposeChange} 
          variant="contained"
          disabled={Math.abs(getTotalPercentage() - 100) > 0.01 || !proposeForm.vehicleId || !proposeForm.reason}
        >
          Gửi đề xuất
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render response dialog
  const renderResponseDialog = () => (
    <Dialog 
      open={responseDialog.open} 
      onClose={() => setResponseDialog({ open: false, request: null })} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        Phản hồi yêu cầu thay đổi quyền sở hữu
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Quyết định</InputLabel>
              <Select
                value={responseForm.approve}
                onChange={(e) => setResponseForm(prev => ({ ...prev, approve: e.target.value }))}
                label="Quyết định"
              >
                <MenuItem value={true}>Phê duyệt</MenuItem>
                <MenuItem value={false}>Từ chối</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Nhận xét"
              value={responseForm.comments}
              onChange={(e) => setResponseForm(prev => ({ ...prev, comments: e.target.value }))}
              multiline
              rows={3}
              fullWidth
              placeholder="Nhập lý do hoặc nhận xét về quyết định của bạn..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setResponseDialog({ open: false, request: null })}>
          Hủy
        </Button>
        <Button 
          onClick={handleRespondToRequest} 
          variant="contained"
          color={responseForm.approve ? 'success' : 'error'}
        >
          {responseForm.approve ? 'Phê duyệt' : 'Từ chối'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render request list
  const renderRequestList = (requestList, showActions = false) => (
    <List>
      {requestList.map((request) => (
        <ListItem key={request.requestId} divider>
          <ListItemIcon>
            {request.status === 'Pending' && <Pending color="warning" />}
            {request.status === 'Approved' && <CheckCircle color="success" />}
            {request.status === 'Rejected' && <Cancel color="error" />}
          </ListItemIcon>
          
          <ListItemText
            primary={`${request.vehicleName} (${request.licensePlate})`}
            secondary={
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Đề xuất bởi: {request.proposerName} • {ownershipChangeApi.formatDate(request.proposedDate)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Lý do: {request.reason}
                </Typography>
                <Chip 
                  label={request.status} 
                  color={getStatusColor(request.status)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            }
          />
          
          <ListItemSecondaryAction>
            <Box display="flex" gap={1}>
              <IconButton size="small" onClick={() => handleViewDetails(request.requestId)}>
                <Visibility />
              </IconButton>
              
              {showActions && request.status === 'Pending' && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setResponseDialog({ open: true, request })}
                >
                  Phản hồi
                </Button>
              )}
              
              {request.canCancel && (
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleCancelRequest(request.requestId)}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý thay đổi quyền sở hữu
      </Typography>

      {/* Action Button */}
      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setProposeDialog(true)}
        >
          Đề xuất thay đổi quyền sở hữu
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={`Chờ phê duyệt (${pendingApprovals.length})`} />
          <Tab label={`Yêu cầu của tôi (${myRequests.length})`} />
          <Tab label="Tất cả yêu cầu" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Yêu cầu cần phê duyệt
                  </Typography>
                  {pendingApprovals.length === 0 ? (
                    <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                      Không có yêu cầu nào cần phê duyệt
                    </Typography>
                  ) : (
                    renderRequestList(pendingApprovals, true)
                  )}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Yêu cầu của tôi
                  </Typography>
                  {myRequests.length === 0 ? (
                    <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                      Bạn chưa có yêu cầu nào
                    </Typography>
                  ) : (
                    renderRequestList(myRequests)
                  )}
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Tất cả yêu cầu
                  </Typography>
                  
                  <FormControl sx={{ mb: 2, minWidth: 200 }}>
                    <InputLabel>Chọn xe để xem</InputLabel>
                    <Select
                      value={proposeForm.vehicleId}
                      onChange={(e) => {
                        setProposeForm(prev => ({ ...prev, vehicleId: e.target.value }));
                        loadVehicleRequests(e.target.value);
                      }}
                      label="Chọn xe để xem"
                    >
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                          {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {requests.length === 0 ? (
                    <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                      {proposeForm.vehicleId ? 'Không có yêu cầu nào cho xe này' : 'Chọn xe để xem danh sách yêu cầu'}
                    </Typography>
                  ) : (
                    renderRequestList(requests)
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialogs */}
      {renderProposeDialog()}
      {renderResponseDialog()}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, request: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết yêu cầu thay đổi quyền sở hữu</DialogTitle>
        <DialogContent>
          {detailDialog.request && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Xe:</strong> {detailDialog.request.vehicleName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Biển số:</strong> {detailDialog.request.licensePlate}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Người đề xuất:</strong> {detailDialog.request.proposerName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Ngày đề xuất:</strong> {ownershipChangeApi.formatDate(detailDialog.request.proposedDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Trạng thái:</strong>
                  <Chip 
                    label={detailDialog.request.status} 
                    color={getStatusColor(detailDialog.request.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                {detailDialog.request.completedDate && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Ngày hoàn thành:</strong> {ownershipChangeApi.formatDate(detailDialog.request.completedDate)}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  <strong>Lý do:</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {detailDialog.request.reason}
                </Typography>
              </Grid>
              
              {detailDialog.request.proposedChanges && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Chi tiết thay đổi
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Chủ sở hữu</TableCell>
                          <TableCell>Tỷ lệ đề xuất (%)</TableCell>
                          <TableCell>Đầu tư đề xuất</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailDialog.request.proposedChanges.map((change) => (
                          <TableRow key={change.coOwnerId}>
                            <TableCell>{change.coOwnerName}</TableCell>
                            <TableCell>{change.proposedPercentage?.toFixed(2)}%</TableCell>
                            <TableCell>{ownershipChangeApi.formatCurrency(change.proposedInvestment)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, request: null })}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')}
          sx={{ mt: 2 }}
        >
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess('')}
          sx={{ mt: 2 }}
        >
          {success}
        </Alert>
      )}
    </Container>
  );
}

export default OwnershipChangeManagement;