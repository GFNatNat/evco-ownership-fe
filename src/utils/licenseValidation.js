/**
 * License Validation Utilities
 * Comprehensive validation functions for license verification forms
 * Following README_FRONTEND_LICENSE.md specifications
 */

// License number validation
export const validateLicenseNumber = (licenseNumber) => {
    const errors = [];

    if (!licenseNumber) {
        errors.push('License number is required');
        return { isValid: false, errors };
    }

    // Remove spaces and convert to uppercase
    const cleanLicenseNumber = licenseNumber.replace(/\s/g, '').toUpperCase();

    // Minimum length check
    if (cleanLicenseNumber.length < 8) {
        errors.push('License number must be at least 8 characters');
    }

    // Maximum length check
    if (cleanLicenseNumber.length > 15) {
        errors.push('License number cannot exceed 15 characters');
    }

    // Basic format validation (alphanumeric)
    const formatRegex = /^[A-Z0-9]+$/;
    if (!formatRegex.test(cleanLicenseNumber)) {
        errors.push('License number can only contain letters and numbers');
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanValue: cleanLicenseNumber
    };
};

// Personal information validation
export const validatePersonalInfo = (firstName, lastName, dateOfBirth) => {
    const errors = {};

    // First name validation
    if (!firstName || firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
    } else if (firstName.trim().length > 50) {
        errors.firstName = 'First name cannot exceed 50 characters';
    } else if (!/^[a-zA-ZÀ-ỹĂăÂâĐđÊêÔôƠơƯư\s]+$/.test(firstName.trim())) {
        errors.firstName = 'First name can only contain letters and spaces';
    }

    // Last name validation
    if (!lastName || lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
    } else if (lastName.trim().length > 50) {
        errors.lastName = 'Last name cannot exceed 50 characters';
    } else if (!/^[a-zA-ZÀ-ỹĂăÂâĐđÊêÔôƠơƯư\s]+$/.test(lastName.trim())) {
        errors.lastName = 'Last name can only contain letters and spaces';
    }

    // Date of birth validation
    if (!dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
    } else {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        // Check if date is valid
        if (isNaN(birthDate.getTime())) {
            errors.dateOfBirth = 'Please enter a valid date';
        } else {
            // Calculate age
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            // Age validation
            if (age < 18) {
                errors.dateOfBirth = 'You must be at least 18 years old to apply for a license';
            } else if (age > 100) {
                errors.dateOfBirth = 'Please check your date of birth';
            }

            // Future date check
            if (birthDate > today) {
                errors.dateOfBirth = 'Date of birth cannot be in the future';
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// License dates validation
export const validateLicenseDates = (issueDate, expiryDate) => {
    const errors = {};
    const today = new Date();

    // Issue date validation
    if (!issueDate) {
        errors.issueDate = 'Issue date is required';
    } else {
        const issueDateObj = new Date(issueDate);

        if (isNaN(issueDateObj.getTime())) {
            errors.issueDate = 'Please enter a valid issue date';
        } else {
            // Future date check
            if (issueDateObj > today) {
                errors.issueDate = 'Issue date cannot be in the future';
            }

            // Too old check (licenses older than 50 years are suspicious)
            const yearsDiff = today.getFullYear() - issueDateObj.getFullYear();
            if (yearsDiff > 50) {
                errors.issueDate = 'Issue date seems too old, please verify';
            }
        }
    }

    // Expiry date validation (optional)
    if (expiryDate) {
        const expiryDateObj = new Date(expiryDate);
        const issueDateObj = new Date(issueDate);

        if (isNaN(expiryDateObj.getTime())) {
            errors.expiryDate = 'Please enter a valid expiry date';
        } else if (!isNaN(issueDateObj.getTime())) {
            // Expiry date must be after issue date
            if (expiryDateObj <= issueDateObj) {
                errors.expiryDate = 'Expiry date must be after issue date';
            }

            // Check if already expired
            if (expiryDateObj < today) {
                errors.expiryDate = 'This license has already expired';
            }

            // Reasonable validity period check (typically 5-20 years)
            const validityYears = expiryDateObj.getFullYear() - issueDateObj.getFullYear();
            if (validityYears > 20) {
                errors.expiryDate = 'License validity period seems too long';
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Image file validation
export const validateLicenseImage = (file) => {
    const errors = [];

    if (!file) {
        errors.push('License image is required');
        return { isValid: false, errors };
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        errors.push('Please upload a valid image file (JPG, PNG, or WebP)');
    }

    // File size validation (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        errors.push('Image size must be less than 5MB');
    }

    // Minimum file size (to ensure it's not empty)
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
        errors.push('Image file seems too small, please upload a valid image');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Issuing authority validation
export const validateIssuingAuthority = (issuedBy) => {
    const errors = [];

    if (!issuedBy) {
        errors.push('Issuing authority is required');
        return { isValid: false, errors };
    }

    // List of valid Vietnamese issuing authorities
    const validAuthorities = [
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

    if (!validAuthorities.includes(issuedBy)) {
        errors.push('Please select a valid issuing authority');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Complete form validation
export const validateLicenseForm = (formData) => {
    const allErrors = {};

    // Validate license number
    const licenseValidation = validateLicenseNumber(formData.licenseNumber);
    if (!licenseValidation.isValid) {
        allErrors.licenseNumber = licenseValidation.errors[0];
    }

    // Validate personal information
    const personalValidation = validatePersonalInfo(
        formData.firstName,
        formData.lastName,
        formData.dateOfBirth
    );
    Object.assign(allErrors, personalValidation.errors);

    // Validate license dates
    const datesValidation = validateLicenseDates(
        formData.issueDate,
        formData.expiryDate
    );
    Object.assign(allErrors, datesValidation.errors);

    // Validate issuing authority
    const authorityValidation = validateIssuingAuthority(formData.issuedBy);
    if (!authorityValidation.isValid) {
        allErrors.issuedBy = authorityValidation.errors[0];
    }

    // Validate license image
    const imageValidation = validateLicenseImage(formData.licenseImage);
    if (!imageValidation.isValid) {
        allErrors.licenseImage = imageValidation.errors[0];
    }

    return {
        isValid: Object.keys(allErrors).length === 0,
        errors: allErrors
    };
};

// Age calculation utility
export const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

// License expiry check
export const isLicenseExpiring = (expiryDate, daysBeforeExpiry = 30) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= daysBeforeExpiry && daysUntilExpiry > 0;
};

// License status helpers
export const getLicenseStatusDisplay = (status) => {
    const statusMap = {
        pending: {
            label: 'Pending Review',
            color: 'warning',
            description: 'Your license is being reviewed by our verification team'
        },
        verified: {
            label: 'Verified',
            color: 'success',
            description: 'Your license has been verified successfully'
        },
        rejected: {
            label: 'Rejected',
            color: 'error',
            description: 'Your license verification was rejected'
        },
        expired: {
            label: 'Expired',
            color: 'warning',
            description: 'Your license has expired and needs renewal'
        }
    };

    return statusMap[status] || statusMap.pending;
};

// Format license number for display
export const formatLicenseNumber = (licenseNumber) => {
    if (!licenseNumber) return '';

    // Clean the license number
    const cleaned = licenseNumber.replace(/\s/g, '').toUpperCase();

    // Add spaces for better readability (every 3-4 characters)
    if (cleaned.length <= 8) {
        return cleaned;
    } else {
        // Format as groups of 3-4 characters
        return cleaned.replace(/(.{3,4})/g, '$1 ').trim();
    }
};

export default {
    validateLicenseNumber,
    validatePersonalInfo,
    validateLicenseDates,
    validateLicenseImage,
    validateIssuingAuthority,
    validateLicenseForm,
    calculateAge,
    isLicenseExpiring,
    getLicenseStatusDisplay,
    formatLicenseNumber
};