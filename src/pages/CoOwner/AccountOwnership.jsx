import React from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Stack, Snackbar, Alert,
  Stepper, Step, StepLabel, StepContent, Box, Chip, Avatar, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tooltip, FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import {
  Upload, CheckCircle, Warning, Info, AccountCircle, DirectionsCar,
  Group, Payment, Verified, CloudUpload, Description, Security
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import coOwnerApi from '../../api/coowner';
import fileUploadApi from '../../api/fileUploadApi';
import licenseApi from '../../api/licenseApi';

export default function AccountOwnership() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // Profile completion state
  const [profile, setProfile] = React.useState({
    verified: false,
    completionRate: 0,
    documents: []
  });

  // Available vehicles and ownership requests
  const [availableVehicles, setAvailableVehicles] = React.useState([]);
  const [myOwnerships, setMyOwnerships] = React.useState([]);
  const [ownershipRequests, setOwnershipRequests] = React.useState([]);

  // Form states
  const [selectedVehicle, setSelectedVehicle] = React.useState('');
  const [ownershipForm, setOwnershipForm] = React.useState({
    vehicleId: '',
    ownershipPercentage: 25,
    investmentAmount: 0,
    notes: ''
  });

  const [openRequestDialog, setOpenRequestDialog] = React.useState(false);

  React.useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load all data from PostgreSQL
      const [profileRes, vehiclesRes, ownershipsRes, requestsRes] = await Promise.all([
        coOwnerApi.profile.get(),
        coOwnerApi.vehicles.getAvailable(),
        coOwnerApi.getOwnerships(),
        coOwnerApi.getOwnershipRequests()
      ]);

      setProfile(profileRes?.data || { verified: false, completionRate: 0, documents: [] });
      setAvailableVehicles(vehiclesRes?.data || []);
      setMyOwnerships(ownershipsRes?.data || []);
      setOwnershipRequests(requestsRes?.data || []);

      console.log('Loaded vehicles from API:', vehiclesRes?.data);

      setMyOwnerships(ownershipsRes && Array.isArray(ownershipsRes.data) ? ownershipsRes.data : []);
      setOwnershipRequests(requestsRes && Array.isArray(requestsRes.data) ? requestsRes.data : []);

      // Calculate completion rate
      const completionRate = calculateProfileCompletion(safeProfile);
      setProfile(prev => ({ ...prev, completionRate }));

    } catch (err) {
      console.error('Error loading data:', err);
      setError('🚨 Không thể kết nối backend API. Vui lòng khởi động backend server tại https://localhost:7279');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profileData) => {
    if (!profileData) return 0;
    let completed = 0;
    const total = 5; // Total verification steps

    if (profileData.emailVerified) completed++;
    if (profileData.phoneVerified) completed++;
    if (profileData.licenseVerified) completed++;
    if (profileData.identityVerified) completed++;
    if (profileData.documentsUploaded) completed++;

    return Math.round((completed / total) * 100);
  };

  const handleCreateOwnershipRequest = async () => {
    if (!ownershipForm.vehicleId) {
      setError('Vui lòng chọn xe');
      return;
    }

    setLoading(true);
    try {
      await coOwnerApi.createOwnershipRequest(ownershipForm);
      setMessage('Gửi yêu cầu sở hữu thành công!');
      setOpenRequestDialog(false);
      setOwnershipForm({ vehicleId: '', ownershipPercentage: 25, investmentAmount: 0, notes: '' });
      await loadInitialData();
    } catch (err) {
      let msg = 'Gửi yêu cầu thất bại';
      if (err && err.response && err.response.data && typeof err.response.data.message === 'string') {
        msg = err.response.data.message;
      } else if (err && err.message) {
        msg = 'Lỗi: ' + err.message;
      } else if (!err) {
        msg = 'Lỗi không xác định khi gửi yêu cầu.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Bạn có chắc muốn hủy yêu cầu này?')) return;

    try {
      await coOwnerApi.cancelOwnershipRequest(requestId);
      setMessage('Hủy yêu cầu thành công');
      await loadInitialData();
    } catch (err) {
      let msg = 'Hủy yêu cầu thất bại';
      if (err && err.response && err.response.data && typeof err.response.data.message === 'string') {
        msg = err.response.data.message;
      } else if (err && err.message) {
        msg = 'Lỗi: ' + err.message;
      } else if (!err) {
        msg = 'Lỗi không xác định khi hủy yêu cầu.';
      }
      setError(msg);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle />;
      case 'Pending': return <Info />;
      case 'Rejected': return <Warning />;
      default: return null;
    }
  };

  const steps = [
    {
      label: 'Thông tin cá nhân',
      description: 'Hoàn thiện và xác thực thông tin cá nhân',
      icon: <AccountCircle />
    },
    {
      label: 'Tài sản sở hữu',
      description: 'Quản lý các phương tiện đang sở hữu',
      icon: <DirectionsCar />
    },
    {
      label: 'Yêu cầu sở hữu mới',
      description: 'Đăng ký tham gia sở hữu chung xe mới',
      icon: <Group />
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Header with Profile Summary */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <AccountCircle sx={{ fontSize: 40 }} />
              </Avatar>
              <Box flex={1}>
                <Typography variant="h5">Chào mừng, {user?.fullName || 'Co-Owner'}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  Quản lý thông tin và quyền sở hữu xe của bạn
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Độ hoàn thiện hồ sơ:</Typography>
                  <Box sx={{ width: 200, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={profile.completionRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: 'white' }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {profile.completionRate}%
                  </Typography>
                </Box>
              </Box>
              {profile.verified && (
                <Chip
                  icon={<Verified />}
                  label="Đã xác thực"
                  sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)', color: 'white' }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Navigation Steps */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="horizontal">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    icon={step.icon}
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{step.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </Grid>

      {/* Step Content */}
      <Grid item xs={12}>
        {activeStep === 0 && <ProfileVerificationStep profile={profile} onUpdate={loadInitialData} />}
        {activeStep === 1 && <MyOwnershipStep ownerships={myOwnerships} />}
        {activeStep === 2 && (
          <OwnershipRequestStep
            vehicles={availableVehicles}
            requests={ownershipRequests}
            onCreateRequest={() => setOpenRequestDialog(true)}
            onCancelRequest={handleCancelRequest}
          />
        )}
      </Grid>

      {/* Create Ownership Request Dialog */}
      <Dialog open={openRequestDialog} onClose={() => setOpenRequestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Group color="primary" />
            Đăng ký tham gia sở hữu chung
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chọn xe</InputLabel>
                <Select
                  value={ownershipForm.vehicleId}
                  onChange={(e) => setOwnershipForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                >
                  {availableVehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DirectionsCar color="action" />
                        <Box>
                          <Typography>{vehicle.make} {vehicle.model}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {vehicle.licensePlate} • {vehicle.year}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Tỷ lệ sở hữu muốn đăng ký (%)"
                value={ownershipForm.ownershipPercentage}
                onChange={(e) => setOwnershipForm(prev => ({
                  ...prev,
                  ownershipPercentage: Math.max(1, Math.min(100, parseInt(e.target.value) || 0))
                }))}
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Số tiền đầu tư (VNĐ)"
                value={ownershipForm.investmentAmount}
                onChange={(e) => setOwnershipForm(prev => ({
                  ...prev,
                  investmentAmount: parseInt(e.target.value) || 0
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú (tùy chọn)"
                value={ownershipForm.notes}
                onChange={(e) => setOwnershipForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Lý do tham gia, kế hoạch sử dụng xe..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Hủy</Button>
          <Button
            onClick={handleCreateOwnershipRequest}
            variant="contained"
            disabled={loading || !ownershipForm.vehicleId}
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
        <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Grid>
  );
}

// Profile Verification Step Component
function ProfileVerificationStep({ profile, onUpdate }) {
  const [documents, setDocuments] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await coOwnerApi.getDocuments();
      if (res && Array.isArray(res.data)) {
        setDocuments(res.data);
      } else if (res && res.data) {
        setDocuments([res.data]);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleFileUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = fileUploadApi.createFormData(file, {
        documentType,
        category: 'ownership'
      });

      await fileUploadApi.upload(formData);
      await loadDocuments();
      await onUpdate();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const verificationItems = [
    {
      title: 'Xác thực email',
      description: 'Xác nhận địa chỉ email của bạn',
      status: profile.emailVerified,
      icon: <Security />
    },
    {
      title: 'Xác thực số điện thoại',
      description: 'Xác nhận số điện thoại để nhận thông báo',
      status: profile.phoneVerified,
      icon: <Security />
    },
    {
      title: 'CCCD/CMND',
      description: 'Upload ảnh CCCD/CMND rõ nét',
      status: profile.identityVerified,
      icon: <Description />
    },
    {
      title: 'Giấy phép lái xe',
      description: 'Upload ảnh giấy phép lái xe còn hiệu lực',
      status: profile.licenseVerified,
      icon: <Description />
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Xác thực thông tin cá nhân
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hoàn thiện các bước xác thực để có thể tham gia sở hữu chung xe
        </Typography>

        <Grid container spacing={2}>
          {verificationItems.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                variant="outlined"
                sx={{
                  border: item.status ? '2px solid #4caf50' : '2px solid #e0e0e0',
                  bgcolor: item.status ? 'rgba(76, 175, 80, 0.05)' : 'inherit'
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: item.status ? 'success.main' : 'grey.300',
                        color: item.status ? 'white' : 'grey.600'
                      }}
                    >
                      {item.status ? <CheckCircle /> : item.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                    {item.status ? (
                      <Chip label="Đã xác thực" color="success" size="small" />
                    ) : (
                      <Button
                        component="label"
                        size="small"
                        variant="outlined"
                        disabled={uploading}
                      >
                        Upload
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, item.title)}
                        />
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

// My Ownership Step Component
function MyOwnershipStep({ ownerships }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tài sản sở hữu hiện tại
        </Typography>

        {ownerships.length === 0 ? (
          <Box textAlign="center" py={4}>
            <DirectionsCar sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Chưa có tài sản sở hữu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đăng ký tham gia sở hữu chung để bắt đầu
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Xe</TableCell>
                  <TableCell>Tỷ lệ sở hữu</TableCell>
                  <TableCell>Giá trị đầu tư</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tham gia</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ownerships.map((ownership) => (
                  <TableRow key={ownership.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DirectionsCar color="action" />
                        <Box>
                          <Typography variant="subtitle2">
                            {ownership.vehicle?.make} {ownership.vehicle?.model}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ownership.vehicle?.licensePlate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        {ownership.ownershipPercentage}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {ownership.investmentAmount?.toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ownership.status}
                        color={ownership.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(ownership.joinDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

// Ownership Request Step Component
function OwnershipRequestStep({ vehicles, requests, onCreateRequest, onCancelRequest }) {
  return (
    <Grid container spacing={3}>
      {/* Available Vehicles */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Xe có thể tham gia</Typography>
              <Button variant="contained" onClick={onCreateRequest}>
                Gửi yêu cầu
              </Button>
            </Box>

            {vehicles.length === 0 ? (
              <Box textAlign="center" py={2}>
                <Typography color="text.secondary">
                  Hiện không có xe nào có thể tham gia
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <DirectionsCar />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle1">
                            {vehicle.make} {vehicle.model}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vehicle.licensePlate} • {vehicle.year}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Còn lại: {100 - (vehicle.ownedPercentage || 0)}% có thể sở hữu
                          </Typography>
                        </Box>
                        <Chip
                          label={vehicle.status || 'Available'}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* My Requests */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Yêu cầu của tôi
            </Typography>

            {requests.length === 0 ? (
              <Box textAlign="center" py={2}>
                <Typography color="text.secondary">
                  Chưa có yêu cầu nào
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {requests.map((request) => (
                  <Card key={request.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'grey.300' }}>
                          <Group />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle1">
                            {request.vehicle?.make} {request.vehicle?.model}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tỷ lệ: {request.ownershipPercentage}% •
                            Đầu tư: {request.investmentAmount?.toLocaleString('vi-VN')} VNĐ
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(request.requestDate).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            icon={getStatusIcon(request.status)}
                            label={request.status}
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                          {request.status === 'Pending' && (
                            <Tooltip title="Hủy yêu cầu">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onCancelRequest(request.id)}
                              >
                                <Warning />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                      {request.notes && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          "{request.notes}"
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Approved': return 'success';
    case 'Pending': return 'warning';
    case 'Rejected': return 'error';
    default: return 'default';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'Approved': return <CheckCircle />;
    case 'Pending': return <Info />;
    case 'Rejected': return <Warning />;
    default: return null;
  }
}