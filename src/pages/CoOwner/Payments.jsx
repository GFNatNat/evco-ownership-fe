import React from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Snackbar, Alert, Box, Stack,
  Chip, Avatar, Paper, List, ListItem, ListItemText, ListItemAvatar,
  Divider, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Tabs, Tab, LinearProgress, Stepper, Step, StepLabel, StepContent,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Payment, AccountBalance, CreditCard, Receipt, History, TrendingUp,
  Warning, CheckCircle, Schedule, Download, Visibility, ExpandMore,
  NotificationsActive, AccountBalanceWallet, MonetizationOn,
  Settings, QrCode, Share
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
// import {
//   PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
//   CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar
// } from 'recharts';
import paymentApi from '../../api/paymentApi';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Payments() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [invoices, setInvoices] = React.useState([]);
  const [paymentHistory, setPaymentHistory] = React.useState([]);
  const [financialSummary, setFinancialSummary] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState('bank_transfer');

  // Mock data
  const [mockData] = React.useState({
    summary: {
      monthlyTotal: 2500000,
      paidAmount: 1800000,
      pendingAmount: 700000,
      yourShare: 625000, // 25% ownership
      dueAmount: 175000,
      upcomingPayments: 3
    },
    costBreakdown: [
      { name: 'Xăng dầu', value: 800000, color: '#0088FE' },
      { name: 'Bảo trì', value: 600000, color: '#00C49F' },
      { name: 'Bảo hiểm', value: 400000, color: '#FFBB28' },
      { name: 'Khác', value: 700000, color: '#FF8042' }
    ],
    monthlyTrend: [
      { month: 'T5', amount: 2200000 },
      { month: 'T6', amount: 2400000 },
      { month: 'T7', amount: 2800000 },
      { month: 'T8', amount: 2300000 },
      { month: 'T9', amount: 2600000 },
      { month: 'T10', amount: 2500000 }
    ]
  });

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Mock API calls
      setInvoices([
        {
          id: 1,
          code: 'INV-2025-001',
          type: 'Xăng dầu',
          amount: 350000,
          yourShare: 87500,
          status: 'Pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          description: 'Chi phí xăng dầu tháng 10/2025'
        },
        {
          id: 2,
          code: 'INV-2025-002',
          type: 'Bảo trì',
          amount: 800000,
          yourShare: 200000,
          status: 'Overdue',
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          description: 'Thay dầu máy và bảo dưỡng định kỳ'
        },
        {
          id: 3,
          code: 'INV-2025-003',
          type: 'Bảo hiểm',
          amount: 1200000,
          yourShare: 300000,
          status: 'Paid',
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          paidDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          description: 'Phí bảo hiểm xe năm 2025'
        }
      ]);

      setPaymentHistory([
        {
          id: 1,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          description: 'Thanh toán phí bảo hiểm',
          amount: 300000,
          method: 'Chuyển khoản',
          status: 'Completed'
        },
        {
          id: 2,
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          description: 'Chi phí xăng dầu tháng 9',
          amount: 75000,
          method: 'VNPay',
          status: 'Completed'
        }
      ]);

      setFinancialSummary(mockData.summary);
    } catch (err) {
      setError('Không thể tải dữ liệu thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedInvoice) return;

    try {
      // Mock payment process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setInvoices(prev => prev.map(inv =>
        inv.id === selectedInvoice.id
          ? { ...inv, status: 'Paid', paidDate: new Date() }
          : inv
      ));

      setMessage('Thanh toán thành công!');
      setPaymentDialogOpen(false);
      setSelectedInvoice(null);
    } catch (err) {
      setError('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const columns = [
    {
      field: 'code',
      headerName: 'Mã hóa đơn',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.type}
          </Typography>
        </Box>
      )
    },
    {
      field: 'amount',
      headerName: 'Tổng tiền / Phần của bạn',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {formatCurrency(params.value)}
          </Typography>
          <Typography variant="caption" color="primary" fontWeight="bold">
            {formatCurrency(params.row.yourShare)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'dueDate',
      headerName: 'Hạn thanh toán',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.value.toLocaleDateString('vi-VN')}
          </Typography>
          {params.row.status === 'Overdue' && (
            <Typography variant="caption" color="error">
              Quá hạn
            </Typography>
          )}
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.7,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.status === 'Pending' || params.row.status === 'Overdue' ? (
            <Button
              size="small"
              variant="contained"
              onClick={() => handlePayment(params.row)}
            >
              Thanh toán
            </Button>
          ) : null}
          <IconButton size="small">
            <Visibility />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #43a047 0%, #388e3c 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Thanh toán & Tài chính
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Quản lý chi phí và thanh toán theo tỷ lệ sở hữu
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AccountBalanceWallet />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Tự động thanh toán
                </Button>
                <IconButton sx={{ color: 'white' }}>
                  <Download />
                </IconButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Financial Overview */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Phần của bạn (25%)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {Math.round(financialSummary?.yourShare / 1000)}K
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  VNĐ / tháng
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <AccountBalanceWallet sx={{ fontSize: 30 }} />
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
                  Cần thanh toán
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {Math.round(financialSummary?.dueAmount / 1000)}K
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  VNĐ
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <NotificationsActive sx={{ fontSize: 30 }} />
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
                  Đã thanh toán
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {Math.round((financialSummary?.yourShare - financialSummary?.dueAmount) / 1000)}K
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  VNĐ tháng này
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
                  Hóa đơn sắp tới
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {financialSummary?.upcomingPayments}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  trong 7 ngày
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <Schedule sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<Receipt />} label="Hóa đơn chờ" />
            <Tab icon={<History />} label="Lịch sử thanh toán" />
            <Tab icon={<TrendingUp />} label="Phân tích chi phí" />
            <Tab icon={<Settings />} label="Cài đặt" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Hóa đơn chờ thanh toán ({invoices.filter(inv => inv.status !== 'Paid').length})
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <DataGrid
                    rows={invoices}
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
                  Lịch sử thanh toán
                </Typography>
                <List>
                  {paymentHistory.map((payment) => (
                    <React.Fragment key={payment.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <Payment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1">
                                {payment.description}
                              </Typography>
                              <Chip size="small" label={payment.status} color="success" />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {payment.date.toLocaleDateString('vi-VN')} • {payment.method}
                              </Typography>
                              <Typography variant="h6" color="primary">
                                {formatCurrency(payment.amount)}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton>
                          <Download />
                        </IconButton>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {selectedTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Phân bố chi phí tháng này
                  </Typography>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box>
                      <AccountBalance sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Biểu đồ đang phát triển
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cài đặt thư viện recharts để hiển thị biểu đồ
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Xu hướng chi phí 6 tháng
                  </Typography>
                  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box>
                      <TrendingUp sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Biểu đồ đang phát triển
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cài đặt thư viện recharts để hiển thị biểu đồ
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {selectedTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Cài đặt thanh toán
                </Typography>
                <Stack spacing={2}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Phương thức thanh toán mặc định</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">
                        Cấu hình phương thức thanh toán ưu tiên
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Thông báo thanh toán</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">
                        Thiết lập nhắc nhở thanh toán qua email/SMS
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Payment color="primary" />
            Xác nhận thanh toán
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6">{selectedInvoice.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedInvoice.code}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body1">
                  Tổng hóa đơn: <strong>{formatCurrency(selectedInvoice.amount)}</strong>
                </Typography>
                <Typography variant="h5" color="primary">
                  Phần của bạn: <strong>{formatCurrency(selectedInvoice.yourShare)}</strong>
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="bank_transfer">Chuyển khoản ngân hàng</MenuItem>
                  <MenuItem value="vnpay">VNPay</MenuItem>
                  <MenuItem value="momo">MoMo</MenuItem>
                  <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Hủy</Button>
          <Button onClick={confirmPayment} variant="contained">
            Xác nhận thanh toán
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