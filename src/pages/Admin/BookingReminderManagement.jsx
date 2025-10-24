import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, NotificationImportant as ReminderIcon,
  SupervisorAccount as SupervisorIcon, Send as SendIcon, History as HistoryIcon,
  Settings as SettingsIcon, People as PeopleIcon
} from '@mui/icons-material';
import bookingReminderApi from '../../api/bookingReminderApi';

const BookingReminderManagement = () => {
  const [systemReminders, setSystemReminders] = useState([]);
  const [globalTemplates, setGlobalTemplates] = useState([]);
  const [userSettings, setUserSettings] = useState([]);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('template');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    templateName: '',
    templateMessage: '',
    reminderType: 'BeforeBooking',
    triggerMinutesBefore: 60,
    channels: ['Email'],
    isGlobal: true,
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin overview
      const mockSystemReminders = [
        {
          reminderId: 1,
          userId: 1,
          userName: 'Nguyễn Văn A',
          bookingId: 'BK001',
          reminderType: 'BeforeBooking',
          triggerMinutesBefore: 60,
          status: 'Active',
          createdAt: '2024-10-20T10:00:00Z'
        },
        {
          reminderId: 2,
          userId: 2,
          userName: 'Trần Thị B',
          bookingId: 'BK002',
          reminderType: 'PaymentDue',
          triggerMinutesBefore: 1440,
          status: 'Sent',
          createdAt: '2024-10-21T15:30:00Z'
        }
      ];

      const mockGlobalTemplates = [
        {
          templateId: 1,
          templateName: 'Nhắc nhở trước booking',
          templateMessage: 'Xin chào {userName}, bạn có booking xe {vehicleName} vào {bookingTime}. Vui lòng chuẩn bị sẵn sàng.',
          reminderType: 'BeforeBooking',
          triggerMinutesBefore: 60,
          isGlobal: true,
          isActive: true,
          usageCount: 25
        },
        {
          templateId: 2,
          templateName: 'Nhắc nhở thanh toán',
          templateMessage: 'Bạn có khoản thanh toán {amount} VND sắp đến hạn cho booking {bookingId}.',
          reminderType: 'PaymentDue',
          triggerMinutesBefore: 1440,
          isGlobal: true,
          isActive: true,
          usageCount: 12
        }
      ];

      const mockUserSettings = [
        {
          userId: 1,
          userName: 'Nguyễn Văn A',
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          inAppEnabled: true,
          timezone: 'Asia/Ho_Chi_Minh',
          defaultReminderMinutes: 60
        },
        {
          userId: 2,
          userName: 'Trần Thị B',
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: false,
          inAppEnabled: true,
          timezone: 'Asia/Ho_Chi_Minh',
          defaultReminderMinutes: 120
        }
      ];

      const mockGlobalSettings = {
        systemEnabled: true,
        maxRemindersPerUser: 10,
        defaultChannels: ['Email', 'Push'],
        retryAttempts: 3,
        retryIntervalMinutes: 5,
        cleanupAfterDays: 30,
        allowUserCustomization: true
      };

      const mockStatistics = {
        totalActiveReminders: 45,
        totalSentToday: 23,
        totalFailedToday: 2,
        averageDeliveryTime: 2.5,
        topReminderTypes: [
          { type: 'BeforeBooking', count: 18 },
          { type: 'PaymentDue', count: 12 },
          { type: 'AfterCheckOut', count: 8 }
        ],
        channelStats: {
          Email: { sent: 35, failed: 1 },
          SMS: { sent: 15, failed: 1 },
          Push: { sent: 28, failed: 0 },
          InApp: { sent: 42, failed: 0 }
        }
      };

      setSystemReminders(mockSystemReminders);
      setGlobalTemplates(mockGlobalTemplates);
      setUserSettings(mockUserSettings);
      setGlobalSettings(mockGlobalSettings);
      setStatistics(mockStatistics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedItem(null);
    setDialogType('template');
    setFormData({
      templateName: '',
      templateMessage: '',
      reminderType: 'BeforeBooking',
      triggerMinutesBefore: 60,
      channels: ['Email'],
      isGlobal: true,
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedItem(template);
    setDialogType('template');
    setFormData({
      templateName: template.templateName,
      templateMessage: template.templateMessage,
      reminderType: template.reminderType,
      triggerMinutesBefore: template.triggerMinutesBefore,
      channels: template.channels || ['Email'],
      isGlobal: template.isGlobal,
      isActive: template.isActive
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === 'template') {
        if (selectedItem) {
          // Update template
          console.log('Updating template:', selectedItem.templateId, formData);
        } else {
          // Create template
          console.log('Creating template:', formData);
        }
        alert('Template đã được lưu thành công!');
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Có lỗi xảy ra khi lưu');
    }
  };

  const handleToggleTemplate = async (templateId, isActive) => {
    try {
      console.log('Toggling template:', templateId, isActive);
      alert(`Template đã được ${isActive ? 'kích hoạt' : 'tắt'}`);
      loadData();
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleUpdateGlobalSettings = async () => {
    try {
      console.log('Updating global settings:', globalSettings);
      alert('Cài đặt hệ thống đã được cập nhật!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const reminderTypes = [
    { value: 'BeforeBooking', label: 'Trước khi booking' },
    { value: 'AfterBooking', label: 'Sau khi booking' },
    { value: 'BeforeCheckIn', label: 'Trước check-in' },
    { value: 'AfterCheckOut', label: 'Sau check-out' },
    { value: 'PaymentDue', label: 'Hạn thanh toán' },
    { value: 'MaintenanceReminder', label: 'Nhắc bảo trì' }
  ];

  const channelOptions = ['Email', 'SMS', 'Push', 'InApp'];

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý Nhắc nhở Hệ thống
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleCreateTemplate}
        >
          Tạo template toàn cục
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {statistics?.totalActiveReminders || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhắc nhở đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {statistics?.totalSentToday || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã gửi hôm nay
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {statistics?.totalFailedToday || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thất bại hôm nay
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                {statistics?.averageDeliveryTime || 0}s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thời gian gửi TB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Templates toàn cục" />
        <Tab label="Cài đặt người dùng" />
        <Tab label="Nhắc nhở hệ thống" />
        <Tab label="Cài đặt hệ thống" />
        <Tab label="Thống kê" />
      </Tabs>

      {/* Tab: Global Templates */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên template</TableCell>
                <TableCell>Loại nhắc nhở</TableCell>
                <TableCell>Thời gian kích hoạt</TableCell>
                <TableCell>Sử dụng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {globalTemplates.map((template) => (
                <TableRow key={template.templateId}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {template.templateName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {reminderTypes.find(t => t.value === template.reminderType)?.label}
                  </TableCell>
                  <TableCell>
                    {template.triggerMinutesBefore < 60 
                      ? `${template.triggerMinutesBefore} phút`
                      : `${Math.floor(template.triggerMinutesBefore / 60)} giờ`
                    }
                  </TableCell>
                  <TableCell>{template.usageCount} lần</TableCell>
                  <TableCell>
                    <Switch
                      checked={template.isActive}
                      onChange={(e) => handleToggleTemplate(template.templateId, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditTemplate(template)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: User Settings */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>SMS</TableCell>
                <TableCell>Push</TableCell>
                <TableCell>In-App</TableCell>
                <TableCell>Múi giờ</TableCell>
                <TableCell>Thời gian mặc định</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userSettings.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.emailEnabled ? 'Bật' : 'Tắt'}
                      color={user.emailEnabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.smsEnabled ? 'Bật' : 'Tắt'}
                      color={user.smsEnabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.pushEnabled ? 'Bật' : 'Tắt'}
                      color={user.pushEnabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.inAppEnabled ? 'Bật' : 'Tắt'}
                      color={user.inAppEnabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.timezone}</TableCell>
                  <TableCell>{user.defaultReminderMinutes} phút</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: System Reminders */}
      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Loại nhắc nhở</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thời gian tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {systemReminders.map((reminder) => (
                <TableRow key={reminder.reminderId}>
                  <TableCell>{reminder.userName}</TableCell>
                  <TableCell>{reminder.bookingId}</TableCell>
                  <TableCell>
                    {reminderTypes.find(t => t.value === reminder.reminderType)?.label}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reminder.status}
                      color={reminder.status === 'Sent' ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(reminder.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: System Settings */}
      {tabValue === 3 && globalSettings && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cài đặt hệ thống nhắc nhở
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={globalSettings.systemEnabled}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        systemEnabled: e.target.checked
                      })}
                    />
                  }
                  label="Kích hoạt hệ thống nhắc nhở"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={globalSettings.allowUserCustomization}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        allowUserCustomization: e.target.checked
                      })}
                    />
                  }
                  label="Cho phép người dùng tùy chỉnh"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số nhắc nhở tối đa/người dùng"
                  value={globalSettings.maxRemindersPerUser}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    maxRemindersPerUser: parseInt(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số lần thử lại"
                  value={globalSettings.retryAttempts}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    retryAttempts: parseInt(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Khoảng cách thử lại (phút)"
                  value={globalSettings.retryIntervalMinutes}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    retryIntervalMinutes: parseInt(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Xóa dữ liệu sau (ngày)"
                  value={globalSettings.cleanupAfterDays}
                  onChange={(e) => setGlobalSettings({
                    ...globalSettings,
                    cleanupAfterDays: parseInt(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={handleUpdateGlobalSettings}
                  startIcon={<SettingsIcon />}
                >
                  Lưu cài đặt hệ thống
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab: Statistics */}
      {tabValue === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê theo loại nhắc nhở
                </Typography>
                {statistics?.topReminderTypes?.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {reminderTypes.find(t => t.value === item.type)?.label}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê theo kênh gửi
                </Typography>
                {Object.entries(statistics?.channelStats || {}).map(([channel, stats]) => (
                  <Box key={channel} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {channel}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      Thành công: {stats.sent}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Thất bại: {stats.failed}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Template Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Chỉnh sửa' : 'Tạo mới'} template toàn cục
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên template"
                value={formData.templateName}
                onChange={(e) => setFormData({...formData, templateName: e.target.value})}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại nhắc nhở</InputLabel>
                <Select
                  value={formData.reminderType}
                  onChange={(e) => setFormData({...formData, reminderType: e.target.value})}
                >
                  {reminderTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Thời gian kích hoạt (phút)"
                value={formData.triggerMinutesBefore}
                onChange={(e) => setFormData({...formData, triggerMinutesBefore: parseInt(e.target.value)})}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nội dung template"
                value={formData.templateMessage}
                onChange={(e) => setFormData({...formData, templateMessage: e.target.value})}
                placeholder="Sử dụng {userName}, {vehicleName}, {bookingTime}, {amount}, {bookingId} để thay thế động"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.isGlobal}
                    onChange={(e) => setFormData({...formData, isGlobal: e.target.checked})}
                  />
                }
                label="Template toàn cục"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                }
                label="Kích hoạt template"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedItem ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingReminderManagement;