import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Alert, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, NotificationImportant as ReminderIcon,
  Schedule as ScheduleIcon, Person as PersonIcon, Event as EventIcon, AccessTime as TimeIcon,
  Send as SendIcon, History as HistoryIcon
} from '@mui/icons-material';
import bookingReminderApi from '../../api/bookingReminderApi';

const BookingReminderManagement = () => {
  const [reminders, setReminders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [reminderHistory, setReminderHistory] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('reminder');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    bookingId: '',
    reminderType: 'BeforeBooking',
    triggerMinutesBefore: 60,
    message: '',
    isEnabled: true,
    templateName: '',
    templateMessage: '',
    channels: ['Email']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [remindersRes, templatesRes, settingsRes, historyRes] = await Promise.all([
        bookingReminderApi.getUserReminders(),
        bookingReminderApi.getReminderTemplates(),
        bookingReminderApi.getUserReminderSettings(),
        bookingReminderApi.getReminderHistory()
      ]);
      setReminders(remindersRes.data || []);
      setTemplates(templatesRes.data || []);
      setSettings(settingsRes.data || {});
      setReminderHistory(historyRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = () => {
    setSelectedItem(null);
    setDialogType('reminder');
    setFormData({
      bookingId: '',
      reminderType: 'BeforeBooking',
      triggerMinutesBefore: 60,
      message: '',
      isEnabled: true,
      channels: ['Email']
    });
    setDialogOpen(true);
  };

  const handleCreateTemplate = () => {
    setSelectedItem(null);
    setDialogType('template');
    setFormData({
      templateName: '',
      templateMessage: '',
      reminderType: 'BeforeBooking',
      triggerMinutesBefore: 60,
      channels: ['Email']
    });
    setDialogOpen(true);
  };

  const handleEditItem = (item, type) => {
    setSelectedItem(item);
    setDialogType(type);
    if (type === 'reminder') {
      setFormData({
        bookingId: item.bookingId || '',
        reminderType: item.reminderType || 'BeforeBooking',
        triggerMinutesBefore: item.triggerMinutesBefore || 60,
        message: item.message || '',
        isEnabled: item.isEnabled !== false,
        channels: item.channels || ['Email']
      });
    } else if (type === 'template') {
      setFormData({
        templateName: item.templateName || '',
        templateMessage: item.templateMessage || '',
        reminderType: item.reminderType || 'BeforeBooking',
        triggerMinutesBefore: item.triggerMinutesBefore || 60,
        channels: item.channels || ['Email']
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === 'reminder') {
        if (selectedItem) {
          await bookingReminderApi.updateReminder(selectedItem.reminderId, formData);
        } else {
          await bookingReminderApi.createReminder(formData);
        }
      } else if (dialogType === 'template') {
        if (selectedItem) {
          await bookingReminderApi.updateReminderTemplate(selectedItem.templateId, formData);
        } else {
          await bookingReminderApi.createReminderTemplate(formData);
        }
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'reminder') {
        await bookingReminderApi.deleteReminder(id);
      } else if (type === 'template') {
        await bookingReminderApi.deleteReminderTemplate(id);
      }
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleTestReminder = async (reminderId) => {
    try {
      await bookingReminderApi.testReminder(reminderId);
      alert('Test reminder sent successfully!');
    } catch (error) {
      console.error('Error testing reminder:', error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await bookingReminderApi.updateUserReminderSettings(settings);
      alert('Settings updated successfully!');
      loadData();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Sent': return 'info';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const formatTriggerTime = (minutes) => {
    if (minutes < 60) return `${minutes} phút`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ`;
    return `${Math.floor(minutes / 1440)} ngày`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý Nhắc nhở Booking
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateReminder}
            sx={{ mr: 1 }}
          >
            Tạo nhắc nhở
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={handleCreateTemplate}
          >
            Tạo template
          </Button>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Nhắc nhở của tôi" />
        <Tab label="Templates" />
        <Tab label="Cài đặt" />
        <Tab label="Lịch sử" />
      </Tabs>

      {/* Tab: My Reminders */}
      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Loại nhắc nhở</TableCell>
                <TableCell>Thời gian kích hoạt</TableCell>
                <TableCell>Kênh gửi</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reminders.map((reminder) => (
                <TableRow key={reminder.reminderId}>
                  <TableCell>{reminder.bookingId}</TableCell>
                  <TableCell>
                    {reminderTypes.find(t => t.value === reminder.reminderType)?.label}
                  </TableCell>
                  <TableCell>{formatTriggerTime(reminder.triggerMinutesBefore)}</TableCell>
                  <TableCell>
                    {reminder.channels?.map(channel => (
                      <Chip key={channel} label={channel} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reminder.status} 
                      color={getStatusColor(reminder.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditItem(reminder, 'reminder')}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(reminder.reminderId, 'reminder')}>
                      <DeleteIcon />
                    </IconButton>
                    <Button 
                      size="small" 
                      onClick={() => handleTestReminder(reminder.reminderId)}
                      startIcon={<SendIcon />}
                    >
                      Test
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab: Templates */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.templateId}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {template.templateName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.templateMessage?.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                      label={reminderTypes.find(t => t.value === template.reminderType)?.label}
                      size="small"
                    />
                    <Box>
                      <IconButton onClick={() => handleEditItem(template, 'template')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(template.templateId, 'template')}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Kích hoạt: {formatTriggerTime(template.triggerMinutesBefore)} trước
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tab: Settings */}
      {tabValue === 2 && settings && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cài đặt nhắc nhở
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.emailEnabled} 
                      onChange={(e) => setSettings({...settings, emailEnabled: e.target.checked})}
                    />
                  }
                  label="Nhận nhắc nhở qua Email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.smsEnabled} 
                      onChange={(e) => setSettings({...settings, smsEnabled: e.target.checked})}
                    />
                  }
                  label="Nhận nhắc nhở qua SMS"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.pushEnabled} 
                      onChange={(e) => setSettings({...settings, pushEnabled: e.target.checked})}
                    />
                  }
                  label="Nhận thông báo đẩy"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.inAppEnabled} 
                      onChange={(e) => setSettings({...settings, inAppEnabled: e.target.checked})}
                    />
                  }
                  label="Thông báo trong ứng dụng"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Múi giờ"
                  value={settings.timezone || 'Asia/Ho_Chi_Minh'}
                  onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Thời gian nhắc mặc định (phút)"
                  value={settings.defaultReminderMinutes || 60}
                  onChange={(e) => setSettings({...settings, defaultReminderMinutes: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  onClick={handleUpdateSettings}
                  startIcon={<SendIcon />}
                >
                  Lưu cài đặt
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab: History */}
      {tabValue === 3 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Thời gian gửi</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Loại nhắc nhở</TableCell>
                <TableCell>Kênh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Nội dung</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reminderHistory.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDateTime(history.sentAt)}</TableCell>
                  <TableCell>{history.bookingId}</TableCell>
                  <TableCell>
                    {reminderTypes.find(t => t.value === history.reminderType)?.label}
                  </TableCell>
                  <TableCell>
                    <Chip label={history.channel} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={history.status} 
                      color={getStatusColor(history.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap>
                      {history.message}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Chỉnh sửa' : 'Tạo mới'} {
            dialogType === 'reminder' ? 'nhắc nhở' : 'template'
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'reminder' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Booking ID"
                  value={formData.bookingId}
                  onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
                />
              </Grid>
            )}
            
            {dialogType === 'template' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên template"
                  value={formData.templateName}
                  onChange={(e) => setFormData({...formData, templateName: e.target.value})}
                />
              </Grid>
            )}

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
                rows={3}
                label={dialogType === 'template' ? 'Nội dung template' : 'Nội dung nhắc nhở'}
                value={dialogType === 'template' ? formData.templateMessage : formData.message}
                onChange={(e) => setFormData({
                  ...formData, 
                  [dialogType === 'template' ? 'templateMessage' : 'message']: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kênh gửi</InputLabel>
                <Select
                  multiple
                  value={formData.channels}
                  onChange={(e) => setFormData({...formData, channels: e.target.value})}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {channelOptions.map(channel => (
                    <MenuItem key={channel} value={channel}>
                      {channel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {dialogType === 'reminder' && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={formData.isEnabled}
                      onChange={(e) => setFormData({...formData, isEnabled: e.target.checked})}
                    />
                  }
                  label="Kích hoạt nhắc nhở"
                />
              </Grid>
            )}
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