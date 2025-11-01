import React from 'react';
import {
  Card, CardContent, Typography, Grid, Button, Box, Stack, TextField,
  Avatar, AvatarGroup, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Tabs, Tab, Paper, List, ListItem, ListItemAvatar,
  ListItemText, ListItemSecondaryAction, IconButton, Tooltip, Fab,
  Divider, Badge, CircularProgress, Alert, Snackbar, FormControlLabel,
  Switch, Menu, MenuItem, LinearProgress
} from '@mui/material';
import {
  Group as GroupIcon, Person, Add, MoreVert, HowToVote as Vote,
  AccountBalance, Message, Settings, ExitToApp, PersonAdd,
  Schedule, DirectionsCar, Payment, Notifications, Check, Close
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import groupApi from '../../api/groupApi';
import coOwnerApi from '../../api/coowner';
import { useAuth } from '../../context/AuthContext';

export default function Group() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [myGroups, setMyGroups] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteMessage, setInviteMessage] = React.useState('');

  React.useEffect(() => {
    loadMyGroups();
  }, []);

  const loadMyGroups = async () => {
    setLoading(true);
    try {
      const res = await groupApi.getGroups();
      const groups = res.data || [];
      setMyGroups(groups);
      if (groups.length > 0 && !selectedGroup) {
        setSelectedGroup(groups[0]);
      }
    } catch (err) {
      setError('Không thể tải danh sách nhóm');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !selectedGroup) return;

    try {
      await groupApi.addMember(selectedGroup.id, {
        email: inviteEmail,
        message: inviteMessage,
        role: 'Member'
      });
      setMessage('Gửi lời mời thành công!');
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteMessage('');
    } catch (err) {
      setError('Gửi lời mời thất bại');
    }
  };

  const getUserRole = (group) => {
    const membership = group.members?.find(member => member.userId === user?.id);
    return membership?.role || 'Member';
  };

  const canManageGroup = (group) => {
    const role = getUserRole(group);
    return role === 'Owner' || role === 'Admin';
  };

  return (
    <Grid container spacing={3}>
      {/* Group Selection Header */}
      <Grid item xs={12}>
        <Card sx={{ background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <GroupIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {selectedGroup ? selectedGroup.name : 'Nhóm đồng sở hữu'}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {selectedGroup ? (
                      `Quản lý nhóm sở hữu xe ${selectedGroup.vehicle?.make} ${selectedGroup.vehicle?.model}`
                    ) : (
                      'Chọn nhóm để quản lý'
                    )}
                  </Typography>
                  {selectedGroup && (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Chip
                        size="small"
                        label={getUserRole(selectedGroup)}
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                      <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                        {selectedGroup.members?.map((member, index) => (
                          <Avatar key={index}>{member.name?.charAt(0)}</Avatar>
                        ))}
                      </AvatarGroup>
                    </Box>
                  )}
                </Box>
              </Box>
              {selectedGroup && canManageGroup(selectedGroup) && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setInviteDialogOpen(true)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                >
                  Mời thành viên
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Group Selection */}
      {myGroups.length > 1 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Các nhóm của tôi</Typography>
              <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                {myGroups.map((group) => (
                  <Card
                    key={group.id}
                    variant={selectedGroup?.id === group.id ? "elevation" : "outlined"}
                    sx={{
                      minWidth: 200,
                      cursor: 'pointer',
                      border: selectedGroup?.id === group.id ? '2px solid #1976d2' : undefined
                    }}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <DirectionsCar color="action" />
                        <Typography variant="subtitle2">{group.name}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {group.vehicle?.make} {group.vehicle?.model}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.7rem' } }}>
                          {group.members?.map((member, index) => (
                            <Avatar key={index}>{member.name?.charAt(0)}</Avatar>
                          ))}
                        </AvatarGroup>
                        <Chip size="small" label={getUserRole(group)} />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Main Content */}
      {selectedGroup ? (
        <Grid item xs={12}>
          <Card>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab icon={<Person />} label="Thành viên" />
              <Tab icon={<Vote />} label="Bỏ phiếu" />
              <Tab icon={<AccountBalance />} label="Quỹ chung" />
              <Tab icon={<Schedule />} label="Lịch sử dụng" />
              <Tab icon={<Message />} label="Thảo luận" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {selectedTab === 0 && <GroupMembers group={selectedGroup} canManage={canManageGroup(selectedGroup)} />}
              {selectedTab === 1 && <GroupVoting group={selectedGroup} canManage={canManageGroup(selectedGroup)} />}
              {selectedTab === 2 && <GroupFund group={selectedGroup} />}
              {selectedTab === 3 && <GroupSchedule group={selectedGroup} />}
              {selectedTab === 4 && <GroupDiscussion group={selectedGroup} />}
            </Box>
          </Card>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box textAlign="center" py={8}>
                <GroupIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {myGroups.length === 0 ? 'Bạn chưa tham gia nhóm nào' : 'Chọn nhóm để quản lý'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {myGroups.length === 0 ?
                    'Đăng ký sở hữu chung xe để tham gia nhóm' :
                    'Chọn một nhóm ở trên để xem chi tiết'
                  }
                </Typography>
                {myGroups.length === 0 && (
                  <Button variant="contained" href="/coowner/ownership">
                    Đăng ký sở hữu
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAdd color="primary" />
            Mời thành viên mới
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Email người muốn mời"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Tin nhắn mời (tùy chọn)"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Lời mời tham gia nhóm sở hữu chung xe..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleInviteMember} variant="contained" disabled={!inviteEmail}>
            Gửi lời mời
          </Button>
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

// Group Members Management Component
function GroupMembers({ group, canManage }) {
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (group) {
      loadMembers();
    }
  }, [group]);

  const loadMembers = async () => {
    if (!group?.id) return;
    setLoading(true);
    try {
      const res = await groupApi.getGroupMembers(group.id);
      setMembers(res.data || []);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Owner': return 'error';
      case 'Admin': return 'warning';
      case 'Member': return 'primary';
      default: return 'default';
    }
  };

  const getOwnershipPercentage = (member) => {
    // Calculate based on investment or equal split
    const totalMembers = members.length;
    return totalMembers > 0 ? Math.round(100 / totalMembers) : 0;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Thành viên nhóm ({members.length})
      </Typography>

      <Grid container spacing={2}>
        {loading ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          members.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: getRoleColor(member.role) + '.main' }}>
                      {member.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="subtitle1">{member.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                    {canManage && member.role !== 'Owner' && (
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    )}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Chip
                      label={member.role}
                      color={getRoleColor(member.role)}
                      size="small"
                    />
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {getOwnershipPercentage(member)}% sở hữu
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                    </Typography>
                    {member.lastActive && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Hoạt động gần nhất: {new Date(member.lastActive).toLocaleDateString('vi-VN')}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {members.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Person sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography color="text.secondary">
            Chưa có thành viên nào trong nhóm
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// Group Voting Component
function GroupVoting({ group, canManage }) {
  const [votes, setVotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [createVoteOpen, setCreateVoteOpen] = React.useState(false);
  const [newVote, setNewVote] = React.useState({ title: '', description: '', options: ['', ''] });

  React.useEffect(() => {
    if (group) {
      loadVotes();
    }
  }, [group]);

  const loadVotes = async () => {
    if (!group?.id) return;
    setLoading(true);
    try {
      // Mock data for now
      setVotes([
        {
          id: 1,
          title: 'Thay dầu một xe',
          description: 'Đề nghị thay dầu engine cho xe để đảm bảo hiệu suất hoạt động',
          createdBy: 'Nguyễn Văn A',
          createdAt: new Date(),
          status: 'Active',
          yesVotes: 2,
          noVotes: 1,
          totalMembers: 4
        },
        {
          id: 2,
          title: 'Lịch sử dụng tháng 11',
          description: 'Phân chia lịch sử dụng xe cho tháng 11/2025',
          createdBy: 'Trần Thị B',
          createdAt: new Date(Date.now() - 86400000),
          status: 'Completed',
          yesVotes: 3,
          noVotes: 0,
          totalMembers: 4
        }
      ]);
    } catch (err) {
      console.error('Failed to load votes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteId, choice) => {
    try {
      // Mock voting
      setVotes(prev => prev.map(vote => {
        if (vote.id === voteId) {
          return {
            ...vote,
            yesVotes: choice === 'yes' ? vote.yesVotes + 1 : vote.yesVotes,
            noVotes: choice === 'no' ? vote.noVotes + 1 : vote.noVotes
          };
        }
        return vote;
      }));
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const getVoteProgress = (vote) => {
    const total = vote.yesVotes + vote.noVotes;
    return total > 0 ? (vote.yesVotes / total) * 100 : 0;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Bỏ phiếu nhóm ({votes.length})
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateVoteOpen(true)}
          >
            Tạo cuộc bỏ phiếu
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        {votes.map((vote) => (
          <Grid item xs={12} key={vote.id}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>{vote.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {vote.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Bởi {vote.createdBy} • {vote.createdAt.toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Chip
                    label={vote.status}
                    color={vote.status === 'Active' ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">
                      Kết quả bỏ phiếu ({vote.yesVotes + vote.noVotes}/{vote.totalMembers})
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {Math.round(getVoteProgress(vote))}% đồng ý
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getVoteProgress(vote)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption" color="success.main">
                      Đồng ý: {vote.yesVotes}
                    </Typography>
                    <Typography variant="caption" color="error.main">
                      Không đồng ý: {vote.noVotes}
                    </Typography>
                  </Box>
                </Box>

                {vote.status === 'Active' && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<Check />}
                      onClick={() => handleVote(vote.id, 'yes')}
                    >
                      Đồng ý
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Close />}
                      onClick={() => handleVote(vote.id, 'no')}
                    >
                      Không đồng ý
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {votes.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Vote sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
          <Typography color="text.secondary">
            Chưa có cuộc bỏ phiếu nào
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// Group Fund Management Component
function GroupFund({ group }) {
  const [fundInfo, setFundInfo] = React.useState({
    balance: 2500000,
    monthlyContribution: 500000,
    expenses: [
      { date: '2025-10-15', description: 'Bảo dưỡng định kì', amount: -800000, type: 'maintenance' },
      { date: '2025-10-10', description: 'Nạp quỹ tháng 10', amount: 2000000, type: 'contribution' },
      { date: '2025-10-05', description: 'Tiền xăng', amount: -300000, type: 'fuel' }
    ]
  });
  const [contributionAmount, setContributionAmount] = React.useState('');

  const handleContribute = async () => {
    if (!contributionAmount) return;

    // Mock contribution
    const newExpense = {
      date: new Date().toISOString().split('T')[0],
      description: `Nạp quỹ cá nhân`,
      amount: parseInt(contributionAmount),
      type: 'contribution'
    };

    setFundInfo(prev => ({
      ...prev,
      balance: prev.balance + parseInt(contributionAmount),
      expenses: [newExpense, ...prev.expenses]
    }));

    setContributionAmount('');
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'contribution': return <AccountBalance color="success" />;
      case 'maintenance': return <Settings color="warning" />;
      case 'fuel': return <DirectionsCar color="info" />;
      default: return <Payment />;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Fund Summary */}
      <Grid item xs={12} md={4}>
        <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: 'white' }}>
          <CardContent>
            <Box textAlign="center">
              <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>Số dư quỹ</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {fundInfo.balance.toLocaleString('vi-VN')}đ
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Hỗ trợ chi phí vận hành và bảo trì
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Contribute */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Nạp quỹ nhóm</Typography>
            <Stack direction="row" spacing={2} alignItems="end">
              <TextField
                fullWidth
                type="number"
                label="Số tiền (VNĐ)"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder={`Gợi ý: ${fundInfo.monthlyContribution.toLocaleString('vi-VN')}`}
              />
              <Button
                variant="contained"
                onClick={handleContribute}
                disabled={!contributionAmount}
                sx={{ minWidth: 120 }}
              >
                Nạp quỹ
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Đóng góp hàng tháng khuyến nghị: {fundInfo.monthlyContribution.toLocaleString('vi-VN')}đ
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Transaction History */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Lịch sử giao dịch</Typography>
            <List>
              {fundInfo.expenses.map((expense, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: expense.amount > 0 ? 'success.main' : 'warning.main'
                      }}>
                        {getTransactionIcon(expense.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={expense.description}
                      secondary={new Date(expense.date).toLocaleDateString('vi-VN')}
                    />
                    <Typography
                      variant="h6"
                      color={expense.amount > 0 ? 'success.main' : 'error.main'}
                    >
                      {expense.amount > 0 ? '+' : ''}{expense.amount.toLocaleString('vi-VN')}đ
                    </Typography>
                  </ListItem>
                  {index < fundInfo.expenses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// Group Schedule Component
function GroupSchedule({ group }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Lịch sử dụng xe nhóm</Typography>
      <Box textAlign="center" py={4}>
        <Schedule sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
        <Typography color="text.secondary">
          Tính năng đang phát triển
        </Typography>
      </Box>
    </Box>
  );
}

// Group Discussion Component
function GroupDiscussion({ group }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Thảo luận nhóm</Typography>
      <Box textAlign="center" py={4}>
        <Message sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
        <Typography color="text.secondary">
          Tính năng đang phát triển
        </Typography>
      </Box>
    </Box>
  );
}