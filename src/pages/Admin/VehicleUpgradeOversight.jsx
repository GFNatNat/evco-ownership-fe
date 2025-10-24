import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel
} from '@mui/material';
import {
  CarRepair as UpgradeIcon, Visibility as ViewIcon, CheckCircle as ApproveIcon,
  Cancel as RejectIcon, PendingActions as PendingIcon, Assessment as ReportIcon,
  MonetizationOn as CostIcon, Schedule as ScheduleIcon, SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';
import vehicleUpgradeApi from '../../api/vehicleUpgradeApi';

const VehicleUpgradeOversight = () => {
  const [allUpgrades, setAllUpgrades] = useState([]);
  const [upgradeStatistics, setUpgradeStatistics] = useState(null);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [adminOverrideDialogOpen, setAdminOverrideDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin oversight
      const mockUpgrades = [
        {
          upgradeId: 1,
          vehicleId: 1,
          vehicleName: 'Toyota Camry 2023',
          licensePlate: '30A-12345',
          upgradeType: 'engine_upgrade',
          currentSpecs: {
            engine: '2.0L I4',
            power: '203 HP',
            transmission: '8-speed CVT'
          },
          proposedSpecs: {
            engine: '2.5L I4 Hybrid',
            power: '203 HP + Electric Motor',
            transmission: '8-speed CVT Hybrid'
          },
          estimatedCost: 150000000,
          actualCost: 148500000,
          initiatedBy: 'Nguyễn Văn A',
          dateRequested: '2024-10-15T10:00:00Z',
          dateApproved: '2024-10-20T14:30:00Z',
          dateCompleted: '2024-10-25T16:00:00Z',
          status: 'completed',
          approvalStatus: 'approved',
          coOwnerVotes: {
            approve: 2,
            reject: 1,
            pending: 0
          },
          staffApproval: 'approved',
          adminOverride: false,
          notes: 'Nâng cấp hybrid để tiết kiệm nhiên liệu',
          completionReport: {
            satisfactionRating: 4.5,
            performanceImprovement: 15.2,
            fuelEfficiencyGain: 25.8
          }
        },
        {
          upgradeId: 2,
          vehicleId: 2,
          vehicleName: 'Honda Civic 2022',
          licensePlate: '29B-67890',
          upgradeType: 'interior_upgrade',
          currentSpecs: {
            seats: 'Fabric seats',
            infotainment: '7-inch display',
            sound: 'Standard 4-speaker'
          },
          proposedSpecs: {
            seats: 'Leather seats with heating',
            infotainment: '9-inch touchscreen with CarPlay',
            sound: 'Premium 8-speaker Bose'
          },
          estimatedCost: 85000000,
          actualCost: null,
          initiatedBy: 'Trần Thị B',
          dateRequested: '2024-10-22T09:15:00Z',
          dateApproved: null,
          dateCompleted: null,
          status: 'pending_approval',
          approvalStatus: 'pending',
          coOwnerVotes: {
            approve: 1,
            reject: 0,
            pending: 1
          },
          staffApproval: 'pending',
          adminOverride: false,
          notes: 'Nâng cấp nội thất để tăng trải nghiệm người dùng'
        },
        {
          upgradeId: 3,
          vehicleId: 3,
          vehicleName: 'Mazda CX-5 2023',
          licensePlate: '51C-11111',
          upgradeType: 'safety_upgrade',
          currentSpecs: {
            airbags: '6 airbags',
            adas: 'Basic safety features',
            camera: 'Rear camera only'
          },
          proposedSpecs: {
            airbags: '10 airbags',
            adas: 'Full i-ACTIVSENSE suite',
            camera: '360-degree camera system'
          },
          estimatedCost: 120000000,
          actualCost: null,
          initiatedBy: 'Lê Văn C',
          dateRequested: '2024-10-18T11:30:00Z',
          dateApproved: '2024-10-23T15:45:00Z',
          dateCompleted: null,
          status: 'in_progress',
          approvalStatus: 'approved',
          coOwnerVotes: {
            approve: 4,
            reject: 0,
            pending: 0
          },
          staffApproval: 'approved',
          adminOverride: false,
          notes: 'Nâng cấp an toàn là ưu tiên hàng đầu',
          expectedCompletion: '2024-11-05T17:00:00Z'
        }
      ];

      const mockStatistics = {
        totalUpgrades: 128,
        upgradesThisMonth: 15,
        completedUpgrades: 89,
        averageCost: 95000000,
        averageCompletionTime: 12.5,
        costSavings: 45000000,
        upgradeTypeDistribution: {
          engine_upgrade: 42,
          interior_upgrade: 35,
          safety_upgrade: 28,
          exterior_upgrade: 15,
          tech_upgrade: 8
        },
        statusDistribution: {
          completed: 89,
          in_progress: 18,
          pending_approval: 12,
          rejected: 9
        },
        approvalMetrics: {
          averageApprovalTime: 3.2,
          autoApprovalRate: 67.8,
          adminOverrideRate: 8.5,
          coOwnerSatisfaction: 4.3
        },
        costAnalysis: {
          totalBudgetUsed: 12200000000,
          averageCostOverrun: 2.1,
          mostExpensiveUpgrade: 280000000,
          totalSavings: 580000000
        }
      };

      const mockRequests = [
        {
          requestId: 1,
          upgradeId: 2,
          requestType: 'expedite',
          reason: 'Khách hàng VIP yêu cầu hoàn thành sớm',
          requestedBy: 'Staff Manager',
          dateRequested: '2024-10-24T10:00:00Z',
          status: 'pending',
          adminNotes: ''
        },
        {
          requestId: 2,
          upgradeId: 3,
          requestType: 'budget_increase',
          reason: 'Chi phí thực tế cao hơn ước tính 15%',
          requestedBy: 'Technical Staff',
          dateRequested: '2024-10-23T14:20:00Z',
          status: 'approved',
          adminNotes: 'Chấp nhận tăng ngân sách do chất lượng cao hơn'
        }
      ];

      setAllUpgrades(mockUpgrades);
      setUpgradeStatistics(mockStatistics);
      setUpgradeRequests(mockRequests);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminOverride = async (upgradeId, action, reason) => {
    try {
      console.log('Admin override:', upgradeId, action, reason);
      alert(`Admin đã ${action === 'approve' ? 'phê duyệt' : 'từ chối'} nâng cấp với quyền override`);
      setAdminOverrideDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error performing admin override:', error);
    }
  };

  const handleRequestResponse = async (requestId, action, notes) => {
    try {
      console.log('Request response:', requestId, action, notes);
      alert(`Yêu cầu đã được ${action === 'approve' ? 'chấp nhận' : 'từ chối'}`);
      loadData();
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending_approval': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in_progress': return 'Đang thực hiện';
      case 'pending_approval': return 'Chờ phê duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getUpgradeTypeLabel = (type) => {
    switch (type) {
      case 'engine_upgrade': return 'Nâng cấp động cơ';
      case 'interior_upgrade': return 'Nâng cấp nội thất';
      case 'safety_upgrade': return 'Nâng cấp an toàn';
      case 'exterior_upgrade': return 'Nâng cấp ngoại thất';
      case 'tech_upgrade': return 'Nâng cấp công nghệ';
      default: return type;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const calculateCostVariance = (estimated, actual) => {
    if (!actual) return 0;
    return ((actual - estimated) / estimated * 100);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Giám sát Nâng cấp Xe
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<SupervisorIcon />}
            onClick={() => setAdminOverrideDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            Admin Override
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ReportIcon />}
          >
            Báo cáo tổng hợp
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {upgradeStatistics?.totalUpgrades || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số nâng cấp
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {upgradeStatistics?.completedUpgrades || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                {formatCurrency(upgradeStatistics?.averageCost || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chi phí trung bình
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {upgradeStatistics?.averageCompletionTime || 0} ngày
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thời gian TB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Tất cả nâng cấp" />
        <Tab label="Yêu cầu đặc biệt" />
        <Tab label="Phân tích chi phí" />
        <Tab label="Thống kê hiệu suất" />
      </Tabs>

      {/* Tab: All Upgrades */}
      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="in_progress">Đang thực hiện</MenuItem>
                <MenuItem value="pending_approval">Chờ phê duyệt</MenuItem>
                <MenuItem value="rejected">Từ chối</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Xe</InputLabel>
              <Select
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
              >
                <MenuItem value="all">Tất cả xe</MenuItem>
                {[...new Set(allUpgrades.map(u => u.vehicleName))].map(name => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Xe</TableCell>
                  <TableCell>Loại nâng cấp</TableCell>
                  <TableCell>Chi phí</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Phê duyệt</TableCell>
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUpgrades
                  .filter(upgrade => 
                    (filterStatus === 'all' || upgrade.status === filterStatus) &&
                    (filterVehicle === 'all' || upgrade.vehicleName === filterVehicle)
                  )
                  .map((upgrade) => (
                    <TableRow key={upgrade.upgradeId}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {upgrade.vehicleName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {upgrade.licensePlate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getUpgradeTypeLabel(upgrade.upgradeType)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCurrency(upgrade.estimatedCost)}
                        </Typography>
                        {upgrade.actualCost && (
                          <Typography 
                            variant="caption" 
                            color={calculateCostVariance(upgrade.estimatedCost, upgrade.actualCost) > 0 ? 'error.main' : 'success.main'}
                          >
                            Thực tế: {formatCurrency(upgrade.actualCost)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(upgrade.status)}
                          color={getStatusColor(upgrade.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption">
                            Co-owners: {upgrade.coOwnerVotes.approve}/{upgrade.coOwnerVotes.approve + upgrade.coOwnerVotes.reject + upgrade.coOwnerVotes.pending}
                          </Typography><br />
                          <Typography variant="caption">
                            Staff: {upgrade.staffApproval === 'approved' ? '✓' : 
                                   upgrade.staffApproval === 'rejected' ? '✗' : '⏳'}
                          </Typography>
                          {upgrade.adminOverride && (
                            <Chip label="Admin Override" size="small" color="warning" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          Yêu cầu: {formatDateTime(upgrade.dateRequested)}
                        </Typography>
                        {upgrade.dateCompleted && (
                          <>
                            <br />
                            <Typography variant="caption">
                              Hoàn thành: {formatDateTime(upgrade.dateCompleted)}
                            </Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => {
                          setSelectedUpgrade(upgrade);
                          setUpgradeDialogOpen(true);
                        }}>
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Tab: Special Requests */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nâng cấp</TableCell>
                <TableCell>Loại yêu cầu</TableCell>
                <TableCell>Lý do</TableCell>
                <TableCell>Người yêu cầu</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {upgradeRequests.map((request) => {
                const upgrade = allUpgrades.find(u => u.upgradeId === request.upgradeId);
                return (
                  <TableRow key={request.requestId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {upgrade?.vehicleName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getUpgradeTypeLabel(upgrade?.upgradeType)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={
                          request.requestType === 'expedite' ? 'Đẩy nhanh' :
                          request.requestType === 'budget_increase' ? 'Tăng ngân sách' :
                          request.requestType === 'scope_change' ? 'Thay đổi phạm vi' : 
                          request.requestType
                        }
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {request.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{formatDateTime(request.dateRequested)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={
                          request.status === 'pending' ? 'Chờ xử lý' :
                          request.status === 'approved' ? 'Chấp nhận' : 'Từ chối'
                        }
                        color={
                          request.status === 'pending' ? 'warning' :
                          request.status === 'approved' ? 'success' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <>
                          <IconButton 
                            color="success"
                            onClick={() => handleRequestResponse(request.requestId, 'approve', '')}
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            onClick={() => handleRequestResponse(request.requestId, 'reject', '')}
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: Cost Analysis */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân tích chi phí tổng thể
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Tổng ngân sách đã sử dụng: <strong>{formatCurrency(upgradeStatistics?.costAnalysis?.totalBudgetUsed)}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Chi phí vượt dự toán TB: <strong>{upgradeStatistics?.costAnalysis?.averageCostOverrun}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Nâng cấp đắt nhất: <strong>{formatCurrency(upgradeStatistics?.costAnalysis?.mostExpensiveUpgrade)}</strong>
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Tổng tiết kiệm: <strong>{formatCurrency(upgradeStatistics?.costAnalysis?.totalSavings)}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân bố chi phí theo loại
                </Typography>
                {Object.entries(upgradeStatistics?.upgradeTypeDistribution || {}).map(([type, count]) => (
                  <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {getUpgradeTypeLabel(type)}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} lần
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab: Performance Statistics */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Metrics phê duyệt
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Thời gian phê duyệt TB: <strong>{upgradeStatistics?.approvalMetrics?.averageApprovalTime} ngày</strong>
                  </Typography>
                  <Typography variant="body2">
                    Tỷ lệ phê duyệt tự động: <strong>{upgradeStatistics?.approvalMetrics?.autoApprovalRate}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Tỷ lệ Admin Override: <strong>{upgradeStatistics?.approvalMetrics?.adminOverrideRate}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Hài lòng Co-owner: <strong>{upgradeStatistics?.approvalMetrics?.coOwnerSatisfaction}/5</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân bố trạng thái
                </Typography>
                {Object.entries(upgradeStatistics?.statusDistribution || {}).map(([status, count]) => (
                  <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {getStatusLabel(status)}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} nâng cấp
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Upgrade Detail Dialog */}
      <Dialog 
        open={upgradeDialogOpen} 
        onClose={() => setUpgradeDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Chi tiết nâng cấp - {selectedUpgrade?.vehicleName}
        </DialogTitle>
        <DialogContent>
          {selectedUpgrade && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Thông tin hiện tại</Typography>
                {Object.entries(selectedUpgrade.currentSpecs).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {value}
                  </Typography>
                ))}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Nâng cấp đề xuất</Typography>
                {Object.entries(selectedUpgrade.proposedSpecs).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {value}
                  </Typography>
                ))}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Ghi chú</Typography>
                <Typography variant="body2">{selectedUpgrade.notes}</Typography>
              </Grid>
              
              {selectedUpgrade.completionReport && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Báo cáo hoàn thành</Typography>
                  <Typography variant="body2">
                    Đánh giá hài lòng: {selectedUpgrade.completionReport.satisfactionRating}/5
                  </Typography>
                  <Typography variant="body2">
                    Cải thiện hiệu suất: +{selectedUpgrade.completionReport.performanceImprovement}%
                  </Typography>
                  <Typography variant="body2">
                    Tiết kiệm nhiên liệu: +{selectedUpgrade.completionReport.fuelEfficiencyGain}%
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Admin Override Dialog */}
      <Dialog open={adminOverrideDialogOpen} onClose={() => setAdminOverrideDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Admin Override - Phê duyệt đặc biệt</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Chức năng này cho phép Admin phê duyệt hoặc từ chối nâng cấp bỏ qua quy trình bình thường.
          </Alert>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chọn nâng cấp</InputLabel>
                <Select defaultValue="">
                  {allUpgrades
                    .filter(u => u.status === 'pending_approval')
                    .map(upgrade => (
                    <MenuItem key={upgrade.upgradeId} value={upgrade.upgradeId}>
                      {upgrade.vehicleName} - {getUpgradeTypeLabel(upgrade.upgradeType)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do override"
                multiline
                rows={3}
                placeholder="Nhập lý do sử dụng quyền Admin override..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminOverrideDialogOpen(false)}>Hủy</Button>
          <Button color="error" onClick={() => handleAdminOverride(null, 'reject', '')}>
            Từ chối
          </Button>
          <Button variant="contained" onClick={() => handleAdminOverride(null, 'approve', '')}>
            Phê duyệt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleUpgradeOversight;