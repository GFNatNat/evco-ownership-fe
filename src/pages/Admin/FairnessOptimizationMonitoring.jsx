import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel,
  LinearProgress, Slider
} from '@mui/material';
import {
  Psychology as AIIcon, TrendingUp as TrendIcon, Settings as SettingsIcon,
  Visibility as ViewIcon, PlayArrow as RunIcon, Stop as StopIcon,
  Assessment as ReportIcon, Tune as TuneIcon, BarChart as ChartIcon
} from '@mui/icons-material';
import fairnessOptimizationApi from '../../api/fairnessOptimizationApi';

const FairnessOptimizationMonitoring = () => {
  const [optimizationStatus, setOptimizationStatus] = useState(null);
  const [fairnessScores, setFairnessScores] = useState([]);
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [systemConfig, setSystemConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [runOptimizationDialogOpen, setRunOptimizationDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedCoOwnerGroup, setSelectedCoOwnerGroup] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin monitoring
      const mockOptimizationStatus = {
        isRunning: true,
        currentIteration: 1247,
        totalIterations: 2000,
        progress: 62.35,
        estimatedTimeRemaining: 45,
        lastRunTime: '2024-10-24T14:30:00Z',
        nextScheduledRun: '2024-10-25T02:00:00Z',
        currentObjective: 'minimize_usage_variance',
        overallEfficiency: 87.3,
        convergenceStatus: 'improving',
        resourceUsage: {
          cpu: 23.5,
          memory: 67.2,
          storage: 12.1
        }
      };

      const mockFairnessScores = [
        {
          vehicleId: 1,
          vehicleName: 'Toyota Camry 2023',
          licensePlate: '30A-12345',
          coOwners: [
            { 
              id: 1, 
              name: 'Nguyễn Văn A', 
              currentScore: 85.2, 
              targetScore: 85.0, 
              variance: 0.2,
              usageHours: 42.5,
              fairShare: 40.0,
              paymentRatio: 0.33,
              satisfactionLevel: 4.2
            },
            { 
              id: 2, 
              name: 'Trần Thị B', 
              currentScore: 82.8, 
              targetScore: 85.0, 
              variance: -2.2,
              usageHours: 38.2,
              fairShare: 40.0,
              paymentRatio: 0.33,
              satisfactionLevel: 3.9
            },
            { 
              id: 3, 
              name: 'Lê Văn C', 
              currentScore: 87.1, 
              targetScore: 85.0, 
              variance: 2.1,
              usageHours: 43.1,
              fairShare: 40.0,
              paymentRatio: 0.34,
              satisfactionLevel: 4.5
            }
          ],
          groupFairnessScore: 85.0,
          groupVariance: 1.8,
          recommendedAdjustments: [
            'Tăng slot booking cho Trần Thị B',
            'Điều chỉnh chi phí maintenance cho cân bằng'
          ]
        },
        {
          vehicleId: 2,
          vehicleName: 'Honda Civic 2022',
          licensePlate: '29B-67890',
          coOwners: [
            { 
              id: 4, 
              name: 'Phạm Văn D', 
              currentScore: 78.5, 
              targetScore: 80.0, 
              variance: -1.5,
              usageHours: 35.2,
              fairShare: 40.0,
              paymentRatio: 0.50,
              satisfactionLevel: 3.8
            },
            { 
              id: 5, 
              name: 'Võ Thị E', 
              currentScore: 81.3, 
              targetScore: 80.0, 
              variance: 1.3,
              usageHours: 44.8,
              fairShare: 40.0,
              paymentRatio: 0.50,
              satisfactionLevel: 4.3
            }
          ],
          groupFairnessScore: 79.9,
          groupVariance: 1.4,
          recommendedAdjustments: [
            'Cân bằng thời gian sử dụng giữa 2 co-owner'
          ]
        }
      ];

      const mockOptimizationHistory = [
        {
          runId: 1,
          startTime: '2024-10-24T02:00:00Z',
          endTime: '2024-10-24T03:15:00Z',
          duration: 75,
          status: 'completed',
          vehiclesProcessed: 15,
          improvementAchieved: 3.2,
          finalScore: 87.3,
          adjustmentsMade: 28,
          energyConsumed: 2.3,
          trigger: 'scheduled'
        },
        {
          runId: 2,
          startTime: '2024-10-23T02:00:00Z',
          endTime: '2024-10-23T02:45:00Z',
          duration: 45,
          status: 'completed',
          vehiclesProcessed: 12,
          improvementAchieved: 2.1,
          finalScore: 84.1,
          adjustmentsMade: 15,
          energyConsumed: 1.8,
          trigger: 'scheduled'
        },
        {
          runId: 3,
          startTime: '2024-10-22T14:30:00Z',
          endTime: '2024-10-22T14:35:00Z',
          duration: 5,
          status: 'interrupted',
          vehiclesProcessed: 3,
          improvementAchieved: 0.0,
          finalScore: 82.0,
          adjustmentsMade: 0,
          energyConsumed: 0.2,
          trigger: 'manual'
        }
      ];

      const mockSystemConfig = {
        optimization: {
          algorithm: 'genetic_algorithm',
          populationSize: 100,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          maxIterations: 2000,
          convergenceThreshold: 0.001,
          elitismRate: 0.1
        },
        fairness: {
          usageWeight: 0.4,
          paymentWeight: 0.3,
          satisfactionWeight: 0.3,
          varianceThreshold: 5.0,
          targetFairnessScore: 85.0,
          rebalanceFrequency: 'daily'
        },
        performance: {
          maxCpuUsage: 50.0,
          maxMemoryUsage: 80.0,
          timeoutMinutes: 120,
          enableParallelProcessing: true,
          loggingLevel: 'info'
        },
        notifications: {
          enableAlerts: true,
          alertThreshold: 75.0,
          emailRecipients: ['admin@company.com', 'ai-team@company.com'],
          slackWebhook: 'https://hooks.slack.com/...'
        }
      };

      setOptimizationStatus(mockOptimizationStatus);
      setFairnessScores(mockFairnessScores);
      setOptimizationHistory(mockOptimizationHistory);
      setSystemConfig(mockSystemConfig);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunOptimization = async (config) => {
    try {
      console.log('Running optimization with config:', config);
      alert('Đã khởi chạy quy trình tối ưu fairness. Hệ thống sẽ tự động cập nhật kết quả.');
      setRunOptimizationDialogOpen(false);
      // Reload data to show running status
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (error) {
      console.error('Error running optimization:', error);
    }
  };

  const handleStopOptimization = async () => {
    try {
      console.log('Stopping optimization...');
      alert('Đã dừng quy trình tối ưu fairness.');
      loadData();
    } catch (error) {
      console.error('Error stopping optimization:', error);
    }
  };

  const handleUpdateConfig = async (newConfig) => {
    try {
      console.log('Updating config:', newConfig);
      alert('Cấu hình hệ thống đã được cập nhật thành công!');
      setConfigDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const getScoreColor = (score, target) => {
    const diff = Math.abs(score - target);
    if (diff <= 2) return 'success.main';
    if (diff <= 5) return 'warning.main';
    return 'error.main';
  };

  const getVarianceColor = (variance) => {
    const absVariance = Math.abs(variance);
    if (absVariance <= 1) return 'success.main';
    if (absVariance <= 3) return 'warning.main';
    return 'error.main';
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Giám sát AI Fairness Optimization
        </Typography>
        <Box>
          {optimizationStatus?.isRunning ? (
            <Button 
              variant="contained" 
              color="error"
              startIcon={<StopIcon />}
              onClick={handleStopOptimization}
              sx={{ mr: 1 }}
            >
              Dừng AI
            </Button>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<RunIcon />}
              onClick={() => setRunOptimizationDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Chạy tối ưu
            </Button>
          )}
          <Button 
            variant="outlined" 
            startIcon={<SettingsIcon />}
            onClick={() => setConfigDialogOpen(true)}
          >
            Cấu hình
          </Button>
        </Box>
      </Box>

      {/* Real-time Status Card */}
      <Card sx={{ mb: 3, background: optimizationStatus?.isRunning ? 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)' : 'inherit' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AIIcon sx={{ mr: 2, color: optimizationStatus?.isRunning ? 'white' : 'primary.main' }} />
                <Typography 
                  variant="h6" 
                  color={optimizationStatus?.isRunning ? 'white' : 'inherit'}
                >
                  {optimizationStatus?.isRunning ? 'AI đang chạy...' : 'AI không hoạt động'}
                </Typography>
              </Box>
              
              {optimizationStatus?.isRunning && (
                <>
                  <Typography variant="body2" color="white" gutterBottom>
                    Tiến độ: {optimizationStatus.currentIteration}/{optimizationStatus.totalIterations} iterations
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={optimizationStatus.progress} 
                    sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.3)' }}
                  />
                  <Typography variant="caption" color="white">
                    Còn lại khoảng {optimizationStatus.estimatedTimeRemaining} phút
                  </Typography>
                </>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color={optimizationStatus?.isRunning ? 'white' : 'primary.main'}>
                    {optimizationStatus?.overallEfficiency || 0}%
                  </Typography>
                  <Typography variant="caption" color={optimizationStatus?.isRunning ? 'white' : 'text.secondary'}>
                    Hiệu quả tổng thể
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color={optimizationStatus?.isRunning ? 'white' : 'success.main'}>
                    {fairnessScores.length}
                  </Typography>
                  <Typography variant="caption" color={optimizationStatus?.isRunning ? 'white' : 'text.secondary'}>
                    Nhóm xe đang giám sát
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Fairness Scores" />
        <Tab label="Lịch sử tối ưu" />
        <Tab label="Tài nguyên hệ thống" />
        <Tab label="Cấu hình nâng cao" />
      </Tabs>

      {/* Tab: Fairness Scores */}
      {tabValue === 0 && (
        <>
          <FormControl sx={{ mb: 3, minWidth: 200 }}>
            <InputLabel>Chọn nhóm xe</InputLabel>
            <Select
              value={selectedCoOwnerGroup}
              onChange={(e) => setSelectedCoOwnerGroup(e.target.value)}
            >
              <MenuItem value="all">Tất cả nhóm</MenuItem>
              {fairnessScores.map(group => (
                <MenuItem key={group.vehicleId} value={group.vehicleId}>
                  {group.vehicleName} ({group.licensePlate})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {fairnessScores
            .filter(group => selectedCoOwnerGroup === 'all' || group.vehicleId === selectedCoOwnerGroup)
            .map((group) => (
              <Card key={group.vehicleId} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {group.vehicleName} ({group.licensePlate})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h5" color="primary" sx={{ mr: 2 }}>
                        {group.groupFairnessScore}
                      </Typography>
                      <Chip 
                        label={`Variance: ±${group.groupVariance}`}
                        color={group.groupVariance <= 2 ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Co-owner</TableCell>
                          <TableCell>Fairness Score</TableCell>
                          <TableCell>Sử dụng</TableCell>
                          <TableCell>Chi phí</TableCell>
                          <TableCell>Hài lòng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.coOwners.map((coOwner) => (
                          <TableRow key={coOwner.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {coOwner.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                  variant="body2" 
                                  color={getScoreColor(coOwner.currentScore, coOwner.targetScore)}
                                  fontWeight="bold"
                                >
                                  {coOwner.currentScore}
                                </Typography>
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                  (Target: {coOwner.targetScore})
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color={getVarianceColor(coOwner.variance)}
                                  sx={{ ml: 1 }}
                                >
                                  {coOwner.variance > 0 ? '+' : ''}{coOwner.variance.toFixed(1)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {coOwner.usageHours}h / {coOwner.fairShare}h
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={(coOwner.usageHours / coOwner.fairShare) * 100} 
                                sx={{ mt: 0.5 }}
                                color={Math.abs(coOwner.usageHours - coOwner.fairShare) <= 2 ? 'success' : 'warning'}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {(coOwner.paymentRatio * 100).toFixed(1)}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {coOwner.satisfactionLevel}/5
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {group.recommendedAdjustments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Đề xuất điều chỉnh:
                      </Typography>
                      {group.recommendedAdjustments.map((adjustment, index) => (
                        <Alert key={index} severity="info" sx={{ mt: 1 }}>
                          {adjustment}
                        </Alert>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
        </>
      )}

      {/* Tab: Optimization History */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Thời lượng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Xe xử lý</TableCell>
                <TableCell>Cải thiện</TableCell>
                <TableCell>Điều chỉnh</TableCell>
                <TableCell>Trigger</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {optimizationHistory.map((run) => (
                <TableRow key={run.runId}>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateTime(run.startTime)}
                    </Typography>
                    {run.endTime && (
                      <Typography variant="caption" color="text.secondary">
                        → {formatDateTime(run.endTime)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{formatDuration(run.duration)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        run.status === 'completed' ? 'Hoàn thành' :
                        run.status === 'running' ? 'Đang chạy' :
                        run.status === 'interrupted' ? 'Bị gián đoạn' : 'Lỗi'
                      }
                      color={
                        run.status === 'completed' ? 'success' :
                        run.status === 'running' ? 'info' :
                        run.status === 'interrupted' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{run.vehiclesProcessed} xe</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={run.improvementAchieved > 0 ? 'success.main' : 'text.secondary'}
                    >
                      +{run.improvementAchieved.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Final: {run.finalScore}
                    </Typography>
                  </TableCell>
                  <TableCell>{run.adjustmentsMade} thay đổi</TableCell>
                  <TableCell>
                    <Chip 
                      label={run.trigger === 'scheduled' ? 'Tự động' : 'Thủ công'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: System Resources */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>CPU Usage</Typography>
                <Typography variant="h4" color="primary">
                  {optimizationStatus?.resourceUsage?.cpu || 0}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={optimizationStatus?.resourceUsage?.cpu || 0} 
                  sx={{ mt: 1 }}
                  color={optimizationStatus?.resourceUsage?.cpu > 80 ? 'error' : 'primary'}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Memory Usage</Typography>
                <Typography variant="h4" color="info.main">
                  {optimizationStatus?.resourceUsage?.memory || 0}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={optimizationStatus?.resourceUsage?.memory || 0} 
                  sx={{ mt: 1 }}
                  color={optimizationStatus?.resourceUsage?.memory > 80 ? 'error' : 'info'}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Storage Usage</Typography>
                <Typography variant="h4" color="success.main">
                  {optimizationStatus?.resourceUsage?.storage || 0}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={optimizationStatus?.resourceUsage?.storage || 0} 
                  sx={{ mt: 1 }}
                  color="success"
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>System Health</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Lần chạy cuối: {formatDateTime(optimizationStatus?.lastRunTime)}
                    </Typography>
                    <Typography variant="body2">
                      Lần chạy tiếp theo: {formatDateTime(optimizationStatus?.nextScheduledRun)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Trạng thái hội tụ: {optimizationStatus?.convergenceStatus === 'improving' ? 'Đang cải thiện' : 'Ổn định'}
                    </Typography>
                    <Typography variant="body2">
                      Mục tiêu hiện tại: {optimizationStatus?.currentObjective === 'minimize_usage_variance' ? 'Giảm variance sử dụng' : optimizationStatus?.currentObjective}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab: Advanced Configuration */}
      {tabValue === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Thuật toán Optimization</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Thuật toán: <strong>{systemConfig?.optimization?.algorithm}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Population size: <strong>{systemConfig?.optimization?.populationSize}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Max iterations: <strong>{systemConfig?.optimization?.maxIterations}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Convergence threshold: <strong>{systemConfig?.optimization?.convergenceThreshold}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Fairness Weights</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Usage weight: <strong>{(systemConfig?.fairness?.usageWeight * 100)}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Payment weight: <strong>{(systemConfig?.fairness?.paymentWeight * 100)}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Satisfaction weight: <strong>{(systemConfig?.fairness?.satisfactionWeight * 100)}%</strong>
                  </Typography>
                  <Typography variant="body2">
                    Target score: <strong>{systemConfig?.fairness?.targetFairnessScore}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Performance & Notifications</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Max CPU usage: <strong>{systemConfig?.performance?.maxCpuUsage}%</strong>
                    </Typography>
                    <Typography variant="body2">
                      Max memory usage: <strong>{systemConfig?.performance?.maxMemoryUsage}%</strong>
                    </Typography>
                    <Typography variant="body2">
                      Timeout: <strong>{systemConfig?.performance?.timeoutMinutes} minutes</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      Alerts enabled: <strong>{systemConfig?.notifications?.enableAlerts ? 'Yes' : 'No'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Alert threshold: <strong>{systemConfig?.notifications?.alertThreshold}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Email recipients: <strong>{systemConfig?.notifications?.emailRecipients?.length || 0}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Run Optimization Dialog */}
      <Dialog open={runOptimizationDialogOpen} onClose={() => setRunOptimizationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chạy tối ưu Fairness</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Hệ thống AI sẽ phân tích và tối ưu fairness scores cho tất cả nhóm co-owner.
          </Alert>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mục tiêu tối ưu</InputLabel>
                <Select defaultValue="minimize_usage_variance">
                  <MenuItem value="minimize_usage_variance">Giảm variance sử dụng</MenuItem>
                  <MenuItem value="maximize_satisfaction">Tối đa hài lòng</MenuItem>
                  <MenuItem value="balance_payments">Cân bằng chi phí</MenuItem>
                  <MenuItem value="hybrid_optimization">Tối ưu tổng hợp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Áp dụng ngay khi hoàn thành"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Chế độ aggressive (nhanh hơn nhưng có thể kém chính xác)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRunOptimizationDialogOpen(false)}>Hủy</Button>
          <Button onClick={() => handleRunOptimization({})} variant="contained">
            Bắt đầu tối ưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cấu hình hệ thống AI</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Thuật toán</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Loại thuật toán</InputLabel>
                <Select defaultValue="genetic_algorithm">
                  <MenuItem value="genetic_algorithm">Genetic Algorithm</MenuItem>
                  <MenuItem value="particle_swarm">Particle Swarm</MenuItem>
                  <MenuItem value="simulated_annealing">Simulated Annealing</MenuItem>
                  <MenuItem value="neural_network">Neural Network</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Population Size"
                type="number"
                defaultValue={100}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Max Iterations"
                type="number"
                defaultValue={2000}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Weights</Typography>
              <Typography gutterBottom>Usage Weight: 40%</Typography>
              <Slider
                defaultValue={40}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
              
              <Typography gutterBottom>Payment Weight: 30%</Typography>
              <Slider
                defaultValue={30}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
              
              <Typography gutterBottom>Satisfaction Weight: 30%</Typography>
              <Slider
                defaultValue={30}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Hủy</Button>
          <Button onClick={() => handleUpdateConfig({})} variant="contained">
            Lưu cấu hình
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FairnessOptimizationMonitoring;