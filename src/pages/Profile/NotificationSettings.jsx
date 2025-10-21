import React from 'react';
import {
    Card, CardContent, Typography, Switch, FormControlLabel,
    Button, Box, Snackbar, Alert, Divider, List, ListItem,
    ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { Notifications, NotificationsOff } from '@mui/icons-material';
import pushNotificationService from '../../services/pushNotificationService';

export default function NotificationSettings() {
    const [pushEnabled, setPushEnabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        checkPushStatus();
    }, []);

    const checkPushStatus = async () => {
        try {
            await pushNotificationService.init();
            const isSubscribed = await pushNotificationService.getSubscriptionStatus();
            setPushEnabled(isSubscribed);
        } catch (err) {
            console.error('Failed to check push status:', err);
        }
    };

    const handlePushToggle = async (enabled) => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (enabled) {
                // Enable push notifications
                const permissionGranted = await pushNotificationService.requestPermission();
                if (!permissionGranted) {
                    setError('Quyền thông báo bị từ chối. Vui lòng kiểm tra cài đặt trình duyệt.');
                    return;
                }

                const success = await pushNotificationService.subscribe();
                if (success) {
                    setPushEnabled(true);
                    setMessage('Đã bật thông báo đẩy thành công');
                } else {
                    setError('Không thể bật thông báo đẩy');
                }
            } else {
                // Disable push notifications
                const success = await pushNotificationService.unsubscribe();
                if (success) {
                    setPushEnabled(false);
                    setMessage('Đã tắt thông báo đẩy');
                } else {
                    setError('Không thể tắt thông báo đẩy');
                }
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật cài đặt thông báo');
        } finally {
            setLoading(false);
        }
    };

    const testNotification = () => {
        pushNotificationService.showLocalNotification(
            'Thông báo thử nghiệm',
            {
                body: 'Đây là thông báo thử nghiệm từ hệ thống EV Co-ownership',
                tag: 'test-notification'
            }
        );
        setMessage('Đã gửi thông báo thử nghiệm');
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Cài đặt thông báo
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Thông báo đẩy (Push Notifications)
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Bật thông báo đẩy"
                                secondary="Nhận thông báo ngay cả khi không mở ứng dụng"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={pushEnabled}
                                    onChange={(e) => handlePushToggle(e.target.checked)}
                                    disabled={loading}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>

                    {pushEnabled && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<Notifications />}
                                onClick={testNotification}
                                size="small"
                            >
                                Thử nghiệm thông báo
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Loại thông báo
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Lời mời đồng sở hữu"
                                secondary="Khi có lời mời tham gia đồng sở hữu xe"
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary="Xác minh xe"
                                secondary="Khi xe được xác minh hoặc từ chối"
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary="Thanh toán"
                                secondary="Nhắc nhở thanh toán và xác nhận giao dịch"
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary="Lịch đặt xe"
                                secondary="Nhắc nhở lịch đặt xe và thay đổi"
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary="Cập nhật hệ thống"
                                secondary="Thông báo về cập nhật và bảo trì hệ thống"
                            />
                            <ListItemSecondaryAction>
                                <Switch defaultChecked />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Hướng dẫn
                    </Typography>

                    <Typography variant="body2" color="text.secondary" paragraph>
                        • Để nhận thông báo đẩy, bạn cần cấp quyền thông báo cho trình duyệt
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        • Thông báo sẽ được gửi ngay cả khi bạn không mở ứng dụng
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        • Bạn có thể tắt thông báo bất cứ lúc nào trong cài đặt này
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • Một số trình duyệt có thể chặn thông báo theo mặc định
                    </Typography>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
                <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
            </Snackbar>
        </Box>
    );
}