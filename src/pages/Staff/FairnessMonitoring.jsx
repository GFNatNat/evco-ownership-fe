import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton
} from '@mui/material';
import {
  Analytics as AnalyticsIcon, Visibility as ViewIcon, Warning as WarningIcon,
  TrendingUp as TrendingIcon, Assessment as ReportIcon, Settings as SettingsIcon
} from '@mui/icons-material';
import fairnessOptimizationApi from '../../api/fairnessOptimizationApi';

const FairnessMonitoring = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [fairnessReports, setFairnessReports] = useState({});
  const [systemWideStats, setSystemWideStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock vehicles data
      const mockVehicles = [
        { id: 1, name: 'Toyota Camry 2023', licensePlate: '30A-12345' },
        { id: 2, name: 'Honda Civic 2022', licensePlate: '29B-67890' },
        { id: 3, name: 'Mazda CX-5 2023', licensePlate: '51C-11111' }
      ];
      setVehicles(mockVehicles);

      // Load fairness reports for each vehicle
      const reportsData = {};
      for (const vehicle of mockVehicles) {
        try {
          const report = await fairnessOptimizationApi.getFairnessReport(vehicle.id, {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString(),
            includeRecommendations: true
          });
          reportsData[vehicle.id] = fairnessOptimizationApi.formatFairnessReportForDisplay(report.data);
        } catch (error) {
          console.error(`Error loading fairness report for vehicle ${vehicle.id}:`, error);
          reportsData[vehicle.id] = null;
        }
      }
      setFairnessReports(reportsData);

      // Mock system-wide statistics
      setSystemWideStats({
        totalVehicles: mockVehicles.length,
        vehiclesWithIssues: 1,
        averageFairnessScore: 78.5,
        totalRecommendations: 12,
        criticalIssues: 2,
        improvedVehicles: 2,
        monthlyTrend: [75, 76, 78, 78.5]
      });

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = (vehicleId) => {
    setSelectedVehicle(vehicleId);
  };

  const getVehicleFairnessStatus = (report) => {
    if (!report) return { status: 'unknown', color: 'grey' };
    
    const score = report.overview?.fairnessScore || 0;
    if (score >= 85) return { status: 'excellent', color: 'success', label: 'Tuyệt vời' };
    if (score >= 75) return { status: 'good', color: 'info', label: 'Tốt' };
    if (score >= 60) return { status: 'fair', color: 'warning', label: 'Trung bình' };
    return { status: 'poor', color: 'error', label: 'Cần cải thiện' };
  };

  const getRecommendationCount = (report) => {
    return report?.recommendations?.length || 0;
  };

  const getCriticalRecommendations = (report) => {
    return report?.recommendations?.filter(rec => rec.priority === 'Critical' || rec.priority === 'High') || [];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Giám sát Công bằng Hệ thống
      </Typography>

      {/* System Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {systemWideStats?.totalVehicles || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng số xe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {systemWideStats?.vehiclesWithIssues || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Xe có vấn đề
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {formatPercentage(systemWideStats?.averageFairnessScore)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điểm công bằng TB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {systemWideStats?.criticalIssues || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vấn đề nghiêm trọng
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Tổng quan hệ thống" />
        <Tab label="Chi tiết từng xe" />
        <Tab label="Khuyến nghị ưu tiên" />
        <Tab label="Báo cáo xu hướng" />
      </Tabs>

      {/* Tab: System Overview */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trạng thái công bằng các xe
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Xe</TableCell>
                        <TableCell>Điểm công bằng</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Số khuyến nghị</TableCell>
                        <TableCell>Vấn đề ưu tiên</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vehicles.map((vehicle) => {
                        const report = fairnessReports[vehicle.id];
                        const status = getVehicleFairnessStatus(report);
                        const criticalRecs = getCriticalRecommendations(report);
                        
                        return (
                          <TableRow key={vehicle.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {vehicle.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {vehicle.licensePlate}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">
                                {formatPercentage(report?.overview?.fairnessScore)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={status.label}
                                color={status.color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {getRecommendationCount(report)}
                            </TableCell>
                            <TableCell>
                              {criticalRecs.length > 0 ? (
                                <Chip 
                                  icon={<WarningIcon />}
                                  label={`${criticalRecs.length} vấn đề`}
                                  color="error"
                                  size="small"
                                />
                              ) : (
                                <Chip label="Ổn định" color="success" size="small" />
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={() => {
                                setSelectedVehicle(vehicle.id);
                                setTabValue(1);
                              }}>
                                <ViewIcon />
                              </IconButton>
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
        </Grid>
      )}

      {/* Tab: Vehicle Details */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl sx={{ mb: 3, minWidth: 300 }}>
              <InputLabel>Chọn xe để xem chi tiết</InputLabel>
              <Select
                value={selectedVehicle}
                onChange={(e) => handleVehicleChange(e.target.value)}
              >
                {vehicles.map(vehicle => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.licensePlate})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedVehicle && fairnessReports[selectedVehicle] && (
            <>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Điểm công bằng tổng thể
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {formatPercentage(fairnessReports[selectedVehicle].overview?.fairnessScore)}
                    </Typography>
                    <Chip 
                      label={getVehicleFairnessStatus(fairnessReports[selectedVehicle]).label}
                      color={getVehicleFairnessStatus(fairnessReports[selectedVehicle]).color}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Chi tiết đồng sở hữu
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Đồng sở hữu</TableCell>
                            <TableCell>% Sở hữu</TableCell>
                            <TableCell>% Sử dụng</TableCell>
                            <TableCell>Chênh lệch</TableCell>
                            <TableCell>Chi phí điều chỉnh</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fairnessReports[selectedVehicle].coOwnersDetails?.map((coOwner, index) => (
                            <TableRow key={index}>
                              <TableCell>{coOwner.coOwnerName}</TableCell>
                              <TableCell>{coOwner.formattedOwnershipPercentage}</TableCell>
                              <TableCell>{coOwner.formattedUsagePercentage}</TableCell>
                              <TableCell>
                                <Typography 
                                  color={Math.abs(coOwner.usageVsOwnershipDelta) > 10 ? 'error' : 'success'}
                                >
                                  {coOwner.formattedUsageDelta}
                                </Typography>
                              </TableCell>
                              <TableCell>{coOwner.formattedCostAdjustmentNeeded}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Khuyến nghị cải thiện
                    </Typography>
                    {fairnessReports[selectedVehicle].recommendations?.map((rec, index) => (
                      <Alert 
                        key={index}
                        severity={rec.priority === 'Critical' ? 'error' : rec.priority === 'High' ? 'warning' : 'info'}
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {rec.recommendationType}
                        </Typography>
                        <Typography variant="body2">
                          {rec.description}
                        </Typography>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}

      {/* Tab: Priority Recommendations */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Khuyến nghị ưu tiên cao cho toàn hệ thống
                </Typography>
                {vehicles.map(vehicle => {
                  const report = fairnessReports[vehicle.id];
                  const criticalRecs = getCriticalRecommendations(report);
                  
                  if (criticalRecs.length === 0) return null;
                  
                  return (
                    <Box key={vehicle.id} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {vehicle.name} ({vehicle.licensePlate})
                      </Typography>
                      {criticalRecs.map((rec, index) => (
                        <Alert 
                          key={index}
                          severity={rec.priority === 'Critical' ? 'error' : 'warning'}
                          sx={{ mb: 1 }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            [{rec.priorityInfo?.name}] {rec.recommendationType}
                          </Typography>
                          <Typography variant="body2">
                            {rec.description}
                          </Typography>
                        </Alert>
                      ))}
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab: Trend Reports */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Xu hướng điểm công bằng hệ thống (4 tháng gần nhất)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {systemWideStats?.monthlyTrend?.map((score, index) => (
                    <Card key={index} variant="outlined" sx={{ minWidth: 120, textAlign: 'center' }}>
                      <CardContent>
                        <Typography variant="h6">
                          {formatPercentage(score)}
                        </Typography>
                        <Typography variant="caption">
                          Tháng {index + 1}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                  <Box sx={{ ml: 2 }}>
                    <Chip 
                      icon={<TrendingIcon />}
                      label="Xu hướng tăng"
                      color="success"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Báo cáo cải thiện
                </Typography>
                <Typography variant="body2" paragraph>
                  • {systemWideStats?.improvedVehicles || 0} xe đã cải thiện điểm công bằng trong tháng qua
                </Typography>
                <Typography variant="body2" paragraph>
                  • Giảm {systemWideStats?.criticalIssues || 0} vấn đề nghiêm trọng so với tháng trước
                </Typography>
                <Typography variant="body2" paragraph>
                  • Trung bình {systemWideStats?.totalRecommendations || 0} khuyến nghị được thực hiện mỗi tháng
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FairnessMonitoring;