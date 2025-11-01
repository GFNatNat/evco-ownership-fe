import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar
} from '@mui/material';
import {
    CloudUpload,
    CheckCircle,
    Error,
    Warning,
    CameraAlt
} from '@mui/icons-material';
import licenseApi from '../../api/licenseApi';
import FileUploadManager from '../../components/common/FileUploadManager';

export default function LicenseVerification() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        licenseNumber: '',
        issuedBy: '',
        issueDate: '',
        expiryDate: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        licenseImage: null
    });

    const [previewImage, setPreviewImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkingExists, setCheckingExists] = useState(false);
    const [licenseExists, setLicenseExists] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    // Vietnamese issuing authorities
    const issuingAuthorities = [
        'Department of Transport HCMC',
        'Department of Transport Hanoi',
        'Department of Transport Da Nang',
        'Department of Transport Can Tho',
        'Department of Transport Hai Phong',
        'Department of Transport Binh Duong',
        'Department of Transport Dong Nai',
        'Department of Transport Khanh Hoa',
        'Department of Transport Quang Ninh',
        'Other'
    ];

    // Check if license already exists when license number changes
    const checkLicenseExists = async (licenseNumber) => {
        if (licenseNumber.length < 8) {
            setLicenseExists(null);
            return;
        }

        setCheckingExists(true);
        try {
            const response = await licenseApi.checkLicenseExists(licenseNumber);
            setLicenseExists(response.data.exists);
        } catch (error) {
            console.error('Error checking license:', error);
            setLicenseExists(null);
        } finally {
            setCheckingExists(false);
        }
    };

    // Debounced license number checking
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (formData.licenseNumber) {
                checkLicenseExists(formData.licenseNumber);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [formData.licenseNumber]);

    // Form validation
    const validateForm = () => {
        const errors = {};

        // License number validation
        if (!formData.licenseNumber || formData.licenseNumber.length < 8) {
            errors.licenseNumber = 'License number must be at least 8 characters';
        }

        // Personal information validation
        if (!formData.firstName || formData.firstName.length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName || formData.lastName.length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        // Age validation (must be 18+)
        if (formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                errors.dateOfBirth = 'You must be at least 18 years old';
            }

            if (age > 100) {
                errors.dateOfBirth = 'Please check your date of birth';
            }
        } else {
            errors.dateOfBirth = 'Date of birth is required';
        }

        // Date validations
        if (!formData.issueDate) {
            errors.issueDate = 'Issue date is required';
        } else {
            const issueDate = new Date(formData.issueDate);
            if (issueDate > new Date()) {
                errors.issueDate = 'Issue date cannot be in the future';
            }
        }

        if (formData.expiryDate) {
            const expiryDate = new Date(formData.expiryDate);
            const issueDate = new Date(formData.issueDate);
            if (expiryDate <= issueDate) {
                errors.expiryDate = 'Expiry date must be after issue date';
            }
        }

        // Required fields
        if (!formData.issuedBy) {
            errors.issuedBy = 'Issuing authority is required';
        }

        if (!formData.licenseImage) {
            errors.licenseImage = 'License image is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setNotification({ open: true, message: 'Image size must be less than 5MB', severity: 'error' });
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setNotification({ open: true, message: 'Please select a valid image file', severity: 'error' });
                return;
            }

            setFormData(prev => ({ ...prev, licenseImage: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result);
            };
            reader.readAsDataURL(file);

            // Clear validation error
            if (validationErrors.licenseImage) {
                setValidationErrors(prev => ({
                    ...prev,
                    licenseImage: undefined
                }));
            }
        }
    };

    // Remove image
    const removeImage = () => {
        setFormData(prev => ({ ...prev, licenseImage: null }));
        setPreviewImage('');
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setNotification({ open: true, message: 'Please fix the validation errors', severity: 'error' });
            return;
        }

        if (licenseExists) {
            setNotification({ open: true, message: 'This license number is already registered', severity: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();

            // Append all fields to FormData
            formDataToSend.append('licenseNumber', formData.licenseNumber);
            formDataToSend.append('issuedBy', formData.issuedBy);
            formDataToSend.append('issueDate', formData.issueDate);
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('dateOfBirth', formData.dateOfBirth);
            formDataToSend.append('licenseImage', formData.licenseImage);

            if (formData.expiryDate) {
                formDataToSend.append('expiryDate', formData.expiryDate);
            }

            const response = await licenseApi.verifyLicense(formDataToSend);

            if (response.statusCode === 200 || response.statusCode === 201) {
                setNotification({ open: true, message: 'License submitted for verification successfully!', severity: 'success' });
                // Navigate to verification status page
                setTimeout(() => {
                    navigate(`/license/status/${response.data.verificationId}`);
                }, 1500);
            }
        } catch (error) {
            console.error('License verification error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit license';
            setNotification({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    🪪 Driving License Verification
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Please provide your driving license information for verification.
                    This process usually takes 1-3 business days.
                </Typography>
            </Box>

            {/* Main Form */}
            <Card>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        {/* License Number */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="License Number *"
                                value={formData.licenseNumber}
                                onChange={(e) => handleInputChange('licenseNumber', e.target.value.toUpperCase())}
                                placeholder="Enter your license number"
                                error={!!validationErrors.licenseNumber}
                                helperText={validationErrors.licenseNumber}
                                InputProps={{
                                    endAdornment: (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {checkingExists && <CircularProgress size={20} />}
                                            {licenseExists === true && (
                                                <Chip
                                                    icon={<Error />}
                                                    label="Already registered"
                                                    color="error"
                                                    size="small"
                                                />
                                            )}
                                            {licenseExists === false && (
                                                <Chip
                                                    icon={<CheckCircle />}
                                                    label="Available"
                                                    color="success"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                    )
                                }}
                            />
                        </Box>

                        {/* Personal Information */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="First Name *"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="First name as on license"
                                    error={!!validationErrors.firstName}
                                    helperText={validationErrors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name *"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Last name as on license"
                                    error={!!validationErrors.lastName}
                                    helperText={validationErrors.lastName}
                                />
                            </Grid>
                        </Grid>

                        {/* Date of Birth */}
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date of Birth *"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                error={!!validationErrors.dateOfBirth}
                                helperText={validationErrors.dateOfBirth}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>

                        {/* License Details */}
                        <Box sx={{ mb: 3 }}>
                            <FormControl
                                fullWidth
                                error={!!validationErrors.issuedBy}
                            >
                                <InputLabel>Issued By *</InputLabel>
                                <Select
                                    value={formData.issuedBy}
                                    label="Issued By *"
                                    onChange={(e) => handleInputChange('issuedBy', e.target.value)}
                                >
                                    {issuingAuthorities.map((authority) => (
                                        <MenuItem key={authority} value={authority}>
                                            {authority}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {validationErrors.issuedBy && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                                        {validationErrors.issuedBy}
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Issue Date *"
                                    value={formData.issueDate}
                                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                                    error={!!validationErrors.issueDate}
                                    helperText={validationErrors.issueDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Expiry Date (Optional)"
                                    value={formData.expiryDate}
                                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                    error={!!validationErrors.expiryDate}
                                    helperText={validationErrors.expiryDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* License Image Upload */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                License Image *
                            </Typography>

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    border: validationErrors.licenseImage ? '2px dashed red' : '2px dashed #ddd',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                                component="label"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />

                                {!previewImage ? (
                                    <Box>
                                        <CameraAlt sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Click to upload license image
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            PNG, JPG up to 5MB
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <img
                                            src={previewImage}
                                            alt="License preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: 300,
                                                borderRadius: 8
                                            }}
                                        />
                                        <Box sx={{ mt: 2 }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeImage();
                                                }}
                                            >
                                                Remove Image
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Paper>

                            {validationErrors.licenseImage && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                    {validationErrors.licenseImage}
                                </Typography>
                            )}
                        </Box>

                        {/* Image Guidelines */}
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                📋 Image Guidelines:
                            </Typography>
                            <List dense>
                                <ListItem sx={{ py: 0 }}>
                                    <ListItemText primary="• Ensure the license is clearly visible and readable" />
                                </ListItem>
                                <ListItem sx={{ py: 0 }}>
                                    <ListItemText primary="• Avoid glare and shadows" />
                                </ListItem>
                                <ListItem sx={{ py: 0 }}>
                                    <ListItemText primary="• Include all four corners of the license" />
                                </ListItem>
                                <ListItem sx={{ py: 0 }}>
                                    <ListItemText primary="• Use good lighting for best results" />
                                </ListItem>
                            </List>
                        </Alert>

                        {/* Submit Button */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isSubmitting || licenseExists === true}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUpload />}
                                sx={{ minWidth: 200 }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>

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