import React from 'react';
import {
    Card, CardContent, Typography, Grid, TextField, Button,
    Stack, Snackbar, Alert, Stepper, Step, StepLabel, Box,
    FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import vehicleApi from '../../api/vehicleApi';
import { useNavigate } from 'react-router-dom';

const steps = ['Thông tin xe', 'Đồng sở hữu', 'Xác nhận'];

export default function CreateVehicle() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');

    const [vehicleForm, setVehicleForm] = React.useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        licensePlate: '',
        vinNumber: '',
        engineNumber: '',
        registrationNumber: '',
        description: '',
        purchasePrice: '',
        estimatedValue: '',
    });

    const [coOwners, setCoOwners] = React.useState([
        { email: '', percentage: 100, name: '', isOwner: true }
    ]);

    const handleNext = () => {
        if (activeStep === 0 && !validateVehicleForm()) return;
        if (activeStep === 1 && !validateCoOwnership()) return;
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const validateVehicleForm = () => {
        const required = ['make', 'model', 'year', 'licensePlate', 'vinNumber'];
        for (let field of required) {
            if (!vehicleForm[field]) {
                setError(`Vui lòng nhập ${field}`);
                return false;
            }
        }
        return true;
    };

    const validateCoOwnership = () => {
        const totalPercentage = coOwners.reduce((sum, owner) => sum + Number(owner.percentage || 0), 0);
        if (totalPercentage !== 100) {
            setError('Tổng tỷ lệ sở hữu phải bằng 100%');
            return false;
        }

        for (let owner of coOwners) {
            if (!owner.email || !owner.percentage) {
                setError('Vui lòng nhập đầy đủ thông tin đồng sở hữu');
                return false;
            }
        }
        return true;
    };

    const addCoOwner = () => {
        setCoOwners([...coOwners, { email: '', percentage: 0, name: '', isOwner: false }]);
    };

    const removeCoOwner = (index) => {
        if (coOwners.length > 1) {
            setCoOwners(coOwners.filter((_, i) => i !== index));
        }
    };

    const updateCoOwner = (index, field, value) => {
        const updated = coOwners.map((owner, i) =>
            i === index ? { ...owner, [field]: value } : owner
        );
        setCoOwners(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const vehicleData = {
                ...vehicleForm,
                coOwners: coOwners.map(owner => ({
                    email: owner.email,
                    ownershipPercentage: Number(owner.percentage),
                    name: owner.name,
                    isOwner: owner.isOwner
                }))
            };

            const res = await vehicleApi.create(vehicleData);
            setMessage('Tạo xe thành công!');

            // Redirect after success
            setTimeout(() => {
                navigate('/co-owner/vehicles');
            }, 2000);

        } catch (err) {
            setError(err?.response?.data?.message || 'Tạo xe thất bại');
        } finally {
            setLoading(false);
        }
    };

    const renderVehicleForm = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Hãng xe"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Mẫu xe"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Năm sản xuất"
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Màu sắc"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Biển số xe"
                    value={vehicleForm.licensePlate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Số VIN"
                    value={vehicleForm.vinNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, vinNumber: e.target.value })}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Số máy"
                    value={vehicleForm.engineNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, engineNumber: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Số đăng ký"
                    value={vehicleForm.registrationNumber}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Giá mua (VNĐ)"
                    type="number"
                    value={vehicleForm.purchasePrice}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, purchasePrice: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Giá trị ước tính (VNĐ)"
                    type="number"
                    value={vehicleForm.estimatedValue}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, estimatedValue: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Mô tả"
                    multiline
                    rows={3}
                    value={vehicleForm.description}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                />
            </Grid>
        </Grid>
    );

    const renderCoOwnership = () => (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Danh sách đồng sở hữu</Typography>
                <Button startIcon={<Add />} onClick={addCoOwner}>
                    Thêm đồng sở hữu
                </Button>
            </Stack>

            {coOwners.map((owner, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={owner.email}
                                    onChange={(e) => updateCoOwner(index, 'email', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Họ tên"
                                    value={owner.name}
                                    onChange={(e) => updateCoOwner(index, 'name', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    fullWidth
                                    label="Tỷ lệ (%)"
                                    type="number"
                                    value={owner.percentage}
                                    onChange={(e) => updateCoOwner(index, 'percentage', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                {owner.isOwner ? (
                                    <Chip label="Chủ sở hữu" color="primary" />
                                ) : (
                                    <Chip label="Đồng sở hữu" color="default" />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                {!owner.isOwner && (
                                    <Button
                                        color="error"
                                        onClick={() => removeCoOwner(index)}
                                        size="small"
                                    >
                                        <Delete />
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}

            <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                    Tổng tỷ lệ: {coOwners.reduce((sum, owner) => sum + Number(owner.percentage || 0), 0)}%
                </Typography>
            </Box>
        </Box>
    );

    const renderConfirmation = () => (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Thông tin xe
                </Typography>
                <Box sx={{ pl: 2 }}>
                    <Typography>Hãng: {vehicleForm.make}</Typography>
                    <Typography>Mẫu: {vehicleForm.model}</Typography>
                    <Typography>Năm: {vehicleForm.year}</Typography>
                    <Typography>Biển số: {vehicleForm.licensePlate}</Typography>
                    <Typography>Số VIN: {vehicleForm.vinNumber}</Typography>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Danh sách đồng sở hữu
                </Typography>
                <Box sx={{ pl: 2 }}>
                    {coOwners.map((owner, index) => (
                        <Typography key={index}>
                            {owner.email} - {owner.percentage}% {owner.isOwner && '(Chủ sở hữu)'}
                        </Typography>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return renderVehicleForm();
            case 1:
                return renderCoOwnership();
            case 2:
                return renderConfirmation();
            default:
                return 'Unknown step';
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Tạo xe mới
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mb: 4 }}>
                    {getStepContent(activeStep)}
                </Box>

                <Box display="flex" justifyContent="space-between">
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Quay lại
                    </Button>

                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo xe'}
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Tiếp tục
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Notifications */}
                <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage('')}>
                    <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
                </Snackbar>
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                    <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
}