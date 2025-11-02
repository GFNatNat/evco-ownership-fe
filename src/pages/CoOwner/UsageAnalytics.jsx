import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import {
    Analytics as AnalyticsIcon, Schedule as ScheduleIcon,
    DirectionsCar as CarIcon, TrendingUp as TrendingIcon,
    PieChart as PieIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import coOwnerApi from '../../api/coowner';

const UsageAnalytics = () => {
    const { user } = useAuth();
    const [usageData, setUsageData] = useState([]);
    const [summary, setSummary] = useState({});
    const [period, setPeriod] = useState('month');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsageAnalytics();
    }, [period]);

    const loadUsageAnalytics = async () => {
        setLoading(true);
        try {
            // Get real usage analytics from API
            const [usageStats, costAnalysis, environmentalImpact] = await Promise.all([
                coOwnerApi.analytics.getUsageStatistics(),
                coOwnerApi.analytics.getCostAnalysis(period),
                coOwnerApi.analytics.getEnvironmentalImpact()
            ]);

            const usageData = usageStats.data;
            const costData = costAnalysis.data;
            const envData = environmentalImpact.data;

            // Process timeline data - PostgreSQL only
            const timeline = costData.timeline || [];

            if (timeline.length === 0) {
                console.warn('⚠️ No timeline data from PostgreSQL API');
            }

            // Calculate summary
            const totalHours = timeline.reduce((sum, item) => sum + (item.hours || 0), 0);
            const totalDistance = timeline.reduce((sum, item) => sum + (item.distance || 0), 0);
            const totalCost = timeline.reduce((sum, item) => sum + (item.cost || 0), 0);
            const avgHoursPerMonth = totalHours / Math.max(timeline.length, 1);

            setUsageData(timeline);
            setSummary({
                totalHours,
                totalDistance,
                totalCost,
                avgHoursPerMonth: Math.round(avgHoursPerMonth * 10) / 10,
                thisMonth: timeline[timeline.length - 1]?.hours || 0,
                lastMonth: timeline[timeline.length - 2]?.hours || 0,
                ownershipPercentage: usageData.ownershipPercentage || 0,
                fairnessScore: usageData.fairnessScore || 0,
                co2Saved: envData.co2Saved || 0,
                fuelSaved: envData.fuelSaved || 0
            });
        } catch (error) {
            console.error('Error loading usage analytics:', error);
            // No fallback - show error message to user
            setError(`Không thể tải dữ liệu thống kê từ database: ${error.message}`);
            setUsageData([]);
            setSummary({
                totalHours: 0,
                totalDistance: 0,
                totalCost: 0,
                avgHoursPerMonth: 0,
                thisMonth: 0,
                lastMonth: 0,
                ownershipPercentage: 0,
                fairnessScore: 0,
                co2Saved: 0,
                fuelSaved: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Chart data for usage visualization  
    const usageDistribution = [
        { name: 'Đi làm', value: 40, color: '#8884d8' },
        { name: 'Mua sắm', value: 25, color: '#82ca9d' },
        { name: 'Du lịch', value: 20, color: '#ffc658' },
        { name: 'Khác', value: 15, color: '#ff7300' }
    ];

    const fairnessColor = summary.fairnessScore >= 0.8 ? 'success' :
        summary.fairnessScore >= 0.6 ? 'warning' : 'error';

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Phân tích Sử dụng
            </Typography>

            <Grid container spacing={3}>
                {/* Period Selector */}
                <Grid item xs={12}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Thời kỳ</InputLabel>
                        <Select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <MenuItem value="week">Tuần</MenuItem>
                            <MenuItem value="month">Tháng</MenuItem>
                            <MenuItem value="quarter">Quý</MenuItem>
                            <MenuItem value="year">Năm</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Summary Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Tổng giờ sử dụng
                            </Typography>
                            <Typography variant="h4" component="div">
                                {summary.totalHours}h
                            </Typography>
                            <Typography variant="body2">
                                TB: {summary.avgHoursPerMonth}h/tháng
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Tổng quãng đường
                            </Typography>
                            <Typography variant="h4" component="div">
                                {summary.totalDistance}km
                            </Typography>
                            <Typography variant="body2">
                                TB: {Math.round(summary.totalDistance / 12)}km/tháng
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Tổng chi phí
                            </Typography>
                            <Typography variant="h4" component="div">
                                {summary.totalCost?.toLocaleString()}đ
                            </Typography>
                            <Typography variant="body2">
                                TB: {Math.round(summary.totalCost / 12)?.toLocaleString()}đ/tháng
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Độ công bằng
                            </Typography>
                            <Typography variant="h4" component="div">
                                <Chip
                                    label={`${Math.round(summary.fairnessScore * 100)}%`}
                                    color={fairnessColor}
                                />
                            </Typography>
                            <Typography variant="body2">
                                Sở hữu: {summary.ownershipPercentage}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Usage Timeline */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Xu hướng Sử dụng
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={usageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="hours" stroke="#8884d8" name="Giờ" />
                                    <Line type="monotone" dataKey="distance" stroke="#82ca9d" name="Km" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Usage Distribution */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Phân loại Sử dụng
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={usageDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {usageDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ mt: 2 }}>
                                {usageDistribution.map((item) => (
                                    <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: item.color,
                                                borderRadius: '50%',
                                                mr: 1
                                            }}
                                        />
                                        <Typography variant="body2">
                                            {item.name}: {item.value}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Usage History */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Lịch sử Sử dụng Gần đây
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ngày</TableCell>
                                            <TableCell>Thời gian</TableCell>
                                            <TableCell>Quãng đường</TableCell>
                                            <TableCell>Mục đích</TableCell>
                                            <TableCell>Chi phí</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Mock recent usage data */}
                                        {[...Array(5)].map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell>
                                                    {Math.floor(Math.random() * 3) + 1}h {Math.floor(Math.random() * 60)}p
                                                </TableCell>
                                                <TableCell>
                                                    {Math.floor(Math.random() * 50) + 10}km
                                                </TableCell>
                                                <TableCell>
                                                    {['Đi làm', 'Mua sắm', 'Du lịch', 'Gặp gỡ'][Math.floor(Math.random() * 4)]}
                                                </TableCell>
                                                <TableCell>
                                                    {(Math.floor(Math.random() * 100) + 20).toLocaleString()}đ
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UsageAnalytics;