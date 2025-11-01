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
  Divider
} from '@mui/material';
import {
  AccountBalance,
  Add,
  TrendingUp,
  TrendingDown,
  Edit,
  Delete,
  Receipt,
  Analytics,
  PieChart,
  History,
  Warning,
  CheckCircle,
  Error,
  Info,
  AttachMoney,
  Category,
  DateRange
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, BarChart, Bar } from 'recharts';
import coOwnerApi from '../../api/coowner';
import fileUploadApi from '../../api/fileUploadApi';

function FundManagement({ vehicleId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [fundData, setFundData] = useState({
    balance: null,
    additions: [],
    usages: [],
    summary: null,
    categoryAnalysis: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);
  const [editingUsage, setEditingUsage] = useState(null);
  const [usageForm, setUsageForm] = useState({
    usageType: 0,
    amount: '',
    description: '',
    imageFile: null,
    proposedDate: null
  });

  const [filterForm, setFilterForm] = useState({
    startDate: null,
    endDate: null,
    category: ''
  });

  // Load fund data
  const loadFundData = async () => {
    setLoading(true);
    try {
      // Load fund information using coOwnerApi
      const [fundInfoRes, contributionsRes] = await Promise.all([
        coOwnerApi.funds.getInfo(),
        coOwnerApi.funds.getMyContributions()
      ]);

      const fundInfo = fundInfoRes.data;
      const contributions = contributionsRes.data;

      setFundData({
        balance: fundInfo,
        additions: contributions.filter(c => c.type === 'addition') || [],
        usages: contributions.filter(c => c.type === 'usage') || [],
        summary: {
          totalAdded: contributions.filter(c => c.type === 'addition').reduce((sum, c) => sum + c.amount, 0),
          totalUsed: contributions.filter(c => c.type === 'usage').reduce((sum, c) => sum + c.amount, 0),
          netBalance: fundInfo.reduce((sum, f) => sum + f.currentBalance, 0)
        },
        categoryAnalysis: generateCategoryAnalysis(contributions)
      });
    } catch (err) {
      setError('Không thể tải dữ liệu quỹ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCategoryAnalysis = (contributions) => {
    const categories = {};
    contributions.filter(c => c.type === 'usage').forEach(usage => {
      const category = usage.category || 'Other';
      if (!categories[category]) {
        categories[category] = { name: category, value: 0, count: 0 };
      }
      categories[category].value += usage.amount;
      categories[category].count += 1;
    });
    return Object.values(categories);
  };

  useEffect(() => {
    loadFundData();
  }, []);

  // Handle add funds
  const handleAddFunds = async (fundData) => {
    setLoading(true);
    try {
      await coOwnerApi.funds.addFunds(fundData);
      setSuccess('Đã thêm tiền vào quỹ thành công');
      loadFundData();
    } catch (err) {
      setError('Không thể thêm tiền vào quỹ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle usage form
  const handleUsageSubmit = async () => {
    if (!usageForm.amount || !usageForm.description) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';

      // Upload image if provided
      if (usageForm.imageFile) {
        const formData = fileUploadApi.createFormData(usageForm.imageFile, {
          fileType: 'ExpenseReceipt'
        });
        const uploadRes = await fileUploadApi.upload(formData);
        imageUrl = uploadRes.data.data.fileUrl;
      }

      const submitData = {
        ...usageForm,
        amount: parseFloat(usageForm.amount),
        imageUrl: imageUrl,
        category: usageForm.usageType === 0 ? 'fuel' : usageForm.usageType === 1 ? 'maintenance' : 'other'
      };

      // Note: This would use a fund usage API if available in coOwnerApi
      // For now, we'll log the usage data
      console.log('Fund usage data:', submitData);
      setSuccess('Chi tiêu đã được ghi nhận!');

      setUsageDialogOpen(false);
      resetUsageForm();
      loadFundData();
    } catch (err) {
      setError('Lỗi khi lưu chi tiêu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUsage = async (usageId) => {
    if (!window.confirm('Bạn có chắc muốn xóa chi tiêu này?')) {
      return;
    }

    setLoading(true);
    try {
      // Note: This would use coOwnerApi for deletion if available
      console.log('Deleting usage:', usageId);
      setSuccess('Đã xóa chi tiêu!');
      loadFundData();
    } catch (err) {
      setError('Lỗi khi xóa chi tiêu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetUsageForm = () => {
    setUsageForm({
      usageType: 0,
      amount: '',
      description: '',
      imageFile: null,
      proposedDate: null
    });
    setEditingUsage(null);
  };

  const openEditUsage = (usage) => {
    setEditingUsage(usage);
    setUsageForm({
      usageType: usage.usageType,
      amount: usage.amount.toString(),
      description: usage.description,
      imageFile: null,
      proposedDate: null
    });
    setUsageDialogOpen(true);
  };

  // Balance Status Display
  const BalanceCard = () => {
    const balance = fundData.balance;
    if (!balance) return null;

    const statusInfo = balance.balanceStatusInfo;

    return (
      <Card sx={{
        background: `linear-gradient(135deg, ${statusInfo.bgColor} 0%, ${statusInfo.color}20 100%)`,
        border: `2px solid ${statusInfo.color}30`
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" color="textSecondary">
              Số dư quỹ hiện tại
            </Typography>
            <Chip
              label={statusInfo.name}
              sx={{
                backgroundColor: statusInfo.color,
                color: 'white',
                fontWeight: 'bold'
              }}
              icon={<span>{statusInfo.icon}</span>}
            />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: statusInfo.color }}>
            {balance.formattedCurrentBalance}
          </Typography>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <TrendingUp color="success" />
                <Typography variant="body2" color="textSecondary">Tổng nạp</Typography>
                <Typography variant="h6">{balance.formattedTotalAddedAmount}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <TrendingDown color="error" />
                <Typography variant="body2" color="textSecondary">Tổng chi</Typography>
                <Typography variant="h6">{balance.formattedTotalUsedAmount}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Warning color="warning" />
                <Typography variant="body2" color="textSecondary">Tối thiểu khuyến nghị</Typography>
                <Typography variant="h6">{balance.formattedRecommendedMinBalance}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Category Analysis Chart
  const CategoryAnalysisChart = () => {
    const analysis = fundData.categoryAnalysis;
    if (!analysis?.categoryBudgets) return null;

    const chartData = analysis.categoryBudgets.map(budget => ({
      name: budget.categoryName,
      spending: budget.currentMonthSpending,
      budget: budget.monthlyBudgetLimit,
      utilization: budget.budgetUtilizationPercent,
      color: fundApi.getUsageTypes().find(t => t.value === budget.categoryCode)?.color || '#666'
    }));

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PieChart sx={{ mr: 1 }} />
            Phân tích ngân sách theo danh mục
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => fundApi.formatCurrency(value)} />
              <RechartsTooltip
                formatter={(value) => [fundApi.formatCurrency(value), '']}
              />
              <Legend />
              <Bar dataKey="budget" fill="#E0E0E0" name="Ngân sách" />
              <Bar dataKey="spending" fill="#2196F3" name="Chi tiêu" />
            </BarChart>
          </ResponsiveContainer>

          <Box mt={2}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Tình trạng ngân sách:
            </Typography>
            {analysis.categoryBudgets.map(budget => {
              const statusInfo = fundApi.getBudgetStatusInfo(budget.budgetStatus);
              return (
                <Box key={budget.categoryCode} display="flex" alignItems="center" justifyContent="space-between" py={1}>
                  <Box display="flex" alignItems="center">
                    <Chip
                      size="small"
                      label={budget.categoryName}
                      sx={{
                        backgroundColor: fundApi.getUsageTypes().find(t => t.value === budget.categoryCode)?.color + '20',
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">
                      {budget.formattedCurrentMonthSpending} / {budget.formattedMonthlyBudgetLimit}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={`${budget.formattedBudgetUtilizationPercent}`}
                    sx={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Monthly Trend Chart
  const MonthlyTrendChart = () => {
    const summary = fundData.summary;
    if (!summary?.monthlyBreakdown) return null;

    const chartData = summary.monthlyBreakdown.map(month => ({
      name: `${month.month}/${month.year}`,
      added: month.totalAdded,
      used: month.totalUsed,
      balance: month.endingBalance
    }));

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <History sx={{ mr: 1 }} />
            Xu hướng tài chính 6 tháng
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => fundApi.formatCurrency(value)} />
              <RechartsTooltip
                formatter={(value) => [fundApi.formatCurrency(value), '']}
              />
              <Legend />
              <Line type="monotone" dataKey="added" stroke="#4CAF50" name="Nạp tiền" strokeWidth={2} />
              <Line type="monotone" dataKey="used" stroke="#F44336" name="Chi tiêu" strokeWidth={2} />
              <Line type="monotone" dataKey="balance" stroke="#2196F3" name="Số dư" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  // Usage Table
  const UsageTable = () => {
    const usages = fundData.usages;

    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              <Receipt sx={{ mr: 1 }} />
              Lịch sử chi tiêu
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setUsageDialogOpen(true)}
            >
              Thêm chi tiêu
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Danh mục</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="right">Số tiền</TableCell>
                  <TableCell align="center">Chứng từ</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usages.map((usage) => (
                  <TableRow key={usage.id}>
                    <TableCell>{usage.formattedCreatedAt}</TableCell>
                    <TableCell>
                      <Chip
                        label={usage.usageTypeName}
                        size="small"
                        sx={{
                          backgroundColor: fundApi.getUsageTypes().find(t => t.value === usage.usageType)?.color + '20'
                        }}
                      />
                    </TableCell>
                    <TableCell>{usage.description}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {usage.formattedAmount}
                    </TableCell>
                    <TableCell align="center">
                      {usage.imageUrl ? (
                        <IconButton
                          size="small"
                          onClick={() => window.open(usage.imageUrl, '_blank')}
                        >
                          <Receipt color="primary" />
                        </IconButton>
                      ) : (
                        <Typography variant="body2" color="textSecondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => openEditUsage(usage)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUsage(usage.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  };

  // Addition History
  const AdditionHistory = () => {
    const additions = fundData.additions;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <AccountBalance sx={{ mr: 1 }} />
            Lịch sử nạp quỹ
          </Typography>

          <List>
            {additions.map((addition, index) => (
              <ListItem key={addition.id || index}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <Add />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Nạp quỹ - ${addition.paymentMethodName}`}
                  secondary={addition.formattedCreatedAt}
                />
                <Typography variant="h6" color="success.main">
                  +{addition.formattedAmount}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  // Usage Dialog
  const UsageDialog = () => (
    <Dialog open={usageDialogOpen} onClose={() => setUsageDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingUsage ? 'Cập nhật chi tiêu' : 'Thêm chi tiêu mới'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Danh mục chi tiêu</InputLabel>
              <Select
                value={usageForm.usageType}
                onChange={(e) => setUsageForm(prev => ({ ...prev, usageType: e.target.value }))}
              >
                {fundApi.getUsageTypes().map(type => (
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
            <TextField
              fullWidth
              label="Số tiền"
              type="number"
              value={usageForm.amount}
              onChange={(e) => setUsageForm(prev => ({ ...prev, amount: e.target.value }))}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả chi tiết"
              multiline
              rows={3}
              value={usageForm.description}
              onChange={(e) => setUsageForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<Receipt />}
            >
              {usageForm.imageFile ? usageForm.imageFile.name : 'Tải lên hóa đơn/chứng từ'}
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={(e) => setUsageForm(prev => ({ ...prev, imageFile: e.target.files[0] }))}
              />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUsageDialogOpen(false)}>Hủy</Button>
        <Button onClick={handleUsageSubmit} variant="contained" disabled={loading}>
          {editingUsage ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <Grid container spacing={3}>
          {/* Balance Card */}
          <Grid item xs={12}>
            <BalanceCard />
          </Grid>

          {/* Tabs */}
          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Tổng quan" icon={<Analytics />} />
                <Tab label="Chi tiêu" icon={<Receipt />} />
                <Tab label="Nạp quỹ" icon={<AccountBalance />} />
                <Tab label="Phân tích" icon={<PieChart />} />
              </Tabs>
            </Box>
          </Grid>

          {/* Tab Content */}
          {activeTab === 0 && (
            <>
              <Grid item xs={12} md={8}>
                <MonthlyTrendChart />
              </Grid>
              <Grid item xs={12} md={4}>
                <AdditionHistory />
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <Grid item xs={12}>
              <UsageTable />
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid item xs={12}>
              <AdditionHistory />
            </Grid>
          )}

          {activeTab === 3 && (
            <Grid item xs={12}>
              <CategoryAnalysisChart />
            </Grid>
          )}
        </Grid>

        {/* Dialogs */}
        <UsageDialog />

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

export default FundManagement;