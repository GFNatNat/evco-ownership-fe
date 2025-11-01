import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    LinearProgress,
    Alert,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Divider,
    CircularProgress,
    Snackbar
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Schedule,
    Warning,
    Refresh,
    ArrowBack,
    FileDownload,
    Timeline
} from '@mui/icons-material';
import licenseApi from '../../api/licenseApi';

export default function LicenseStatus() {
    const { verificationId } = useParams();
    const navigate = useNavigate();

    const [licenseStatus, setLicenseStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    // Status configuration
    const statusConfig = {
        pending: {
            icon: <Schedule />,
            color: 'warning',
            bgColor: '#fff3cd',
            textColor: '#856404',
            title: 'Verification in Progress',
            description: 'Your license is being reviewed by our verification team.'
        },
        verified: {
            icon: <CheckCircle />,
            color: 'success',
            bgColor: '#d1edff',
            textColor: '#0f5132',
            title: '🎉 License Verified Successfully!',
            description: 'Your driving license has been verified and you can now book vehicles.'
        },
        rejected: {
            icon: <Error />,
            color: 'error',
            bgColor: '#f8d7da',
            textColor: '#721c24',
            title: 'Verification Rejected',
            description: 'Unfortunately, your license verification was rejected.'
        },
        expired: {
            icon: <Warning />,
            color: 'warning',
            bgColor: '#fff3cd',
            textColor: '#856404',
            title: 'License Expired',
            description: 'Your license has expired and needs to be renewed.'
        }
    };

    // Verification steps
    const verificationSteps = [
        'Submitted',
        'Under Review',
        'Verified'
    ];

    const getActiveStep = (status) => {
        switch (status) {
            case 'pending': return 1;
            case 'verified': return 2;
            case 'rejected': return 1;
            case 'expired': return 1;
            default: return 0;
        }
    };

    // Load license status
    const loadLicenseStatus = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await licenseApi.getLicenseStatus(verificationId);
            if (response.statusCode === 200) {
                setLicenseStatus(response.data);
            } else {
                setNotification({ open: true, message: 'License not found', severity: 'error' });
                navigate('/license/my-licenses');
            }
        } catch (error) {
            console.error('Failed to load license status:', error);
            setNotification({ open: true, message: 'Failed to load license status', severity: 'error' });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial load and polling setup
    useEffect(() => {
        if (!verificationId) {
            navigate('/license/my-licenses');
            return;
        }

        loadLicenseStatus();

        // Poll for status updates every 30 seconds if pending
        const interval = setInterval(() => {
            if (licenseStatus?.status === 'pending') {
                loadLicenseStatus(true);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [verificationId, licenseStatus?.status]);

    // Manual refresh
    const handleRefresh = () => {
        loadLicenseStatus(true);
    };

    // Render status badge
    const renderStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Chip
                icon={config.icon}
                label={status.toUpperCase()}
                sx={{
                    bgcolor: config.bgColor,
                    color: config.textColor,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 2,
                    py: 1
                }}
            />
        );
    };

    // Render progress stepper
    const renderProgressStepper = () => {
        if (!licenseStatus) return null;

        const activeStep = getActiveStep(licenseStatus.status);

        return (
            <Box sx={{ mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {verificationSteps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel
                                error={licenseStatus.status === 'rejected' && index === 1}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        );
    };

    // Render status-specific content
    const renderStatusContent = () => {
        if (!licenseStatus) return null;

        const config = statusConfig[licenseStatus.status] || statusConfig.pending;

        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            {config.title}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            {config.description}
                        </Typography>
                    </Box>

                    {/* Status-specific content */}
                    {licenseStatus.status === 'pending' && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    This usually takes 1-3 business days. We'll notify you once the review is complete.
                                </Typography>
                            </Alert>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                {refreshing && <CircularProgress size={20} />}
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    Refresh Status
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {licenseStatus.status === 'verified' && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    🎉 Congratulations! Your license has been verified successfully.
                                </Typography>
                            </Alert>

                            {licenseStatus.renewalRequired && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        ⚠️ Renewal Required
                                    </Typography>
                                    <Typography variant="body2">
                                        Your license will expire soon. Please renew it to continue using our services.
                                    </Typography>
                                </Alert>
                            )}

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/coowner/vehicles')}
                                    sx={{ minWidth: 200 }}
                                >
                                    Start Booking Vehicles
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {licenseStatus.status === 'rejected' && (
                        <Box>
                            <Alert severity="error" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Reason for Rejection:
                                </Typography>
                                <Typography variant="body2">
                                    {licenseStatus.rejectReason || 'No specific reason provided'}
                                </Typography>
                            </Alert>

                            {licenseStatus.notes && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Additional Notes:
                                    </Typography>
                                    <Typography variant="body2">
                                        {licenseStatus.notes}
                                    </Typography>
                                </Alert>
                            )}

                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    📋 Next Steps:
                                </Typography>
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    <li>Review the rejection reason above</li>
                                    <li>Ensure your license information is correct</li>
                                    <li>Take a clearer photo of your license</li>
                                    <li>Submit a new verification request</li>
                                </ul>
                            </Paper>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/license/verify')}
                                    sx={{ minWidth: 200 }}
                                >
                                    Submit New Verification
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {licenseStatus.status === 'expired' && (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    Your license has expired. Please renew it with the appropriate authorities.
                                </Typography>
                            </Alert>

                            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    📋 To continue using our services:
                                </Typography>
                                <ol style={{ margin: 0, paddingLeft: 20 }}>
                                    <li>Renew your driving license with the appropriate authorities</li>
                                    <li>Submit a new verification request with your renewed license</li>
                                    <li>Wait for verification to complete</li>
                                </ol>
                            </Paper>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/license/verify')}
                                    sx={{ minWidth: 200 }}
                                >
                                    Submit Renewed License
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading license status...
                </Typography>
            </Box>
        );
    }

    if (!licenseStatus) {
        return (
            <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" gutterBottom>
                    License not found
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/license/my-licenses')}
                    startIcon={<ArrowBack />}
                >
                    Back to My Licenses
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/license/my-licenses')}
                        sx={{ mr: 2 }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                        License Verification Status
                    </Typography>
                    {renderStatusBadge(licenseStatus.status)}
                </Box>

                {renderProgressStepper()}
            </Box>

            {/* License Details */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        📄 License Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="textSecondary">
                                License Number
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {licenseStatus.licenseNumber}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="textSecondary">
                                Submitted
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {new Date(licenseStatus.submittedAt).toLocaleString()}
                            </Typography>
                        </Grid>

                        {licenseStatus.verifiedAt && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">
                                    Verified
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {new Date(licenseStatus.verifiedAt).toLocaleString()}
                                </Typography>
                            </Grid>
                        )}

                        {licenseStatus.verifiedBy && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">
                                    Verified By
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {licenseStatus.verifiedBy}
                                </Typography>
                            </Grid>
                        )}

                        {licenseStatus.expiryDate && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">
                                    Expires
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {new Date(licenseStatus.expiryDate).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Status Content */}
            {renderStatusContent()}

            {/* License Image */}
            {licenseStatus.imageUrl && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            📷 Submitted License Image
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src={licenseStatus.imageUrl}
                                alt="License"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 400,
                                    borderRadius: 8,
                                    border: '1px solid #ddd'
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}