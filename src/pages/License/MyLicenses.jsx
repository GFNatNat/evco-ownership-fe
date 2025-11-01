import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    IconButton,
    Alert,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Tooltip,
    Snackbar
} from '@mui/material';
import {
    Add,
    Visibility,
    Timeline,
    Refresh,
    CheckCircle,
    Error,
    Schedule,
    Warning,
    DriveEta,
    Description
} from '@mui/icons-material';
import licenseApi from '../../api/licenseApi';

export default function MyLicenses() {
    const navigate = useNavigate();

    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    // Status configuration
    const statusConfig = {
        pending: {
            icon: <Schedule />,
            color: 'warning',
            label: 'Pending',
            description: 'Under review'
        },
        verified: {
            icon: <CheckCircle />,
            color: 'success',
            label: 'Verified',
            description: 'Active and verified'
        },
        rejected: {
            icon: <Error />,
            color: 'error',
            label: 'Rejected',
            description: 'Verification failed'
        },
        expired: {
            icon: <Warning />,
            color: 'warning',
            label: 'Expired',
            description: 'Needs renewal'
        }
    };

    // Load user's licenses
    const loadMyLicenses = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await licenseApi.getMyLicenses();
            if (response.statusCode === 200) {
                setLicenses(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load licenses:', error);
            setNotification({ open: true, message: 'Failed to load your licenses', severity: 'error' });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadMyLicenses();
    }, []);

    // Manual refresh
    const handleRefresh = () => {
        loadMyLicenses(true);
    };

    // View license details
    const handleViewDetails = (license) => {
        setSelectedLicense(license);
        setDetailsDialogOpen(true);
    };

    // Navigate to status page
    const handleViewStatus = (license) => {
        navigate(`/license/status/${license.verificationId}`);
    };

    // Get status configuration
    const getStatusConfig = (status) => {
        return statusConfig[status] || statusConfig.pending;
    };

    // Render status chip
    const renderStatusChip = (status) => {
        const config = getStatusConfig(status);

        return (
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                size="small"
                sx={{ fontWeight: 600 }}
            />
        );
    };

    // Render empty state
    const renderEmptyState = () => (
        <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box sx={{
                fontSize: 80,
                mb: 2,
                opacity: 0.3
            }}>
                🪪
            </Box>
            <Typography variant="h5" gutterBottom>
                No Licenses Found
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                You haven't submitted any driving licenses for verification yet.
            </Typography>
            <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate('/license/verify')}
                sx={{ mt: 2, minWidth: 200 }}
            >
                Verify Your License
            </Button>
        </Box>
    );

    // Render license cards (mobile view)
    const renderLicenseCards = () => (
        <Grid container spacing={3}>
            {licenses.map(license => {
                const config = getStatusConfig(license.status);

                return (
                    <Grid item xs={12} md={6} lg={4} key={license.verificationId}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent>
                                {/* Header */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {license.licenseNumber}
                                    </Typography>
                                    {renderStatusChip(license.status)}
                                </Box>

                                {/* License Info */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Submitted: {new Date(license.submittedAt).toLocaleDateString()}
                                    </Typography>

                                    {license.verifiedAt && (
                                        <Typography variant="body2" color="textSecondary">
                                            Verified: {new Date(license.verifiedAt).toLocaleDateString()}
                                        </Typography>
                                    )}

                                    {license.expiryDate && (
                                        <Typography variant="body2" color="textSecondary">
                                            Expires: {new Date(license.expiryDate).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Status Description */}
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {config.description}
                                </Typography>

                                {/* Renewal Warning */}
                                {license.renewalRequired && (
                                    <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                                        Renewal required soon
                                    </Alert>
                                )}

                                {/* Actions */}
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Visibility />}
                                        onClick={() => handleViewDetails(license)}
                                    >
                                        Details
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Timeline />}
                                        onClick={() => handleViewStatus(license)}
                                    >
                                        Status
                                    </Button>

                                    {license.status === 'rejected' && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate('/license/verify')}
                                        >
                                            Try Again
                                        </Button>
                                    )}

                                    {license.renewalRequired && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="warning"
                                            onClick={() => navigate('/license/verify')}
                                        >
                                            Renew
                                        </Button>
                                    )}

                                    {license.status === 'verified' && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<DriveEta />}
                                            onClick={() => navigate('/coowner/vehicles')}
                                        >
                                            Book Vehicle
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );

    // Render license table (desktop view)
    const renderLicenseTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>License Number</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Submitted</TableCell>
                        <TableCell>Verified</TableCell>
                        <TableCell>Expires</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {licenses.map((license) => (
                        <TableRow key={license.verificationId} hover>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                    {license.licenseNumber}
                                </Typography>
                                {license.renewalRequired && (
                                    <Chip
                                        label="Renewal Required"
                                        color="warning"
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                )}
                            </TableCell>

                            <TableCell>
                                {renderStatusChip(license.status)}
                            </TableCell>

                            <TableCell>
                                {new Date(license.submittedAt).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                {license.verifiedAt
                                    ? new Date(license.verifiedAt).toLocaleDateString()
                                    : '-'
                                }
                            </TableCell>

                            <TableCell>
                                {license.expiryDate
                                    ? new Date(license.expiryDate).toLocaleDateString()
                                    : '-'
                                }
                            </TableCell>

                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewDetails(license)}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="View Status">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewStatus(license)}
                                        >
                                            <Timeline />
                                        </IconButton>
                                    </Tooltip>

                                    {license.status === 'verified' && (
                                        <Tooltip title="Book Vehicle">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => navigate('/coowner/vehicles')}
                                            >
                                                <DriveEta />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // License details dialog
    const renderDetailsDialog = () => (
        <Dialog
            open={detailsDialogOpen}
            onClose={() => setDetailsDialogOpen(false)}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Description />
                    License Details
                </Box>
            </DialogTitle>

            <DialogContent>
                {selectedLicense && (
                    <Box>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">
                                    License Number
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedLicense.licenseNumber}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">
                                    Status
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    {renderStatusChip(selectedLicense.status)}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="body2" color="textSecondary">
                                    Submitted
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {new Date(selectedLicense.submittedAt).toLocaleString()}
                                </Typography>
                            </Grid>

                            {selectedLicense.verifiedAt && (
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Verified
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {new Date(selectedLicense.verifiedAt).toLocaleString()}
                                    </Typography>
                                </Grid>
                            )}

                            {selectedLicense.expiryDate && (
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Expires
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {new Date(selectedLicense.expiryDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>

                        {/* Reject Reason */}
                        {selectedLicense.rejectReason && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Rejection Reason:
                                </Typography>
                                <Typography variant="body2">
                                    {selectedLicense.rejectReason}
                                </Typography>
                            </Alert>
                        )}

                        {/* Notes */}
                        {selectedLicense.notes && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Notes:
                                </Typography>
                                <Typography variant="body2">
                                    {selectedLicense.notes}
                                </Typography>
                            </Alert>
                        )}

                        {/* License Image */}
                        {selectedLicense.imageUrl && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    License Image:
                                </Typography>
                                <img
                                    src={selectedLicense.imageUrl}
                                    alt="License"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: 8,
                                        border: '1px solid #ddd'
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)}>
                    Close
                </Button>
                {selectedLicense && (
                    <Button
                        variant="contained"
                        onClick={() => {
                            setDetailsDialogOpen(false);
                            handleViewStatus(selectedLicense);
                        }}
                    >
                        View Status
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading your licenses...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        🪪 My Driving Licenses
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Manage and track your driving license verifications
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {refreshing ? (
                        <CircularProgress size={24} />
                    ) : (
                        <IconButton
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{ bgcolor: 'action.hover' }}
                        >
                            <Refresh />
                        </IconButton>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/license/verify')}
                        size="large"
                    >
                        Add New License
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            {licenses.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary">
                                    {licenses.length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Total Licenses
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="success.main">
                                    {licenses.filter(l => l.status === 'verified').length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Verified
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="warning.main">
                                    {licenses.filter(l => l.status === 'pending').length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Pending
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="error.main">
                                    {licenses.filter(l => l.status === 'rejected').length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Rejected
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Content */}
            {licenses.length === 0 ? (
                renderEmptyState()
            ) : (
                <Box>
                    {/* Desktop Table View */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        {renderLicenseTable()}
                    </Box>

                    {/* Mobile Card View */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        {renderLicenseCards()}
                    </Box>
                </Box>
            )}

            {/* Floating Action Button for Mobile */}
            <Fab
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: { xs: 'flex', md: 'none' }
                }}
                onClick={() => navigate('/license/verify')}
            >
                <Add />
            </Fab>

            {/* Details Dialog */}
            {renderDetailsDialog()}

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