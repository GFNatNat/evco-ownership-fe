import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Pagination
} from '@mui/material';
import {
  BarChart,
  Timeline,
  Compare,
  TrendingUp,
  TrendingDown,
  DirectionsCar,
  People,
  Assessment,
  Download,
  FilterList,
  ExpandMore,
  Insights,
  Analytics
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import usageAnalyticsApi from '../../api/usageAnalyticsApi';
import vehicleApi from '../../api/vehicleApi';
import coOwnerApi from '../../api/coOwnerApi';

/**
 * Usage Analytics Management Page
 * Comprehensive usage analytics and comparison tools
 * Following README 24 specifications
 */
function UsageAnalyticsManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [usageVsOwnership, setUsageVsOwnership] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [myUsageHistory, setMyUsageHistory] = useState(null);
  const [groupSummary, setGroupSummary] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  // Filter states
  const [analyticsFilters, setAnalyticsFilters] = useState({
    startDate: '',
    endDate: '',
    usageMetric: 'Hours',
    granularity: 'Monthly'
  });

  const [historyFilters, setHistoryFilters] = useState({
    startDate: '',
    endDate: '',
    vehicleId: '',
    pageIndex: 1,
    pageSize: 20
  });

  // Comparison states
  const [comparisonFilters, setComparisonFilters] = useState({
    vehicleId: '',
    coOwnerIds: [],
    vehicleIds: [],
    startDate: '',
    endDate: '',
    metric: 'Hours'
  });

  // Dialog states
  const [detailDialog, setDetailDialog] = useState({ open: false, coOwner: null });
  const [periodComparisonDialog, setPeriodComparisonDialog] = useState({ open: false });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedVehicle && activeTab === 0) {
      loadUsageAnalytics();
    }
  }, [selectedVehicle, analyticsFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 1) {
      loadMyUsageHistory();
    }
  }, [historyFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 2) {
      loadGroupSummary();
    }
  }, [activeTab]);

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load vehicles
      const vehiclesResponse = await vehicleApi.getAll();
      setVehicles(vehiclesResponse.data.data || []);

    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Lỗi khi tải dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load usage analytics
  const loadUsageAnalytics = async () => {
    if (!selectedVehicle) return;

    setLoading(true);
    try {
      // Load usage vs ownership data
      const usageVsOwnershipResponse = await usageAnalyticsApi.getUsageVsOwnership(selectedVehicle, analyticsFilters);
      setUsageVsOwnership(usageVsOwnershipResponse.data.data);

      // Load trends data
      const trendsResponse = await usageAnalyticsApi.getUsageVsOwnershipTrends(selectedVehicle, analyticsFilters);
      setTrendsData(trendsResponse.data.data);

    } catch (err) {
      console.error('Error loading usage analytics:', err);
      setError('Lỗi khi tải dữ liệu phân tích: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load my usage history
  const loadMyUsageHistory = async () => {
    setLoading(true);
    try {
      const response = await usageAnalyticsApi.getMyUsageHistory(historyFilters);
      setMyUsageHistory(response.data.data);
    } catch (err) {
      console.error('Error loading usage history:', err);
      setError('Lỗi khi tải lịch sử sử dụng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load group summary
  const loadGroupSummary = async () => {
    setLoading(true);
    try {
      const response = await usageAnalyticsApi.getGroupUsageSummary(analyticsFilters);
      setGroupSummary(response.data.data);
    } catch (err) {
      console.error('Error loading group summary:', err);
      setError('Lỗi khi tải tóm tắt nhóm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load co-owner detail
  const loadCoOwnerDetail = async (coOwnerId) => {
    if (!selectedVehicle) return;

    try {
      const response = await usageAnalyticsApi.getCoOwnerUsageDetail(selectedVehicle, coOwnerId, analyticsFilters);
      setDetailDialog({ open: true, coOwner: response.data.data });
    } catch (err) {
      setError('Lỗi khi tải chi tiết chủ sở hữu: ' + err.message);
    }
  };

  // Handle comparison
  const handleComparison = async (type) => {
    setLoading(true);
    try {
      let response;
      switch (type) {
        case 'co-owners':
          response = await usageAnalyticsApi.compareCoOwners(comparisonFilters);
          break;
        case 'vehicles':
          response = await usageAnalyticsApi.compareVehicles(comparisonFilters);
          break;
        case 'periods':
          response = await usageAnalyticsApi.compareTimePeriods(comparisonFilters);
          break;
        default:
          throw new Error('Invalid comparison type');
      }
      
      setComparisonData({ type, data: response.data.data });
    } catch (err) {
      setError('Lỗi khi so sánh: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle export data
  const handleExportData = (data, type) => {
    const exportData = usageAnalyticsApi.prepareExportData(data, type);
    
    // Convert to CSV
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usage_analytics_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Colors for charts
  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  // Render analytics filters
  const renderAnalyticsFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FilterList sx={{ mr: 1 }} />
          Bộ lọc phân tích
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Chỉ số sử dụng</InputLabel>
              <Select
                value={analyticsFilters.usageMetric}
                onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, usageMetric: e.target.value }))}
                label="Chỉ số sử dụng"
              >
                {usageAnalyticsApi.getUsageMetrics().map((metric) => (
                  <MenuItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Chu kỳ</InputLabel>
              <Select
                value={analyticsFilters.granularity}
                onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, granularity: e.target.value }))}
                label="Chu kỳ"
              >
                {usageAnalyticsApi.getGranularityOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Từ ngày"
              type="date"
              value={analyticsFilters.startDate}
              onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, startDate: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              label="Đến ngày"
              type="date"
              value={analyticsFilters.endDate}
              onChange={(e) => setAnalyticsFilters(prev => ({ ...prev, endDate: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={() => setAnalyticsFilters({
                startDate: '',
                endDate: '',
                usageMetric: 'Hours',
                granularity: 'Monthly'
              })}
              fullWidth
            >
              Xóa bộ lọc
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  // Render usage vs ownership analysis
  const renderUsageVsOwnership = () => {
    if (!usageVsOwnership) {
      return (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              Chọn xe để xem phân tích sử dụng so với quyền sở hữu
            </Typography>
          </CardContent>
        </Card>
      );
    }

    const insights = usageAnalyticsApi.generateUsageInsights(usageVsOwnership);

    return (
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" color="primary">
                {usageVsOwnership.vehicleName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {usageVsOwnership.licensePlate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {usageVsOwnership.coOwnersData?.length || 0}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Chủ sở hữu
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {usageVsOwnership.summary?.totalBookings || 0}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Tổng đặt chỗ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Timeline sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {usageAnalyticsApi.formatUsageValue(usageVsOwnership.summary?.totalUsageValue, analyticsFilters.usageMetric)}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Tổng sử dụng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Insights */}
        {insights.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Insights sx={{ mr: 1 }} />
                  Nhận định
                </Typography>
                <List>
                  {insights.map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {insight.type === 'success' && <TrendingUp color="success" />}
                        {insight.type === 'warning' && <TrendingDown color="warning" />}
                        {insight.type === 'info' && <Analytics color="info" />}
                      </ListItemIcon>
                      <ListItemText primary={insight.message} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Co-owners Data Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Chi tiết sử dụng theo chủ sở hữu
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExportData(usageVsOwnership, 'usage-vs-ownership')}
                >
                  Xuất dữ liệu
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Chủ sở hữu</TableCell>
                      <TableCell>Tỷ lệ sở hữu (%)</TableCell>
                      <TableCell>Tỷ lệ sử dụng (%)</TableCell>
                      <TableCell>Chênh lệch (%)</TableCell>
                      <TableCell>Sử dụng thực tế</TableCell>
                      <TableCell>Tổng đặt chỗ</TableCell>
                      <TableCell>Mức sử dụng</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usageVsOwnership.coOwnersData?.map((coOwner) => {
                      const formatted = usageAnalyticsApi.formatUsageData(coOwner);
                      return (
                        <TableRow key={coOwner.coOwnerId}>
                          <TableCell>{coOwner.coOwnerName}</TableCell>
                          <TableCell>{formatted.formattedOwnershipPercentage}</TableCell>
                          <TableCell>{formatted.formattedUsagePercentage}</TableCell>
                          <TableCell>
                            <Chip 
                              label={formatted.formattedDelta}
                              color={formatted.deltaColor}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatted.formattedUsageValue}</TableCell>
                          <TableCell>{coOwner.totalBookings}</TableCell>
                          <TableCell>
                            <Chip 
                              label={usageAnalyticsApi.getUsagePatternLabel(coOwner.usagePattern)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => loadCoOwnerDetail(coOwner.coOwnerId)}
                            >
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Usage Chart */}
        {trendsData && trendsData.trendData && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Xu hướng sử dụng theo thời gian
                </Typography>
                
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={trendsData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {trendsData.trendData[0]?.coOwnersData?.map((coOwner, index) => (
                        <Line
                          key={coOwner.coOwnerId}
                          type="monotone"
                          dataKey={`coOwner_${coOwner.coOwnerId}_usage`}
                          stroke={chartColors[index % chartColors.length]}
                          name={coOwner.coOwnerName}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  // Render usage history
  const renderUsageHistory = () => {
    if (!myUsageHistory) {
      return (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              Đang tải lịch sử sử dụng...
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tóm tắt lịch sử sử dụng
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {myUsageHistory.summary?.totalVehicles || 0}
                    </Typography>
                    <Typography variant="body2">Xe tham gia</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {myUsageHistory.summary?.totalBookings || 0}
                    </Typography>
                    <Typography variant="body2">Tổng đặt chỗ</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main">
                      {myUsageHistory.summary?.totalUsageHours?.toFixed(1) || 0}
                    </Typography>
                    <Typography variant="body2">Giờ sử dụng</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main">
                      {usageAnalyticsApi.formatCurrency(myUsageHistory.summary?.totalSpent)}
                    </Typography>
                    <Typography variant="body2">Tổng chi phí</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* History Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Lịch sử đặt xe
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExportData(myUsageHistory, 'usage-history')}
                >
                  Xuất dữ liệu
                </Button>
              </Box>

              {/* Filters */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Xe</InputLabel>
                    <Select
                      value={historyFilters.vehicleId}
                      onChange={(e) => setHistoryFilters(prev => ({ ...prev, vehicleId: e.target.value, pageIndex: 1 }))}
                      label="Xe"
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                          {vehicle.make} {vehicle.model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Từ ngày"
                    type="date"
                    value={historyFilters.startDate}
                    onChange={(e) => setHistoryFilters(prev => ({ ...prev, startDate: e.target.value, pageIndex: 1 }))}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Đến ngày"
                    type="date"
                    value={historyFilters.endDate}
                    onChange={(e) => setHistoryFilters(prev => ({ ...prev, endDate: e.target.value, pageIndex: 1 }))}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã đặt xe</TableCell>
                      <TableCell>Xe</TableCell>
                      <TableCell>Thời gian bắt đầu</TableCell>
                      <TableCell>Thời gian kết thúc</TableCell>
                      <TableCell>Thời lượng (giờ)</TableCell>
                      <TableCell>Quãng đường (km)</TableCell>
                      <TableCell>Mục đích</TableCell>
                      <TableCell>Chi phí</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myUsageHistory.usageHistory?.map((record) => (
                      <TableRow key={record.bookingId}>
                        <TableCell>{record.bookingId}</TableCell>
                        <TableCell>{record.vehicleName}</TableCell>
                        <TableCell>{new Date(record.startTime).toLocaleString('vi-VN')}</TableCell>
                        <TableCell>{new Date(record.endTime).toLocaleString('vi-VN')}</TableCell>
                        <TableCell>{record.durationHours}</TableCell>
                        <TableCell>{record.distanceTraveled}</TableCell>
                        <TableCell>{record.purpose}</TableCell>
                        <TableCell>{usageAnalyticsApi.formatCurrency(record.cost)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={record.status}
                            color={record.status === 'Completed' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {myUsageHistory.pagination && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={myUsageHistory.pagination.totalPages}
                    page={myUsageHistory.pagination.pageIndex}
                    onChange={(e, page) => setHistoryFilters(prev => ({ ...prev, pageIndex: page }))}
                    color="primary"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render group summary
  const renderGroupSummary = () => {
    if (!groupSummary) {
      return (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              Đang tải tóm tắt nhóm...
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Overall Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tóm tắt chung
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {groupSummary.overallStats?.totalGroups || 0}
                    </Typography>
                    <Typography variant="body2">Tổng nhóm</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {groupSummary.overallStats?.averageUsageBalance?.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="body2">Cân bằng trung bình</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body1" fontWeight="bold">
                      {groupSummary.overallStats?.mostActiveGroup || 'N/A'}
                    </Typography>
                    <Typography variant="body2">Nhóm hoạt động nhất</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="body1" fontWeight="bold">
                      {groupSummary.overallStats?.bestHarmonyGroup || 'N/A'}
                    </Typography>
                    <Typography variant="body2">Nhóm hài hòa nhất</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Group Details */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Chi tiết các nhóm
          </Typography>
          
          {groupSummary.groupSummaries?.map((group, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" justifyContent="space-between" width="100%" pr={2}>
                  <Typography variant="h6">
                    {group.vehicleName} ({group.licensePlate})
                  </Typography>
                  <Chip 
                    label={`${group.usageBalance}`}
                    color={group.usageBalance === 'Balanced' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Tỷ lệ sở hữu của tôi:</strong> {group.myOwnershipPercentage?.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Tỷ lệ sử dụng của tôi:</strong> {group.myUsagePercentage?.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Giờ sử dụng của tôi:</strong> {group.myUsageHours?.toFixed(1)} giờ
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Xếp hạng sử dụng:</strong> #{group.usageRank}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Kích thước nhóm:</strong> {group.groupSize} người
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Hiệu suất sử dụng:</strong> {group.utilizationEfficiency?.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Mức độ hài hòa:</strong> {group.groupHarmony}
                    </Typography>
                  </Grid>
                  
                  {group.coOwners && (
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Các chủ sở hữu khác:</strong>
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {group.coOwners.map((coOwner, coIndex) => (
                          <Chip
                            key={coIndex}
                            label={`${coOwner.userName}: ${coOwner.usagePercentage?.toFixed(1)}%`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        {/* Improvement Suggestions */}
        {groupSummary.overallStats?.improvementSuggestions && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gợi ý cải thiện
                </Typography>
                <List>
                  {groupSummary.overallStats.improvementSuggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Insights color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  // Render comparisons
  const renderComparisons = () => (
    <Grid container spacing={3}>
      {/* Comparison Options */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Công cụ so sánh
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Compare />}
                  onClick={() => handleComparison('co-owners')}
                  disabled={!comparisonFilters.vehicleId}
                >
                  So sánh chủ sở hữu
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DirectionsCar />}
                  onClick={() => handleComparison('vehicles')}
                >
                  So sánh xe
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Timeline />}
                  onClick={() => setPeriodComparisonDialog({ open: true })}
                >
                  So sánh thời kỳ
                </Button>
              </Grid>
            </Grid>

            {/* Comparison Filters */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Xe</InputLabel>
                  <Select
                    value={comparisonFilters.vehicleId}
                    onChange={(e) => setComparisonFilters(prev => ({ ...prev, vehicleId: e.target.value }))}
                    label="Xe"
                  >
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                        {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Chỉ số so sánh</InputLabel>
                  <Select
                    value={comparisonFilters.metric}
                    onChange={(e) => setComparisonFilters(prev => ({ ...prev, metric: e.target.value }))}
                    label="Chỉ số so sánh"
                  >
                    {usageAnalyticsApi.getComparisonMetrics().map((metric) => (
                      <MenuItem key={metric.value} value={metric.value}>
                        {metric.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Comparison Results */}
      {comparisonData && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Kết quả so sánh {comparisonData.type}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => handleExportData(comparisonData.data, 'comparison')}
                >
                  Xuất dữ liệu
                </Button>
              </Box>

              {/* Display comparison results based on type */}
              {comparisonData.type === 'co-owners' && comparisonData.data.coOwnersComparison && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Xếp hạng</TableCell>
                        <TableCell>Tên</TableCell>
                        <TableCell>Tỷ lệ sở hữu (%)</TableCell>
                        <TableCell>Sử dụng thực tế</TableCell>
                        <TableCell>Tỷ lệ sử dụng (%)</TableCell>
                        <TableCell>Chênh lệch</TableCell>
                        <TableCell>Hiệu suất</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comparisonData.data.coOwnersComparison.map((coOwner) => (
                        <TableRow key={coOwner.coOwnerId}>
                          <TableCell>#{coOwner.rank}</TableCell>
                          <TableCell>{coOwner.userName}</TableCell>
                          <TableCell>{coOwner.ownershipPercentage?.toFixed(2)}%</TableCell>
                          <TableCell>{coOwner.actualUsage}</TableCell>
                          <TableCell>{coOwner.usagePercentage?.toFixed(2)}%</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${coOwner.varianceFromExpected > 0 ? '+' : ''}${coOwner.varianceFromExpected?.toFixed(1)}`}
                              color={Math.abs(coOwner.varianceFromExpected) <= 5 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{coOwner.efficiency}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Show insights if available */}
              {comparisonData.data.comparisonInsights && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Nhận định
                  </Typography>
                  <List>
                    {comparisonData.data.comparisonInsights.recommendations?.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Insights color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  // Render co-owner detail dialog
  const renderCoOwnerDetailDialog = () => (
    <Dialog
      open={detailDialog.open}
      onClose={() => setDetailDialog({ open: false, coOwner: null })}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Chi tiết sử dụng của chủ sở hữu</DialogTitle>
      <DialogContent>
        {detailDialog.coOwner && (
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tên:</strong> {detailDialog.coOwner.coOwnerName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {detailDialog.coOwner.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tỷ lệ sở hữu:</strong> {detailDialog.coOwner.ownershipPercentage?.toFixed(2)}%
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Tỷ lệ sử dụng:</strong> {detailDialog.coOwner.usagePercentage?.toFixed(2)}%
              </Typography>
            </Grid>

            {/* Usage Metrics */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Chỉ số sử dụng</Typography>
              {detailDialog.coOwner.usageMetrics && Object.entries(detailDialog.coOwner.usageMetrics).map(([key, value]) => (
                <Typography key={key} variant="body1" gutterBottom>
                  <strong>{key}:</strong> {value}
                </Typography>
              ))}
            </Grid>

            {/* Recent Bookings */}
            {detailDialog.coOwner.recentBookings && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Đặt chỗ gần đây</Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đặt</TableCell>
                        <TableCell>Thời gian bắt đầu</TableCell>
                        <TableCell>Thời gian kết thúc</TableCell>
                        <TableCell>Thời lượng</TableCell>
                        <TableCell>Quãng đường</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailDialog.coOwner.recentBookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                          <TableCell>{booking.bookingId}</TableCell>
                          <TableCell>{new Date(booking.startTime).toLocaleString('vi-VN')}</TableCell>
                          <TableCell>{new Date(booking.endTime).toLocaleString('vi-VN')}</TableCell>
                          <TableCell>{booking.durationHours} giờ</TableCell>
                          <TableCell>{booking.distanceTravelled} km</TableCell>
                          <TableCell>
                            <Chip 
                              label={booking.status}
                              color={booking.status === 'Completed' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
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
        <Button onClick={() => setDetailDialog({ open: false, coOwner: null })}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 2 }}>
          Đang tải dữ liệu phân tích...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Phân tích sử dụng xe
      </Typography>

      {/* Vehicle Selection for Analytics */}
      {(activeTab === 0 || activeTab === 3) && (
        <Box mb={3}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>Chọn xe</InputLabel>
            <Select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              label="Chọn xe"
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
                  {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Sử dụng vs Sở hữu" />
          <Tab label="Lịch sử của tôi" />
          <Tab label="Tóm tắt nhóm" />
          <Tab label="So sánh" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {selectedVehicle && renderAnalyticsFilters()}
          {renderUsageVsOwnership()}
        </Box>
      )}

      {activeTab === 1 && renderUsageHistory()}

      {activeTab === 2 && renderGroupSummary()}

      {activeTab === 3 && renderComparisons()}

      {/* Dialogs */}
      {renderCoOwnerDetailDialog()}

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
    </Container>
  );
}

export default UsageAnalyticsManagement;