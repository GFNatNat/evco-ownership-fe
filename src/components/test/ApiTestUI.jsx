import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    LinearProgress,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Paper,
    Stack
} from '@mui/material';
import {
    PlayArrow,
    CheckCircle,
    Error,
    ExpandMore,
    Assessment,
    Api,
    Download
} from '@mui/icons-material';
import { CoOwnerApiTester } from '../utils/realApiTestHelper';

/**
 * API Test UI Component
 * Component để test các API endpoints với giao diện trực quan
 */
export default function ApiTestUI() {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState(null);
    const [currentTest, setCurrentTest] = useState('');
    const [tester] = useState(() => new CoOwnerApiTester());

    const handleRunAllTests = async () => {
        setTesting(true);
        setResults(null);
        setCurrentTest('Đang chạy tất cả tests...');

        try {
            const testResults = await tester.runAllTests();
            setResults(testResults);
            setCurrentTest('');
        } catch (error) {
            console.error('Test failed:', error);
            setCurrentTest('');
        } finally {
            setTesting(false);
        }
    };

    const handleRunSpecificTest = async (testName, testFunction) => {
        setTesting(true);
        setCurrentTest(`Đang test ${testName}...`);

        try {
            await testFunction();
            const currentResults = tester.getResults();
            setResults([...currentResults]);
        } catch (error) {
            console.error('Test failed:', error);
        } finally {
            setTesting(false);
            setCurrentTest('');
        }
    };

    const handleExportResults = () => {
        const json = tester.exportResults();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-test-results-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status) => {
        return status === 'success' ? 'success' : 'error';
    };

    const getStatusIcon = (status) => {
        return status === 'success' ? <CheckCircle color="success" /> : <Error color="error" />;
    };

    const calculateSummary = () => {
        if (!results || results.length === 0) return null;

        const passed = results.filter(r => r.status === 'success').length;
        const failed = results.filter(r => r.status === 'failed').length;
        const total = results.length;
        const successRate = ((passed / total) * 100).toFixed(1);

        return { passed, failed, total, successRate };
    };

    const summary = calculateSummary();

    const testCategories = [
        { name: 'Profile APIs', key: 'profile', func: () => tester.testProfileApis() },
        { name: 'Vehicle APIs', key: 'vehicle', func: () => tester.testVehicleApis() },
        { name: 'Booking APIs', key: 'booking', func: () => tester.testBookingApis() },
        { name: 'Schedule APIs', key: 'schedule', func: () => tester.testScheduleApis(1) },
        { name: 'Fund APIs', key: 'fund', func: () => tester.testFundApis(1) },
        { name: 'Group APIs', key: 'group', func: () => tester.testGroupApis() },
        { name: 'Analytics APIs', key: 'analytics', func: () => tester.testAnalyticsApis() },
        { name: 'Payment APIs', key: 'payment', func: () => tester.testPaymentApis() }
    ];

    return (
        <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Api color="primary" sx={{ fontSize: 40 }} />
                    CoOwner API Integration Tester
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Test tất cả các API endpoints để đảm bảo tích hợp đúng với backend
                </Typography>
            </Box>

            {/* Control Panel */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={handleRunAllTests}
                            disabled={testing}
                            size="large"
                        >
                            Chạy tất cả tests
                        </Button>

                        {results && (
                            <Button
                                variant="outlined"
                                startIcon={<Download />}
                                onClick={handleExportResults}
                            >
                                Export kết quả
                            </Button>
                        )}

                        {testing && (
                            <Box sx={{ flex: 1 }}>
                                <LinearProgress />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                    {currentTest}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* Summary */}
            {summary && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>
                                    Tổng số tests
                                </Typography>
                                <Typography variant="h3">{summary.total}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ bgcolor: 'success.light' }}>
                            <CardContent>
                                <Typography color="success.dark" gutterBottom>
                                    Thành công
                                </Typography>
                                <Typography variant="h3" color="success.dark">
                                    {summary.passed}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ bgcolor: 'error.light' }}>
                            <CardContent>
                                <Typography color="error.dark" gutterBottom>
                                    Thất bại
                                </Typography>
                                <Typography variant="h3" color="error.dark">
                                    {summary.failed}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Card sx={{ bgcolor: 'primary.light' }}>
                            <CardContent>
                                <Typography color="primary.dark" gutterBottom>
                                    Tỷ lệ thành công
                                </Typography>
                                <Typography variant="h3" color="primary.dark">
                                    {summary.successRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Individual Test Categories */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Test theo danh mục
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {testCategories.map((category) => (
                            <Grid item xs={12} sm={6} md={3} key={category.key}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => handleRunSpecificTest(category.name, category.func)}
                                    disabled={testing}
                                >
                                    {category.name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Results */}
            {results && results.length > 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                        Kết quả chi tiết
                    </Typography>

                    {results.map((result, index) => (
                        <Accordion key={index} defaultExpanded={result.status === 'failed'}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                    {getStatusIcon(result.status)}
                                    <Typography sx={{ flex: 1 }}>{result.endpoint}</Typography>
                                    <Chip
                                        label={result.status}
                                        color={getStatusColor(result.status)}
                                        size="small"
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(result.timestamp).toLocaleTimeString('vi-VN')}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {result.status === 'success' ? (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Response Data:
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
                                            <pre style={{ margin: 0, fontSize: '0.85rem' }}>
                                                {JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        </Paper>
                                    </Box>
                                ) : (
                                    <Alert severity="error">
                                        <Typography variant="subtitle2" gutterBottom>
                                            Error Message:
                                        </Typography>
                                        <Typography variant="body2">
                                            {result.error}
                                        </Typography>
                                    </Alert>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}

            {/* Empty State */}
            {!results && !testing && (
                <Card>
                    <CardContent>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Api sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Chưa có kết quả test
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Click "Chạy tất cả tests" để bắt đầu kiểm tra API endpoints
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<PlayArrow />}
                                onClick={handleRunAllTests}
                            >
                                Bắt đầu test
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Instructions */}
            <Card sx={{ mt: 3, bgcolor: 'info.light' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom color="info.dark">
                        Hướng dẫn sử dụng
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="1. Đảm bảo backend đang chạy"
                                secondary="API base URL phải được cấu hình đúng trong axiosClient.js"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="2. Đăng nhập với tài khoản CoOwner"
                                secondary="Cần có access token hợp lệ để test các endpoints"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="3. Chạy tests"
                                secondary="Chọn 'Chạy tất cả tests' hoặc test từng category riêng lẻ"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="4. Xem kết quả"
                                secondary="Mở rộng accordion để xem response data chi tiết hoặc error messages"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="5. Export kết quả"
                                secondary="Download file JSON để chia sẻ với team hoặc lưu trữ"
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}
