import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance,
  Add,
  TrendingUp,
  TrendingDown,
  History,
  Visibility,
  Edit,
  Delete,
  ExpandMore,
  MonetizationOn,
  Receipt,
  Assignment
} from '@mui/icons-material';
import fundApi from '../../api/fundApi';

/**
 * Fund Management Component
 * Complete fund management system following README 20 specifications
 * Handles contributions, expenses, balance tracking, and reporting
 */
function FundManagement({ groupId }) {
  const [fundData, setFundData] = useState({
    balance: 0,
    totalContributions: 0,
    totalExpenses: 0,
    contributions: [],
    expenses: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [contributionDialog, setContributionDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);

  // Form states
  const [contributionForm, setContributionForm] = useState({
    amount: '',
    description: '',
    contributionType: 'Regular'
  });
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'Maintenance',
    receiptFile: null
  });

  // Load fund data on component mount
  useEffect(() => {
    if (groupId) {
      loadFundData();
    }
  }, [groupId]);

  // Load all fund data
  const loadFundData = async () => {
    setLoading(true);
    try {
      // Load balance
      const balanceResponse = await fundApi.getBalance(groupId);
      const balance = balanceResponse.data.data.balance;

      // Load contributions
      const contributionsResponse = await fundApi.getContributions(groupId);
      const contributions = contributionsResponse.data.data;

      // Load expenses  
      const expensesResponse = await fundApi.getExpenses(groupId);
      const expenses = expensesResponse.data.data;

      setFundData({
        balance,
        totalContributions: contributions.reduce((sum, c) => sum + c.amount, 0),
        totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
        contributions,
        expenses
      });
    } catch (err) {
      console.error('Error loading fund data:', err);
      setError('Lỗi khi tải dữ liệu quỹ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle contribution
  const handleAddContribution = async () => {
    if (!contributionForm.amount || !contributionForm.description) {
      setError('Vui lòng nhập đầy đủ thông tin đóng góp');
      return;
    }

    try {
      await fundApi.addContribution(groupId, {
        amount: parseFloat(contributionForm.amount),
        description: contributionForm.description,
        contributionType: contributionForm.contributionType
      });

      setSuccess('Thêm đóng góp thành công');
      setContributionDialog(false);
      setContributionForm({ amount: '', description: '', contributionType: 'Regular' });
      loadFundData(); // Reload data
    } catch (err) {
      setError('Lỗi khi thêm đóng góp: ' + err.message);
    }
  };

  // Handle expense
  const handleAddExpense = async () => {
    if (!expenseForm.amount || !expenseForm.description) {
      setError('Vui lòng nhập đầy đủ thông tin chi tiêu');
      return;
    }

    try {
      const expenseData = {
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        category: expenseForm.category
      };

      // Add receipt file if available
      if (expenseForm.receiptFile) {
        expenseData.receiptFile = expenseForm.receiptFile;
      }

      await fundApi.addExpense(groupId, expenseData);

      setSuccess('Thêm chi tiêu thành công');
      setExpenseDialog(false);
      setExpenseForm({ amount: '', description: '', category: 'Maintenance', receiptFile: null });
      loadFundData(); // Reload data
    } catch (err) {
      setError('Lỗi khi thêm chi tiêu: ' + err.message);
    }
  };

  // Generate report
  const handleGenerateReport = async () => {
    try {
      const response = await fundApi.generateReport(groupId);
      const reportData = response.data.data;
      
      // Open report dialog with data
      setReportDialog(true);
      // You can process reportData here for display
    } catch (err) {
      setError('Lỗi khi tạo báo cáo: ' + err.message);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  // Render fund overview
  const renderFundOverview = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <AccountBalance sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" color="primary" gutterBottom>
              {formatCurrency(fundData.balance)}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Số dư hiện tại
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" color="success.main" gutterBottom>
              {formatCurrency(fundData.totalContributions)}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Tổng đóng góp
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingDown sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" color="error.main" gutterBottom>
              {formatCurrency(fundData.totalExpenses)}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Tổng chi tiêu
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render action buttons
  const renderActionButtons = () => (
    <Box display="flex" gap={2} sx={{ mb: 3 }}>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setContributionDialog(true)}
      >
        Thêm đóng góp
      </Button>
      <Button
        variant="outlined"
        startIcon={<Receipt />}
        onClick={() => setExpenseDialog(true)}
      >
        Thêm chi tiêu
      </Button>
      <Button
        variant="outlined"
        startIcon={<Assignment />}
        onClick={handleGenerateReport}
      >
        Tạo báo cáo
      </Button>
    </Box>
  );

  // Render transaction history
  const renderTransactionHistory = () => (
    <Grid container spacing={3}>
      {/* Contributions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <MonetizationOn sx={{ mr: 1, color: 'success.main' }} />
              Lịch sử đóng góp ({fundData.contributions.length})
            </Typography>

            <List>
              {fundData.contributions.slice(0, 5).map((contribution) => (
                <ListItem key={contribution.contributionId} divider>
                  <ListItemIcon>
                    <TrendingUp color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={contribution.description}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(contribution.contributionDate)} • {contribution.contributorName}
                        </Typography>
                        <Chip 
                          label={contribution.contributionType} 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                  <Box textAlign="right">
                    <Typography variant="h6" color="success.main">
                      +{formatCurrency(contribution.amount)}
                    </Typography>
                    <Chip 
                      label={contribution.status} 
                      color={getStatusColor(contribution.status)}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>

            {fundData.contributions.length > 5 && (
              <Button fullWidth variant="text" sx={{ mt: 1 }}>
                Xem tất cả ({fundData.contributions.length})
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Expenses */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <Receipt sx={{ mr: 1, color: 'error.main' }} />
              Lịch sử chi tiêu ({fundData.expenses.length})
            </Typography>

            <List>
              {fundData.expenses.slice(0, 5).map((expense) => (
                <ListItem key={expense.expenseId} divider>
                  <ListItemIcon>
                    <TrendingDown color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={expense.description}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(expense.expenseDate)} • {expense.category}
                        </Typography>
                        {expense.receiptUrl && (
                          <Chip label="Có hóa đơn" size="small" color="info" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                    }
                  />
                  <Box textAlign="right">
                    <Typography variant="h6" color="error.main">
                      -{formatCurrency(expense.amount)}
                    </Typography>
                    <Chip 
                      label={expense.status} 
                      color={getStatusColor(expense.status)}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>

            {fundData.expenses.length > 5 && (
              <Button fullWidth variant="text" sx={{ mt: 1 }}>
                Xem tất cả ({fundData.expenses.length})
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render contribution dialog
  const renderContributionDialog = () => (
    <Dialog open={contributionDialog} onClose={() => setContributionDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm đóng góp vào quỹ</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Số tiền"
              type="number"
              value={contributionForm.amount}
              onChange={(e) => setContributionForm(prev => ({ ...prev, amount: e.target.value }))}
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 1000 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              value={contributionForm.description}
              onChange={(e) => setContributionForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Loại đóng góp</InputLabel>
              <Select
                value={contributionForm.contributionType}
                onChange={(e) => setContributionForm(prev => ({ ...prev, contributionType: e.target.value }))}
                label="Loại đóng góp"
              >
                <MenuItem value="Regular">Định kỳ</MenuItem>
                <MenuItem value="Emergency">Khẩn cấp</MenuItem>
                <MenuItem value="Maintenance">Bảo trì</MenuItem>
                <MenuItem value="Upgrade">Nâng cấp</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setContributionDialog(false)}>Hủy</Button>
        <Button onClick={handleAddContribution} variant="contained">
          Thêm đóng góp
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render expense dialog
  const renderExpenseDialog = () => (
    <Dialog open={expenseDialog} onClose={() => setExpenseDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm chi tiêu từ quỹ</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Số tiền"
              type="number"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 1000 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                label="Danh mục"
              >
                <MenuItem value="Maintenance">Bảo trì</MenuItem>
                <MenuItem value="Fuel">Nhiên liệu</MenuItem>
                <MenuItem value="Insurance">Bảo hiểm</MenuItem>
                <MenuItem value="Registration">Đăng ký</MenuItem>
                <MenuItem value="Emergency">Khẩn cấp</MenuItem>
                <MenuItem value="Other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              {expenseForm.receiptFile ? expenseForm.receiptFile.name : 'Tải lên hóa đơn (tùy chọn)'}
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setExpenseForm(prev => ({ ...prev, receiptFile: e.target.files[0] }))}
              />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setExpenseDialog(false)}>Hủy</Button>
        <Button onClick={handleAddExpense} variant="contained">
          Thêm chi tiêu
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 2 }}>
          Đang tải dữ liệu quỹ...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý quỹ nhóm
      </Typography>

      {/* Fund Overview */}
      {renderFundOverview()}

      {/* Action Buttons */}
      {renderActionButtons()}

      {/* Transaction History */}
      {renderTransactionHistory()}

      {/* Dialogs */}
      {renderContributionDialog()}
      {renderExpenseDialog()}

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
    </Box>
  );
}

export default FundManagement;