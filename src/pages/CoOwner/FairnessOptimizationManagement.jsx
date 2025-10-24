import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    CircularProgress,
    Tab,
    Tabs,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    TrendingUp,
    Schedule,
    Build,
    MonetizationOn,
    ExpandMore,
    Assessment,
    Lightbulb,
    History,
    Refresh,
    CalendarToday,
    Speed,
    Battery3Bar,
    Error as ErrorIcon,
    CheckCircle,
    Warning
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fairnessOptimizationApi from '../../api/fairnessOptimizationApi';
import vehicleApi from '../../api/vehicleApi';

const FairnessOptimizationManagement = () => {
    const [tabValue, setTabValue] = useState(0);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Analysis data
    const [fairnessReport, setFairnessReport] = useState(null);
    const [scheduleSuggestions, setScheduleSuggestions] = useState(null);
    const [maintenanceSuggestions, setMaintenanceSuggestions] = useState(null);
    const [costSavingRecommendations, setCostSavingRecommendations] = useState(null);

    // Analysis parameters
    const [analysisParams, setAnalysisParams] = useState({
        startDate: null,
        endDate: null,
        includeRecommendations: true,
        preferredDurationHours: 4,
        usageType: '',
        includePredictive: true,
        lookaheadDays: 30,
        analysisPeriodDays: 90,
        includeFundOptimization: true,
        includeMaintenanceOptimization: true
    });

    useEffect(() => {
        loadVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicleId) {
            loadAnalysisData();
        }
    }, [selectedVehicleId, tabValue]);

    const loadVehicles = async () => {
        try {
            const response = await vehicleApi.getMyVehicles();
            setVehicles(response.data || []);

            if (response.data?.length > 0) {
                setSelectedVehicleId(response.data[0].id);
            }
        } catch (error) {
            console.error('Error loading vehicles:', error);
            setError('Không thể tải danh sách xe');
        }
    };

    const loadAnalysisData = async () => {
        if (!selectedVehicleId) return;

        try {
            setLoading(true);
            setError('');

            if (tabValue === 0) {
                // Load fairness report
                const response = await fairnessOptimizationApi.getFairnessReport(selectedVehicleId, {
                    startDate: analysisParams.startDate,
                    endDate: analysisParams.endDate,
                    includeRecommendations: analysisParams.includeRecommendations
                });

                setFairnessReport(fairnessOptimizationApi.formatFairnessReportForDisplay(response.data));
            } else if (tabValue === 1) {
                // Load schedule suggestions
                const response = await fairnessOptimizationApi.getScheduleSuggestions(selectedVehicleId, {
                    startDate: analysisParams.startDate,
                    endDate: analysisParams.endDate,
                    preferredDurationHours: analysisParams.preferredDurationHours,
                    usageType: analysisParams.usageType
                });

                setScheduleSuggestions(fairnessOptimizationApi.formatScheduleSuggestionsForDisplay(response.data));
            } else if (tabValue === 2) {
                // Load maintenance suggestions
                const response = await fairnessOptimizationApi.getMaintenanceSuggestions(selectedVehicleId, {
                    includePredictive: analysisParams.includePredictive,
                    lookaheadDays: analysisParams.lookaheadDays
                });

                setMaintenanceSuggestions(fairnessOptimizationApi.formatMaintenanceSuggestionsForDisplay(response.data));
            } else if (tabValue === 3) {
                // Load cost saving recommendations
                const response = await fairnessOptimizationApi.getCostSavingRecommendations(selectedVehicleId, {
                    analysisPeriodDays: analysisParams.analysisPeriodDays,
                    includeFundOptimization: analysisParams.includeFundOptimization,
                    includeMaintenanceOptimization: analysisParams.includeMaintenanceOptimization
                });

                setCostSavingRecommendations(fairnessOptimizationApi.formatCostSavingRecommendationsForDisplay(response.data));
            }
        } catch (error) {
            console.error('Error loading analysis data:', error);
            setError('Không thể tải dữ liệu phân tích');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalysisParamsChange = (field, value) => {
        setAnalysisParams(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const refreshAnalysis = () => {
        loadAnalysisData();
    };

    const TabPanel = ({ children, value, index, ...other }) => (
        <div hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    const FairnessScoreCard = ({ score, status }) => {
        const scoreInfo = fairnessOptimizationApi.formatFairnessScore(score);

        return (
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Assessment color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Điểm công bằng tổng thể</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h3" sx={{ color: scoreInfo.color }}>
                                {score?.toFixed(1) || 0}
                            </Typography>
                            <Chip
                                label={scoreInfo.level}
                                sx={{ bgcolor: scoreInfo.bgColor, color: scoreInfo.color }}
                            />
                        </Box>
                        <Box sx={{ width: '40%' }}>
                            <LinearProgress
                                variant="determinate"
                                value={score || 0}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: scoreInfo.color
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Trạng thái: {status}
                    </Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    <TrendingUp sx={{ mr: 2, verticalAlign: 'middle' }} />
                    Tối ưu hóa Công bằng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Phân tích AI về công bằng sử dụng và đề xuất tối ưu hóa chi phí
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            {/* Vehicle Selection */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Chọn xe để phân tích</InputLabel>
                                <Select
                                    value={selectedVehicleId}
                                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                                    label="Chọn xe để phân tích"
                                >
                                    {vehicles.map(vehicle => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Từ ngày"
                                    value={analysisParams.startDate}
                                    onChange={(date) => handleAnalysisParamsChange('startDate', date)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Đến ngày"
                                    value={analysisParams.endDate}
                                    onChange={(date) => handleAnalysisParamsChange('endDate', date)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    minDate={analysisParams.startDate}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab label="Báo cáo công bằng" icon={<Assessment />} />
                        <Tab label="Gợi ý lịch trình" icon={<Schedule />} />
                        <Tab label="Dự đoán bảo trì" icon={<Build />} />
                        <Tab label="Tiết kiệm chi phí" icon={<MonetizationOn />} />
                    </Tabs>
                    <Button
                        variant="outlined"
                        onClick={refreshAnalysis}
                        startIcon={<Refresh />}
                        disabled={loading || !selectedVehicleId}
                    >
                        {loading ? 'Đang phân tích...' : 'Làm mới phân tích'}
                    </Button>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {/* Fairness Report */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : fairnessReport ? (
                        <>
                            <FairnessScoreCard
                                score={fairnessReport.overview?.fairnessScore}
                                status={fairnessReport.overview?.overallFairnessStatus}
                            />

                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Cân bằng
                                            </Typography>
                                            <Typography variant="h3" color="success.main">
                                                {fairnessReport.overview?.balancedCoOwnersCount || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                đồng sở hữu
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Sử dụng quá mức
                                            </Typography>
                                            <Typography variant="h3" color="error.main">
                                                {fairnessReport.overview?.overutilizedCoOwnersCount || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                đồng sở hữu
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Sử dụng ít
                                            </Typography>
                                            <Typography variant="h3" color="warning.main">
                                                {fairnessReport.overview?.underutilizedCoOwnersCount || 0}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                đồng sở hữu
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Co-owners Details */}
                            {fairnessReport.coOwnersDetails && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Chi tiết đồng sở hữu
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Tên</TableCell>
                                                        <TableCell>Tỷ lệ sở hữu</TableCell>
                                                        <TableCell>Tỷ lệ sử dụng</TableCell>
                                                        <TableCell>Chênh lệch</TableCell>
                                                        <TableCell>Mẫu sử dụng</TableCell>
                                                        <TableCell>Chi phí điều chỉnh</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {fairnessReport.coOwnersDetails.map((coOwner, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{coOwner.coOwnerName}</TableCell>
                                                            <TableCell>{coOwner.formattedOwnershipPercentage}</TableCell>
                                                            <TableCell>{coOwner.formattedUsagePercentage}</TableCell>
                                                            <TableCell>
                                                                <Typography sx={{ color: coOwner.usageDeltaColor }}>
                                                                    {coOwner.formattedUsageDelta}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    icon={coOwner.usagePatternInfo.icon}
                                                                    label={coOwner.usagePatternInfo.name}
                                                                    sx={{ color: coOwner.usagePatternInfo.color }}
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                            <TableCell>{coOwner.formattedCostAdjustmentNeeded}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recommendations */}
                            {fairnessReport.recommendations && fairnessReport.recommendations.length > 0 && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Khuyến nghị hành động
                                        </Typography>
                                        {fairnessReport.recommendations.map((recommendation, index) => (
                                            <Accordion key={index}>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                        <Chip
                                                            label={recommendation.priorityInfo.name}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: recommendation.priorityInfo.bgColor,
                                                                color: recommendation.priorityInfo.color,
                                                                mr: 2
                                                            }}
                                                        />
                                                        <Typography variant="subtitle1">
                                                            {recommendation.title}
                                                        </Typography>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography variant="body2" paragraph>
                                                        {recommendation.description}
                                                    </Typography>
                                                    {recommendation.actionItems && (
                                                        <List>
                                                            {recommendation.actionItems.map((action, actionIndex) => (
                                                                <ListItem key={actionIndex}>
                                                                    <ListItemIcon>
                                                                        <CheckCircle color="primary" />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={action} />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Chọn xe để xem báo cáo công bằng
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {/* Schedule Suggestions */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : scheduleSuggestions ? (
                        <>
                            {/* Analysis Parameters */}
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tham số phân tích
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Thời lượng ưu tiên (giờ)"
                                                value={analysisParams.preferredDurationHours}
                                                onChange={(e) => handleAnalysisParamsChange('preferredDurationHours', parseInt(e.target.value))}
                                                inputProps={{ min: 1, max: 24 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>Loại sử dụng</InputLabel>
                                                <Select
                                                    value={analysisParams.usageType}
                                                    onChange={(e) => handleAnalysisParamsChange('usageType', e.target.value)}
                                                    label="Loại sử dụng"
                                                >
                                                    <MenuItem value="">Tất cả</MenuItem>
                                                    {fairnessOptimizationApi.getUsageTypes().map(type => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Insights */}
                            {scheduleSuggestions.insights && (
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={3}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Tỷ lệ sử dụng hiện tại
                                                </Typography>
                                                <Typography variant="h4" color="primary">
                                                    {scheduleSuggestions.insights.formattedCurrentUtilizationRate}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Tỷ lệ tối ưu
                                                </Typography>
                                                <Typography variant="h4" color="success.main">
                                                    {scheduleSuggestions.insights.formattedOptimalUtilizationRate}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Xung đột đặt xe
                                                </Typography>
                                                <Typography variant="h4" color="warning.main">
                                                    {scheduleSuggestions.insights.conflictingBookingsCount || 0}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Tiềm năng cải thiện
                                                </Typography>
                                                <Typography variant="h4" color="info.main">
                                                    {scheduleSuggestions.insights.formattedPotentialEfficiencyGain}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}

                            {/* Co-owner Suggestions */}
                            {scheduleSuggestions.coOwnerSuggestions && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Gợi ý cho từng đồng sở hữu
                                        </Typography>
                                        {scheduleSuggestions.coOwnerSuggestions.map((suggestion, index) => (
                                            <Accordion key={index}>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <Typography variant="subtitle1">
                                                        {suggestion.coOwnerName} - {suggestion.formattedRecommendedUsagePercentage} khuyến nghị
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography variant="body2" paragraph>
                                                        {suggestion.rationale}
                                                    </Typography>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Khung giờ đề xuất ({suggestion.suggestedBookingsCount} đặt xe):
                                                    </Typography>
                                                    <List>
                                                        {suggestion.suggestedSlots?.map((slot, slotIndex) => (
                                                            <ListItem key={slotIndex}>
                                                                <ListItemIcon>
                                                                    <CalendarToday />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={`${slot.formattedStartTime} - ${slot.formattedEndTime}`}
                                                                    secondary={
                                                                        <Box>
                                                                            <Typography variant="body2">
                                                                                Lý do: {slot.reason}
                                                                            </Typography>
                                                                            <Chip
                                                                                label={`Rủi ro xung đột: ${slot.conflictRisk}`}
                                                                                size="small"
                                                                                sx={{ bgcolor: slot.conflictRiskColor, color: 'white', mt: 1 }}
                                                                            />
                                                                        </Box>
                                                                    }
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Chọn xe để xem gợi ý lịch trình
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    {/* Maintenance Suggestions */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : maintenanceSuggestions ? (
                        <>
                            {/* Health Status */}
                            {maintenanceSuggestions.healthStatus && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Tình trạng sức khỏe xe
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Số km hiện tại</Typography>
                                                <Typography variant="h6" color="primary">
                                                    {maintenanceSuggestions.healthStatus.formattedCurrentOdometer}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Trung bình/ngày</Typography>
                                                <Typography variant="h6" color="info.main">
                                                    {maintenanceSuggestions.healthStatus.formattedAverageDailyDistance}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Điểm sức khỏe</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="h6" sx={{ color: maintenanceSuggestions.healthStatus.healthScoreInfo.color }}>
                                                        {maintenanceSuggestions.healthStatus.healthScore}
                                                    </Typography>
                                                    <Chip
                                                        label={maintenanceSuggestions.healthStatus.healthScoreInfo.level}
                                                        size="small"
                                                        sx={{ ml: 1, bgcolor: maintenanceSuggestions.healthStatus.healthScoreInfo.bgColor }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Ngày bảo trì cuối</Typography>
                                                <Typography variant="h6">
                                                    {maintenanceSuggestions.healthStatus.daysSinceLastMaintenance} ngày trước
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Maintenance Suggestions */}
                            {maintenanceSuggestions.suggestions && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Đề xuất bảo trì
                                        </Typography>
                                        {maintenanceSuggestions.suggestions.map((suggestion, index) => (
                                            <Accordion key={index}>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Chip
                                                                label={suggestion.urgencyInfo.name}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: suggestion.urgencyInfo.bgColor,
                                                                    color: suggestion.urgencyInfo.color,
                                                                    mr: 2
                                                                }}
                                                            />
                                                            <Typography variant="subtitle1">
                                                                {suggestion.title}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" sx={{ color: suggestion.daysUntilRecommendedColor }}>
                                                            {suggestion.daysUntilRecommended} ngày nữa
                                                        </Typography>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={8}>
                                                            <Typography variant="body2" paragraph>
                                                                {suggestion.description}
                                                            </Typography>
                                                            <Typography variant="subtitle2">Lý do:</Typography>
                                                            <Typography variant="body2" paragraph>
                                                                {suggestion.reason}
                                                            </Typography>

                                                            <Typography variant="subtitle2">Lợi ích:</Typography>
                                                            <List>
                                                                {suggestion.benefits?.map((benefit, benefitIndex) => (
                                                                    <ListItem key={benefitIndex} sx={{ py: 0 }}>
                                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                                            <CheckCircle color="success" fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={benefit} />
                                                                    </ListItem>
                                                                ))}
                                                            </List>

                                                            <Typography variant="subtitle2">Hậu quả nếu không làm:</Typography>
                                                            <List>
                                                                {suggestion.consequences?.map((consequence, conseqIndex) => (
                                                                    <ListItem key={conseqIndex} sx={{ py: 0 }}>
                                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                                            <Warning color="warning" fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={consequence} />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Grid>

                                                        <Grid item xs={12} md={4}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography variant="subtitle2" gutterBottom>
                                                                        Chi phí ước tính
                                                                    </Typography>
                                                                    <Typography variant="h6" color="primary">
                                                                        {suggestion.formattedEstimatedCost}
                                                                    </Typography>

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        Tiết kiệm nếu làm ngay
                                                                    </Typography>
                                                                    <Typography variant="h6" color="success.main">
                                                                        {suggestion.formattedCostSavingIfDoneNow}
                                                                    </Typography>

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        Km khuyến nghị
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        {suggestion.formattedRecommendedOdometer}
                                                                    </Typography>

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        Ngày khuyến nghị
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        {suggestion.formattedRecommendedDate}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Cost Forecast */}
                            {maintenanceSuggestions.costForecast && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Dự báo chi phí ({maintenanceSuggestions.costForecast.forecastPeriodDays} ngày tới)
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="subtitle2">Tổng ước tính</Typography>
                                                <Typography variant="h5" color="primary">
                                                    {maintenanceSuggestions.costForecast.formattedEstimatedTotalCost}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="subtitle2">Trung bình/tháng</Typography>
                                                <Typography variant="h5" color="info.main">
                                                    {maintenanceSuggestions.costForecast.formattedAverageMonthlyCost}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Typography variant="subtitle2">Chi phí/người</Typography>
                                                <Typography variant="h5" color="secondary.main">
                                                    {maintenanceSuggestions.costForecast.formattedCostPerCoOwnerAverage}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Chọn xe để xem đề xuất bảo trì
                            </Typography>
                        </Box>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    {/* Cost Saving Recommendations */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : costSavingRecommendations ? (
                        <>
                            {/* Summary */}
                            {costSavingRecommendations.summary && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Tóm tắt chi phí ({costSavingRecommendations.summary.analysisPeriodDays} ngày)
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Tổng chi phí</Typography>
                                                <Typography variant="h5" color="primary">
                                                    {costSavingRecommendations.summary.formattedTotalCostsIncurred}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {costSavingRecommendations.summary.formattedAverageMonthlyCost}/tháng
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Tiềm năng tiết kiệm</Typography>
                                                <Typography variant="h5" color="success.main">
                                                    {costSavingRecommendations.summary.formattedPotentialSavings}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {costSavingRecommendations.summary.formattedSavingsPercentage}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Chi phí/km</Typography>
                                                <Typography variant="h5" color="info.main">
                                                    {costSavingRecommendations.summary.formattedCostPerKm}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle2">Chi phí/đặt xe</Typography>
                                                <Typography variant="h5" color="secondary.main">
                                                    {costSavingRecommendations.summary.formattedCostPerBooking}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Cost Breakdown */}
                            {costSavingRecommendations.summary?.costBreakdowns && (
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Phân tích chi phí theo danh mục
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Danh mục</TableCell>
                                                        <TableCell>Số tiền</TableCell>
                                                        <TableCell>Tỷ lệ</TableCell>
                                                        <TableCell>Xu hướng</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {costSavingRecommendations.summary.costBreakdowns.map((breakdown, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{breakdown.category}</TableCell>
                                                            <TableCell>{breakdown.formattedAmount}</TableCell>
                                                            <TableCell>{breakdown.formattedPercentage}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={breakdown.trendInfo.name}
                                                                    size="small"
                                                                    sx={{ color: breakdown.trendInfo.color }}
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Recommendations */}
                            {costSavingRecommendations.recommendations && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Khuyến nghị tiết kiệm chi phí
                                        </Typography>
                                        {costSavingRecommendations.recommendations.map((recommendation, index) => (
                                            <Accordion key={index}>
                                                <AccordionSummary expandIcon={<ExpandMore />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Chip
                                                                label={recommendation.priorityInfo.name}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: recommendation.priorityInfo.bgColor,
                                                                    color: recommendation.priorityInfo.color,
                                                                    mr: 2
                                                                }}
                                                            />
                                                            <Typography variant="subtitle1">
                                                                {recommendation.title}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="h6" color="success.main">
                                                            {recommendation.formattedPotentialSavingsAmount}
                                                        </Typography>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={8}>
                                                            <Typography variant="body2" paragraph>
                                                                {recommendation.description}
                                                            </Typography>

                                                            <Typography variant="subtitle2">Các bước thực hiện:</Typography>
                                                            <List>
                                                                {recommendation.actionSteps?.map((step, stepIndex) => (
                                                                    <ListItem key={stepIndex} sx={{ py: 0 }}>
                                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                                            <Lightbulb color="primary" fontSize="small" />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={step} />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Grid>

                                                        <Grid item xs={12} md={4}>
                                                            <Card variant="outlined">
                                                                <CardContent>
                                                                    <Typography variant="subtitle2" gutterBottom>
                                                                        Tiết kiệm dự kiến
                                                                    </Typography>
                                                                    <Typography variant="h6" color="success.main">
                                                                        {recommendation.formattedPotentialSavingsAmount}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {recommendation.formattedPotentialSavingsPercentage}
                                                                    </Typography>

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        Chi phí triển khai
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        {recommendation.formattedImplementationCost}
                                                                    </Typography>

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        ROI
                                                                    </Typography>
                                                                    <Typography variant="h6" color="info.main">
                                                                        {recommendation.formattedROI}
                                                                    </Typography>

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        Độ khó
                                                                    </Typography>
                                                                    <Chip
                                                                        label={recommendation.difficultyInfo.name}
                                                                        size="small"
                                                                        sx={{ color: recommendation.difficultyInfo.color }}
                                                                        variant="outlined"
                                                                    />

                                                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                                                        Thời gian có hiệu lực
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        {recommendation.timeframeForSavings}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                Chọn xe để xem khuyến nghị tiết kiệm chi phí
                            </Typography>
                        </Box>
                    )}
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default FairnessOptimizationManagement;