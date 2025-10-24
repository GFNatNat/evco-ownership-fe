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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  FilterList,
  Download,
  Visibility,
  ExpandMore,

  History,
  BarChart,
  TrendingUp,
  AccountBalance,
  SwapHoriz
} from '@mui/icons-material';

import ownershipHistoryApi from '../../api/ownershipHistoryApi';
import vehicleApi from '../../api/vehicleApi';

/**
 * Ownership History Management Page
 * Tracks and displays history of ownership changes for vehicles
 * Following README 23 specifications
 */
function OwnershipHistoryManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [statisticsData, setStatisticsData] = useState(null);
  const [myHistory, setMyHistory] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    changeType: '',
    startDate: '',
    endDate: '',
    coOwnerId: '',
    offset: 0,
    limit: 50
  });

  // Dialog states
  const [snapshotDialog, setSnapshotDialog] = useState({ open: false, date: '' });
  const [snapshotData, setSnapshotData] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      loadVehicleData();
    }
  }, [selectedVehicle, filters]);

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load vehicles
      const vehiclesResponse = await vehicleApi.getAll().catch(() => ({ data: { data: [] } }));
      const vehiclesData = vehiclesResponse?.data?.data || [];
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);

      // Load my history
      const myHistoryResponse = await ownershipHistoryApi.getMyHistory().catch(() => ({ data: { data: [] } }));
      const myHistoryData = myHistoryResponse?.data?.data || [];
      setMyHistory(Array.isArray(myHistoryData) ? myHistoryData : []);

    } catch (err) {
      console.error('Error loading initial data:', err);
      setVehicles([]);
      setMyHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Load vehicle-specific data
  const loadVehicleData = async () => {
    if (!selectedVehicle) return;

    setLoading(true);
    try {
      // Load history
      const historyResponse = await ownershipHistoryApi.getVehicleHistory(selectedVehicle, filters).catch(() => ({ data: { data: [] } }));
      const historyDataRes = historyResponse?.data?.data || [];
      setHistoryData(Array.isArray(historyDataRes) ? historyDataRes : []);

      // Load timeline
      const timelineResponse = await ownershipHistoryApi.getVehicleTimeline(selectedVehicle).catch(() => ({ data: { data: [] } }));
      const timelineDataRes = timelineResponse?.data?.data || [];
      setTimelineData(Array.isArray(timelineDataRes) ? timelineDataRes : []);

      // Load statistics
      const statsResponse = await ownershipHistoryApi.getVehicleStatistics(selectedVehicle).catch(() => ({ data: { data: null } }));
      setStatisticsData(statsResponse?.data?.data || null);

    } catch (err) {
      console.error('Error loading vehicle data:', err);
      setHistoryData([]);
      setTimelineData([]);
      setStatisticsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      offset: field !== 'offset' ? 0 : value // Reset offset when other filters change
    }));
  };

  // Handle get snapshot
  const handleGetSnapshot = async () => {
    if (!selectedVehicle || !snapshotDialog.date) return;

    try {
      const response = await ownershipHistoryApi.getOwnershipSnapshot(selectedVehicle, snapshotDialog.date).catch(() => ({ data: { data: null } }));
      setSnapshotData(response?.data?.data || null);
    } catch (err) {
      console.error('Lỗi khi tải snapshot:', err);
      setSnapshotData(null);
    }
  };

  // Handle export data
  const handleExportData = () => {
    const exportData = ownershipHistoryApi.prepareExportData(historyData);
    
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
    link.download = `ownership_history_${selectedVehicle}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Get change type options
  const changeTypeOptions = ownershipHistoryApi.getChangeTypes();

  // Format history records for display
  const formatHistoryRecords = (records) => {
    return records.map(record => ownershipHistoryApi.formatHistoryRecord(record));
  };

  // Render filters
  const renderFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <FilterList sx={{ mr: 1 }} />
          Bộ lọc
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Loại thay đổi</InputLabel>
              <Select
                value={filters.changeType}
                onChange={(e) => handleFilterChange('changeType', e.target.value)}
                label="Loại thay đổi"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {changeTypeOptions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Từ ngày"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Đến ngày"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={() => setFilters({
                changeType: '',
                startDate: '',
                endDate: '',
                coOwnerId: '',
                offset: 0,
                limit: 50
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

  // Render history table
  const renderHistoryTable = () => {
    const formattedRecords = formatHistoryRecords(historyData);

    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Lịch sử thay đổi quyền sở hữu ({formattedRecords.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportData}
              disabled={formattedRecords.length === 0}
            >
              Xuất dữ liệu
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày thay đổi</TableCell>
                  <TableCell>Loại thay đổi</TableCell>
                  <TableCell>Chủ sở hữu</TableCell>
                  <TableCell>Tỷ lệ cũ</TableCell>
                  <TableCell>Tỷ lệ mới</TableCell>
                  <TableCell>Thay đổi đầu tư</TableCell>
                  <TableCell>Lý do</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formattedRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.formattedDate}</TableCell>
                    <TableCell>
                      <Chip 
                        label={record.changeTypeLabel} 
                        color={ownershipHistoryApi.getStatusColor(record.changeType)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.coOwnerName}</TableCell>
                    <TableCell>{record.formattedOldPercentage}</TableCell>
                    <TableCell>{record.formattedNewPercentage}</TableCell>
                    <TableCell>{record.formattedInvestmentChange}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {record.reason || 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {formattedRecords.length === 0 && (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              Không có dữ liệu lịch sử
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render timeline
  const renderTimeline = () => {
    const timelineFormatted = ownershipHistoryApi.generateTimelineData(timelineData);

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <TimelineIcon sx={{ mr: 1 }} />
            Dòng thời gian thay đổi quyền sở hữu
          </Typography>

          {timelineFormatted.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              Không có dữ liệu timeline
            </Typography>
          ) : (
            <Timeline>
              {timelineFormatted.map((point, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="textSecondary">
                    {point.formattedDate}
                  </TimelineOppositeContent>
                  
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <SwapHoriz />
                    </TimelineDot>
                    {index < timelineFormatted.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  
                  <TimelineContent>
                    <Typography variant="h6" component="span">
                      {point.coOwnerCount} chủ sở hữu
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tổng tỷ lệ: {point.totalPercentage?.toFixed(2)}%
                    </Typography>
                    
                    <Box mt={1}>
                      {point.coOwners?.map((owner, ownerIndex) => (
                        <Chip
                          key={ownerIndex}
                          label={`${owner.coOwnerName}: ${owner.percentage?.toFixed(2)}%`}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render statistics
  const renderStatistics = () => {
    if (!statisticsData) {
      return (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center">
              Chọn xe để xem thống kê
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Overall Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <History sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {statisticsData.totalChanges || 0}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Tổng số thay đổi
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {statisticsData.totalCoOwners || 0}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Tổng chủ sở hữu
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {statisticsData.averageChangeFrequency?.toFixed(1) || 0}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Tần suất thay đổi (tháng)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Type Breakdown */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân loại thay đổi
              </Typography>
              
              <Grid container spacing={2}>
                {Object.entries(statisticsData.changeTypeBreakdown || {}).map(([type, count]) => (
                  <Grid item xs={12} md={6} lg={4} key={type}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={ownershipHistoryApi.getChangeTypeLabel(type)}
                        color={ownershipHistoryApi.getStatusColor(type)}
                        size="small"
                      />
                      <Typography variant="body1" fontWeight="bold">
                        {count}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render my history
  const renderMyHistory = () => {
    const groupedHistory = ownershipHistoryApi.groupByTimePeriod(myHistory, 'month');

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lịch sử quyền sở hữu của tôi
          </Typography>

          {Object.keys(groupedHistory).length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              Bạn chưa có lịch sử thay đổi quyền sở hữu
            </Typography>
          ) : (
            Object.entries(groupedHistory)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([period, records]) => (
                <Accordion key={period}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">
                      {period} ({records.length} thay đổi)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Xe</TableCell>
                            <TableCell>Loại thay đổi</TableCell>
                            <TableCell>Tỷ lệ cũ</TableCell>
                            <TableCell>Tỷ lệ mới</TableCell>
                            <TableCell>Thay đổi đầu tư</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {records.map((record, index) => {
                            const formatted = ownershipHistoryApi.formatHistoryRecord(record);
                            return (
                              <TableRow key={index}>
                                <TableCell>{formatted.formattedDate}</TableCell>
                                <TableCell>{record.vehicleName}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={formatted.changeTypeLabel}
                                    color={ownershipHistoryApi.getStatusColor(record.changeType)}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{formatted.formattedOldPercentage}</TableCell>
                                <TableCell>{formatted.formattedNewPercentage}</TableCell>
                                <TableCell>{formatted.formattedInvestmentChange}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))
          )}
        </CardContent>
      </Card>
    );
  };

  // Render snapshot dialog
  const renderSnapshotDialog = () => (
    <Dialog
      open={snapshotDialog.open}
      onClose={() => setSnapshotDialog({ open: false, date: '' })}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Snapshot quyền sở hữu tại thời điểm</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Chọn ngày"
              type="date"
              value={snapshotDialog.date}
              onChange={(e) => setSnapshotDialog(prev => ({ ...prev, date: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleGetSnapshot}
              disabled={!snapshotDialog.date}
              fullWidth
            >
              Lấy snapshot
            </Button>
          </Grid>

          {snapshotData && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Phân bổ quyền sở hữu tại {new Date(snapshotDialog.date).toLocaleDateString('vi-VN')}
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Chủ sở hữu</TableCell>
                      <TableCell>Tỷ lệ sở hữu (%)</TableCell>
                      <TableCell>Giá trị đầu tư</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {snapshotData.coOwners?.map((owner, index) => (
                      <TableRow key={index}>
                        <TableCell>{owner.coOwnerName}</TableCell>
                        <TableCell>{owner.percentage?.toFixed(2)}%</TableCell>
                        <TableCell>{ownershipHistoryApi.formatCurrency(owner.investmentAmount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSnapshotDialog({ open: false, date: '' })}>
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
          Đang tải dữ liệu...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lịch sử quyền sở hữu
      </Typography>

      {/* Vehicle Selection */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
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
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => setSnapshotDialog({ open: true, date: '' })}
              disabled={!selectedVehicle}
            >
              Xem snapshot
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Lịch sử chi tiết" />
          <Tab label="Dòng thời gian" />
          <Tab label="Thống kê" />
          <Tab label="Lịch sử của tôi" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {selectedVehicle && renderFilters()}
          {selectedVehicle ? renderHistoryTable() : (
            <Card>
              <CardContent>
                <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                  Chọn xe để xem lịch sử thay đổi quyền sở hữu
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        selectedVehicle ? renderTimeline() : (
          <Card>
            <CardContent>
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                Chọn xe để xem dòng thời gian
              </Typography>
            </CardContent>
          </Card>
        )
      )}

      {activeTab === 2 && renderStatistics()}

      {activeTab === 3 && renderMyHistory()}

      {/* Dialogs */}
      {renderSnapshotDialog()}

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

export default OwnershipHistoryManagement;