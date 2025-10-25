import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Tab,
    Tabs,
    Card,
    CardContent,
    Grid,
    Alert,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Divider
} from '@mui/material';
import {
    DirectionsCar,
    PeopleAlt,
    AccountBalance,
    CloudUpload,
    HowToVote,
    Build,
    Notifications,
    Settings,

    BarChart,
    Info,
    Warning,
    CheckCircle,
    SwapHoriz,
    History,
    Analytics,
    Assessment
} from '@mui/icons-material';// Import components
import FileUploadManager from '../../components/common/FileUploadManager';
import FundManagement from '../../components/common/FundManagement';
import MaintenanceVoteManagement from './MaintenanceVoteManagement';
import OwnershipChangeManagement from './OwnershipChangeManagement';
import OwnershipHistoryManagement from './OwnershipHistoryManagement';
import UsageAnalyticsManagement from './UsageAnalyticsManagement';
import VehicleReportManagement from './VehicleReportManagement';
import VehicleUpgradeManagement from './VehicleUpgradeManagement';

// Import APIs
import vehicleApi from '../../api/vehicleApi';
import coOwnerApi from '../../api/coowner';
import groupApi from '../../api/groupApi';

/**
 * Comprehensive Co-Owner Dashboard
 * Main dashboard for co-owners with all management features
 * Includes vehicle info, fund management, file uploads, maintenance voting
 */
function CoOwnerDashboard() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dashboard data
    const [dashboardData, setDashboardData] = useState({
        vehicles: [],
        groups: [],
        currentUser: null,
        notifications: [],
        recentActivities: []
    });

    // Dialog states
    const [vehicleInfoDialog, setVehicleInfoDialog] = useState({ open: false, vehicle: null });

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Load all dashboard data
    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load user's vehicles
            const vehiclesResponse = await coOwnerApi.vehicles.getMy();
            const vehicles = vehiclesResponse.data.data || [];

            // Load user's groups
            const groupsResponse = await coOwnerApi.groups.getMy();
            const groups = groupsResponse.data.data || [];

            // Load notifications
            const notificationsResponse = await coOwnerApi.notifications.getMy();
            const notifications = notificationsResponse.data.data || [];

            setDashboardData({
                vehicles,
                groups,
                notifications,
                recentActivities: [] // Will be populated from various sources
            });
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setError('Lỗi khi tải dữ liệu dashboard: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Show vehicle details
    const handleViewVehicle = async (vehicleId) => {
        try {
            const response = await vehicleApi.getById(vehicleId);
            const vehicle = response.data.data;
            setVehicleInfoDialog({ open: true, vehicle });
        } catch (err) {
            setError('Lỗi khi tải thông tin xe: ' + err.message);
        }
    };

    // Format status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'maintenance': return 'warning';
            case 'inactive': return 'error';
            default: return 'default';
        }
    };

    // Render dashboard overview
    const renderOverview = () => (
        <Grid container spacing={3}>
            {/* Quick Stats */}
            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" color="primary">
                            {dashboardData.vehicles.length}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Xe sở hữu
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <PeopleAlt sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" color="success.main">
                            {dashboardData.groups.length}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Nhóm tham gia
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Notifications sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" color="warning.main">
                            {dashboardData.notifications.filter(n => !n.isRead).length}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Thông báo mới
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={3}>
                <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <History sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h4" color="info.main">
                            {dashboardData.recentActivities.length}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Hoạt động gần đây
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Vehicle List */}
            <Grid item xs={12} md={8}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Danh sách xe ({dashboardData.vehicles.length})
                        </Typography>
                        <List>
                            {dashboardData.vehicles.map((vehicle) => (
                                <ListItem
                                    key={vehicle.vehicleId}
                                    divider
                                    secondaryAction={
                                        <Box display="flex" gap={1}>
                                            <Chip
                                                label={vehicle.status}
                                                color={getStatusColor(vehicle.status)}
                                                size="small"
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewVehicle(vehicle.vehicleId)}
                                            >
                                                <Info />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemIcon>
                                        <DirectionsCar color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${vehicle.make} ${vehicle.model} (${vehicle.year})`}
                                        secondary={`Biển số: ${vehicle.licensePlate} • Loại: ${vehicle.vehicleType}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        {dashboardData.vehicles.length === 0 && (
                            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                                Chưa có xe nào trong hệ thống
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Recent Activities & Notifications */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Thông báo mới ({dashboardData.notifications.filter(n => !n.isRead).length})
                        </Typography>
                        <List>
                            {dashboardData.notifications.slice(0, 5).map((notification) => (
                                <ListItem key={notification.notificationId} divider>
                                    <ListItemIcon>
                                        {notification.type === 'warning' ? <Warning color="warning" /> :
                                            notification.type === 'success' ? <CheckCircle color="success" /> :
                                                <Info color="info" />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={notification.title}
                                        secondary={notification.message}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        {dashboardData.notifications.length === 0 && (
                            <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                                Không có thông báo mới
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    // Render vehicle info dialog
    const renderVehicleInfoDialog = () => (
        <Dialog
            open={vehicleInfoDialog.open}
            onClose={() => setVehicleInfoDialog({ open: false, vehicle: null })}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Thông tin chi tiết xe</DialogTitle>
            <DialogContent>
                {vehicleInfoDialog.vehicle && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Hãng xe:</strong> {vehicleInfoDialog.vehicle.make}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Model:</strong> {vehicleInfoDialog.vehicle.model}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Năm sản xuất:</strong> {vehicleInfoDialog.vehicle.year}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Biển số:</strong> {vehicleInfoDialog.vehicle.licensePlate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" gutterBottom>
                                <strong>Loại xe:</strong> {vehicleInfoDialog.vehicle.vehicleType}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Màu sắc:</strong> {vehicleInfoDialog.vehicle.color}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Trạng thái:</strong>
                                <Chip
                                    label={vehicleInfoDialog.vehicle.status}
                                    color={getStatusColor(vehicleInfoDialog.vehicle.status)}
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Km đã đi:</strong> {vehicleInfoDialog.vehicle.mileage?.toLocaleString() || 'N/A'} km
                            </Typography>
                        </Grid>
                        {vehicleInfoDialog.vehicle.description && (
                            <Grid item xs={12}>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Mô tả:</strong>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {vehicleInfoDialog.vehicle.description}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setVehicleInfoDialog({ open: false, vehicle: null })}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );

    // Get current group ID (assume first group for demo)
    const currentGroupId = dashboardData.groups[0]?.groupId;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard Co-Owner
            </Typography>

            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab icon={<BarChart />} label="Tổng quan" />
                    <Tab icon={<AccountBalance />} label="Quản lý quỹ" />
                    <Tab icon={<CloudUpload />} label="Quản lý file" />
                    <Tab icon={<HowToVote />} label="Bỏ phiếu bảo trì" />
                    <Tab icon={<SwapHoriz />} label="Thay đổi sở hữu" />
                    <Tab icon={<History />} label="Lịch sử sở hữu" />
                    <Tab icon={<Analytics />} label="Phân tích sử dụng" />
                    <Tab icon={<Assessment />} label="Báo cáo xe" />
                    <Tab icon={<Build />} label="Nâng cấp xe" />
                    <Tab icon={<Settings />} label="Cài đặt" />
                </Tabs>
            </Box>            {/* Tab Content */}
            <Box>
                {/* Overview Tab */}
                {activeTab === 0 && renderOverview()}

                {/* Fund Management Tab */}
                {activeTab === 1 && currentGroupId && (
                    <FundManagement groupId={currentGroupId} />
                )}

                {/* File Management Tab */}
                {activeTab === 2 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quản lý file và tài liệu
                            </Typography>
                            <FileUploadManager
                                fileTypes={['All']}
                                maxFiles={20}
                                vehicleId={dashboardData.vehicles[0]?.vehicleId}
                                onFileUploaded={(file) => {
                                    console.log('File uploaded:', file);
                                }}
                                onFileDeleted={(file) => {
                                    console.log('File deleted:', file);
                                }}
                                showFileList={true}
                                allowMultiple={true}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Maintenance Vote Tab */}
                {activeTab === 3 && currentGroupId && (
                    <MaintenanceVoteManagement groupId={currentGroupId} />
                )}

                {/* Ownership Change Tab */}
                {activeTab === 4 && (
                    <OwnershipChangeManagement />
                )}

                {/* Ownership History Tab */}
                {activeTab === 5 && (
                    <OwnershipHistoryManagement />
                )}

                {/* Usage Analytics Tab */}
                {activeTab === 6 && (
                    <UsageAnalyticsManagement />
                )}

                {/* Vehicle Reports Tab */}
                {activeTab === 7 && (
                    <VehicleReportManagement />
                )}

                {/* Vehicle Upgrades Tab */}
                {activeTab === 8 && (
                    <VehicleUpgradeManagement />
                )}

                {/* Settings Tab */}
                {activeTab === 9 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Cài đặt tài khoản
                            </Typography>
                            <Typography color="textSecondary">
                                Chức năng cài đặt sẽ được bổ sung trong phiên bản tiếp theo.
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* Dialogs */}
            {renderVehicleInfoDialog()}

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

export default CoOwnerDashboard;