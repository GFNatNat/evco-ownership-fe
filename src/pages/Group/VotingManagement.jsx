import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, Button, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, Chip,
    LinearProgress, Radio, RadioGroup, FormControlLabel, FormLabel
} from '@mui/material';
import {
    HowToVote as VoteIcon, Add as AddIcon, Poll as PollIcon,
    CheckCircle as CheckIcon, Cancel as CancelIcon
} from '@mui/icons-material';
import groupApi from '../../api/group';

const VotingManagement = ({ groupId }) => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('create');
    const [selectedVote, setSelectedVote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        voteType: 'policy',
        options: ['Đồng ý', 'Không đồng ý'],
        selectedOption: ''
    });
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (groupId) {
            loadVotes();
        }
    }, [groupId]);

    const loadVotes = async () => {
        setLoading(true);
        try {
            const response = await groupApi.getVotes(groupId);
            setVotes(response.data?.votes || []);
        } catch (error) {
            showAlert('Lỗi tải danh sách bỏ phiếu: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, severity = 'info') => {
        setAlert({ open: true, message, severity });
        setTimeout(() => setAlert({ open: false, message: '', severity: 'info' }), 5000);
    };

    const handleCreateVote = async () => {
        try {
            const voteData = {
                title: formData.title,
                description: formData.description,
                voteType: formData.voteType,
                options: formData.options.map((option, index) => ({
                    id: index + 1,
                    text: option
                }))
            };

            await groupApi.createVote(groupId, voteData);
            showAlert('Tạo bỏ phiếu thành công!', 'success');
            setDialogOpen(false);
            loadVotes();
        } catch (error) {
            showAlert('Lỗi tạo bỏ phiếu: ' + error.message, 'error');
        }
    };

    const handleSubmitVote = async () => {
        try {
            await groupApi.submitVote(groupId, selectedVote.id, {
                optionId: parseInt(formData.selectedOption)
            });
            showAlert('Bỏ phiếu thành công!', 'success');
            setDialogOpen(false);
            loadVotes();
        } catch (error) {
            showAlert('Lỗi bỏ phiếu: ' + error.message, 'error');
        }
    };

    const openCreateDialog = () => {
        setDialogType('create');
        setFormData({
            title: '',
            description: '',
            voteType: 'policy',
            options: ['Đồng ý', 'Không đồng ý'],
            selectedOption: ''
        });
        setDialogOpen(true);
    };

    const openVoteDialog = (vote) => {
        setDialogType('vote');
        setSelectedVote(vote);
        setFormData({ ...formData, selectedOption: '' });
        setDialogOpen(true);
    };

    const getVoteTypeColor = (type) => {
        switch (type) {
            case 'maintenance': return 'warning';
            case 'expense': return 'error';
            case 'policy': return 'primary';
            case 'member': return 'info';
            default: return 'default';
        }
    };

    const getVoteTypeText = (type) => {
        switch (type) {
            case 'maintenance': return 'Bảo trì';
            case 'expense': return 'Chi phí';
            case 'policy': return 'Chính sách';
            case 'member': return 'Thành viên';
            default: return type;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, '']
        });
    };

    const updateOption = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({ ...formData, options: newOptions });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                <VoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Bỏ phiếu & Quyết định
            </Typography>

            {alert.open && (
                <Alert severity={alert.severity} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Danh sách Bỏ phiếu</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={openCreateDialog}
                                >
                                    Tạo bỏ phiếu mới
                                </Button>
                            </Box>

                            <Grid container spacing={2}>
                                {votes.map((vote) => (
                                    <Grid item xs={12} md={6} key={vote.id}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                    <Typography variant="h6" component="h3">
                                                        {vote.title}
                                                    </Typography>
                                                    <Chip
                                                        label={getVoteTypeText(vote.voteType)}
                                                        color={getVoteTypeColor(vote.voteType)}
                                                        size="small"
                                                    />
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {vote.description}
                                                </Typography>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Tiến độ: {vote.totalVotes || 0}/{vote.requiredVotes || 0} phiếu
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(vote.totalVotes || 0) / (vote.requiredVotes || 1) * 100}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Chip
                                                        label={vote.status || 'active'}
                                                        color={getStatusColor(vote.status)}
                                                        size="small"
                                                    />
                                                    {!vote.currentUserVoted && vote.status === 'active' && (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<PollIcon />}
                                                            onClick={() => openVoteDialog(vote)}
                                                        >
                                                            Bỏ phiếu
                                                        </Button>
                                                    )}
                                                    {vote.currentUserVoted && (
                                                        <Chip icon={<CheckIcon />} label="Đã bỏ phiếu" color="success" size="small" />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Create/Vote Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'create' ? 'Tạo bỏ phiếu mới' : 'Bỏ phiếu'}
                </DialogTitle>
                <DialogContent>
                    {dialogType === 'create' ? (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tiêu đề"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    multiline
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Loại bỏ phiếu</InputLabel>
                                    <Select
                                        value={formData.voteType}
                                        onChange={(e) => setFormData({ ...formData, voteType: e.target.value })}
                                    >
                                        <MenuItem value="policy">Chính sách</MenuItem>
                                        <MenuItem value="maintenance">Bảo trì</MenuItem>
                                        <MenuItem value="expense">Chi phí</MenuItem>
                                        <MenuItem value="member">Thành viên</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>Các lựa chọn:</Typography>
                                {formData.options.map((option, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            placeholder={`Lựa chọn ${index + 1}`}
                                            sx={{ mr: 1 }}
                                        />
                                        {formData.options.length > 2 && (
                                            <Button size="small" onClick={() => removeOption(index)}>
                                                Xóa
                                            </Button>
                                        )}
                                    </Box>
                                ))}
                                <Button size="small" onClick={addOption}>+ Thêm lựa chọn</Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>{selectedVote?.title}</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {selectedVote?.description}
                            </Typography>

                            <FormControl component="fieldset">
                                <FormLabel component="legend">Chọn lựa chọn của bạn:</FormLabel>
                                <RadioGroup
                                    value={formData.selectedOption}
                                    onChange={(e) => setFormData({ ...formData, selectedOption: e.target.value })}
                                >
                                    {selectedVote?.options?.map((option) => (
                                        <FormControlLabel
                                            key={option.id}
                                            value={option.id.toString()}
                                            control={<Radio />}
                                            label={`${option.text} (${option.voteCount || 0} phiếu)`}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
                    <Button
                        onClick={dialogType === 'create' ? handleCreateVote : handleSubmitVote}
                        variant="contained"
                        disabled={dialogType === 'vote' && !formData.selectedOption}
                    >
                        {dialogType === 'create' ? 'Tạo' : 'Bỏ phiếu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VotingManagement;