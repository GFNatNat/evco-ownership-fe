import React from 'react';
import {
  Card, CardContent, Typography, Button, TextField, Stack, Grid, Box,
  Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, List, ListItem, ListItemAvatar, ListItemText, Divider,
  IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem,
  Stepper, Step, StepLabel, StepContent, LinearProgress, Tabs, Tab,
  Alert, Snackbar, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Badge
} from '@mui/material';
import {
  Description, Add, Visibility, Download, Send, Edit, Delete,
  PictureAsPdf, CheckCircle, Schedule, Warning, Person,
  Business, Assignment, Verified, CloudUpload
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import staffApi from '../../api/staff';
import { useAuth } from '../../context/AuthContext';

export default function Contracts() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [contracts, setContracts] = React.useState([]);
  const [templates, setTemplates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // Contract creation dialog
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [contractForm, setContractForm] = React.useState({
    title: '',
    type: 'ownership',
    customerId: '',
    templateId: '',
    file: null,
    notes: ''
  });

  // No mock data - all data from PostgreSQL database

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Only fetch from PostgreSQL database via API
      const [contractsRes, templatesRes] = await Promise.all([
        staffApi.contracts.getAll(),
        staffApi.contracts.getTemplate('all')
      ]);

      if (contractsRes && contractsRes.data) {
        setContracts(contractsRes.data);
      } else {
        setContracts([]);
      }

      if (templatesRes && templatesRes.data) {
        setTemplates(templatesRes.data);
      } else {
        setTemplates([]);
      }
    } catch (err) {
      console.error('Contracts API Error:', err);
      setError(`Lỗi kết nối database: ${err.message || 'Network error'}`);
      setContracts([]);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async () => {
    if (!contractForm.title || !contractForm.type) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const newContract = {
        id: `CT${String(contracts.length + 1).padStart(3, '0')}`,
        title: contractForm.title,
        type: contractForm.type,
        customerName: 'Khách hàng mới',
        customerEmail: 'customer@email.com',
        status: 'draft',
        createdDate: new Date(),
        signedDate: null,
        value: 0,
        staff: user?.name || 'Staff'
      };

      setContracts(prev => [newContract, ...prev]);
      setMessage('Tạo hợp đồng thành công!');
      setCreateDialogOpen(false);

      // Reset form
      setContractForm({
        title: '',
        type: 'ownership',
        customerId: '',
        templateId: '',
        file: null,
        notes: ''
      });
    } catch (err) {
      setError('Tạo hợp đồng thất bại');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'info';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'signed': return 'Đã ký';
      case 'pending': return 'Chờ ký';
      case 'draft': return 'Bản nháp';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'ownership': return 'Sở hữu chung';
      case 'rental': return 'Thuê xe';
      case 'maintenance': return 'Bảo trì';
      default: return type;
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Mã HĐ',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="primary" fontWeight="bold">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'title',
      headerName: 'Tiêu đề hợp đồng',
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getTypeLabel(params.row.type)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'customerName',
      headerName: 'Khách hàng',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.value}</Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.customerEmail}
          </Typography>
        </Box>
      )
    },
    {
      field: 'value',
      headerName: 'Giá trị',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="primary" fontWeight="bold">
          {params.value > 0 ? `${(params.value / 1000000).toFixed(0)}M VNĐ` : 'Chưa xác định'}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'createdDate',
      headerName: 'Ngày tầo',
      width: 120,
      renderCell: (params) => (
        <Typography variant="caption">
          {params.value.toLocaleDateString('vi-VN')}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Xem chi tiết">
            <IconButton size="small">
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Tải xuống">
            <IconButton size="small">
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === 'draft' && (
            <Tooltip title="Chỉnh sửa">
              <IconButton size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {params.row.status === 'draft' && (
            <Tooltip title="Gửi ký">
              <IconButton size="small" color="primary">
                <Send fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #5e35b1 0%, #512da8 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quản lý Hợp đồng
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Tạo, quản lý và theo dõi hợp đồng điện tử
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Tạo hợp đồng
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Tổng hợp đồng
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {contracts.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Description sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Đã ký
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {contracts.filter(c => c.status === 'signed').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CheckCircle sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Chờ ký
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {contracts.filter(c => c.status === 'pending').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <Schedule sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Bản nháp
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {contracts.filter(c => c.status === 'draft').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <Edit sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<Description />} label="Danh sách hợp đồng" />
            <Tab icon={<Assignment />} label="Mẫu hợp đồng" />
            <Tab icon={<Verified />} label="Xác thực chữ ký" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Danh sách hợp đồng ({contracts.length})
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <DataGrid
                    rows={contracts}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                  />
                </Box>
              </Box>
            )}

            {selectedTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Mẫu hợp đồng có sẵn
                </Typography>
                <Grid container spacing={2}>
                  {templates.map((template) => (
                    <Grid item xs={12} md={4} key={template.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <PictureAsPdf />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {template.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {getTypeLabel(template.type)}
                              </Typography>
                            </Box>
                          </Box>

                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="outlined" startIcon={<Visibility />}>
                              Xem
                            </Button>
                            <Button size="small" variant="contained" startIcon={<Download />}>
                              Tải
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {selectedTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Xác thực chữ ký điện tử
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Verified sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Tính năng đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Xác thực tính hợp lệ của chữ ký điện tử
                  </Typography>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Create Contract Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Add color="primary" />
            Tạo hợp đồng mới
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tiêu đề hợp đồng"
                value={contractForm.title}
                onChange={(e) => setContractForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ví dụ: Hợp đồng sở hữu chung Honda City..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Loại hợp đồng</InputLabel>
                <Select
                  value={contractForm.type}
                  onChange={(e) => setContractForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="ownership">Sở hữu chung</MenuItem>
                  <MenuItem value="rental">Thuê xe</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mẫu hợp đồng</InputLabel>
                <Select
                  value={contractForm.templateId}
                  onChange={(e) => setContractForm(prev => ({ ...prev, templateId: e.target.value }))}
                >
                  {templates
                    .filter(t => t.type === contractForm.type)
                    .map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email khách hàng"
                value={contractForm.customerId}
                onChange={(e) => setContractForm(prev => ({ ...prev, customerId: e.target.value }))}
                placeholder="customer@email.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú"
                value={contractForm.notes}
                onChange={(e) => setContractForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Ghi chú thêm về hợp đồng..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ height: 60 }}
              >
                Tải lên file hợp đồng (tùy chọn)
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setContractForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
              </Button>
              {contractForm.file && (
                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                  Đã chọn: {contractForm.file.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateContract} variant="contained">
            Tạo hợp đồng
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