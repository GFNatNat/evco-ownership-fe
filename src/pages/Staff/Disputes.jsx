
import React from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Chip, Avatar, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab,
  Paper, List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton,
  Tooltip, Snackbar, Alert
} from '@mui/material';
import {
  ReportProblem, Gavel, CheckCircle, Cancel, Person, Visibility, Edit, Send, Warning
} from '@mui/icons-material';
import staffApi from '../../api/staff';
import { useAuth } from '../../context/AuthContext';

export default function Disputes() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [disputes, setDisputes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedDispute, setSelectedDispute] = React.useState(null);

  // No mock data - all data from PostgreSQL database

  React.useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    setLoading(true);
    try {
      // Only fetch from PostgreSQL database via API
      const response = await staffApi.disputes.getAll();
      if (response && response.data) {
        setDisputes(response.data);
      } else {
        setError('Không có dữ liệu tranh chấp từ database');
        setDisputes([]);
      }
    } catch (err) {
      console.error('Disputes API Error:', err);
      setError(`Lỗi kết nối database: ${err.message || 'Network error'}`);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'warning';
      case 'pending': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Đang mở';
      case 'pending': return 'Chờ xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #fbc02d 0%, #ffa000 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Quản lý Tranh chấp
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Tiếp nhận, xử lý và theo dõi các tranh chấp của khách hàng
                </Typography>
              </Box>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Gavel sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Đang mở
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {disputes.filter(d => d.status === 'open').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <ReportProblem sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Đã giải quyết
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {disputes.filter(d => d.status === 'resolved').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CheckCircle sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Chờ xử lý
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {disputes.filter(d => d.status === 'pending').length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <Warning sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Tổng tranh chấp
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {disputes.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <Gavel sx={{ fontSize: 30 }} />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Main Content */}
      <Grid item xs={12}>
        <Card>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab icon={<ReportProblem />} label="Danh sách tranh chấp" />
            <Tab icon={<Person />} label="Theo dõi xử lý" />
          </Tabs>

          <CardContent sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Danh sách tranh chấp ({disputes.length})
                </Typography>
                <List>
                  {disputes.map((dispute) => (
                    <React.Fragment key={dispute.id}>
                      <ListItem
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(dispute.status) }}>
                            <ReportProblem />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {dispute.topic}
                              </Typography>
                              <Chip
                                size="small"
                                label={getStatusLabel(dispute.status)}
                                color={getStatusColor(dispute.status)}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {dispute.createdDate.toLocaleDateString('vi-VN')} • {dispute.owner}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {dispute.description}
                              </Typography>
                            </Box>
                          }
                        />
                        <IconButton>
                          <Visibility />
                        </IconButton>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {selectedTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Theo dõi xử lý tranh chấp
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Gavel sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Tính năng đang phát triển
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý tiến trình xử lý tranh chấp, cập nhật trạng thái, gửi thông báo cho khách hàng
                  </Typography>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ReportProblem color="warning" />
            Chi tiết tranh chấp
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDispute && (
            <Stack spacing={2}>
              <Typography variant="h6">{selectedDispute.topic}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDispute.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Chủ sở hữu: {selectedDispute.owner}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ngày tạo: {selectedDispute.createdDate.toLocaleDateString('vi-VN')}
              </Typography>
              <Divider />
              <Typography variant="subtitle2">Lịch sử xử lý:</Typography>
              <List>
                {selectedDispute.actions.length === 0 && (
                  <ListItem>
                    <Typography color="text.secondary">Chưa có cập nhật xử lý</Typography>
                  </ListItem>
                )}
                {selectedDispute.actions.map((action, idx) => (
                  <ListItem key={idx}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={action.note}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {action.by} • {action.date.toLocaleDateString('vi-VN')}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
        <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Grid>
  );
}