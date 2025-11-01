/**
 * License Error Handler Utilities
 * Comprehensive error handling for license verification
 * Following README_FRONTEND_LICENSE.md specifications
 */

// License API error codes mapping
const LICENSE_ERROR_CODES = {
    // Validation errors
    'LICENSE_NUMBER_REQUIRED': 'License number is required',
    'LICENSE_NUMBER_INVALID_FORMAT': 'Invalid license number format',
    'LICENSE_NUMBER_TOO_SHORT': 'License number is too short',
    'LICENSE_NUMBER_TOO_LONG': 'License number is too long',
    'LICENSE_ALREADY_REGISTERED': 'This license number is already registered in our system',
    'LICENSE_ALREADY_EXISTS': 'This license is already registered',

    // Personal information errors
    'FIRST_NAME_REQUIRED': 'First name is required',
    'LAST_NAME_REQUIRED': 'Last name is required',
    'FIRST_NAME_INVALID': 'First name contains invalid characters',
    'LAST_NAME_INVALID': 'Last name contains invalid characters',
    'NAME_TOO_SHORT': 'Name must be at least 2 characters long',
    'NAME_TOO_LONG': 'Name cannot exceed 50 characters',

    // Date validation errors
    'DATE_OF_BIRTH_REQUIRED': 'Date of birth is required',
    'DATE_OF_BIRTH_INVALID': 'Please enter a valid date of birth',
    'MUST_BE_AT_LEAST_18_YEARS_OLD': 'You must be at least 18 years old to apply',
    'AGE_TOO_OLD': 'Please verify your date of birth',
    'BIRTH_DATE_IN_FUTURE': 'Date of birth cannot be in the future',

    'ISSUE_DATE_REQUIRED': 'License issue date is required',
    'ISSUE_DATE_INVALID': 'Please enter a valid issue date',
    'ISSUE_DATE_CANNOT_BE_FUTURE': 'Issue date cannot be in the future',
    'ISSUE_DATE_TOO_OLD': 'Issue date seems too old, please verify',

    'EXPIRY_DATE_INVALID': 'Please enter a valid expiry date',
    'EXPIRY_DATE_BEFORE_ISSUE': 'Expiry date must be after issue date',
    'LICENSE_ALREADY_EXPIRED': 'This license has already expired',
    'VALIDITY_PERIOD_TOO_LONG': 'License validity period seems too long',

    // Authority validation errors
    'ISSUED_BY_REQUIRED': 'Issuing authority is required',
    'INVALID_ISSUING_AUTHORITY': 'Please select a valid issuing authority',

    // Image validation errors
    'INVALID_IMAGE_FILE': 'Please upload a valid image file',
    'IMAGE_REQUIRED': 'License image is required',
    'IMAGE_SIZE_TOO_LARGE': 'Image size must be less than 5MB',
    'IMAGE_SIZE_TOO_SMALL': 'Image file seems too small',
    'INVALID_IMAGE_FORMAT': 'Please upload a JPG, PNG, or WebP image',
    'IMAGE_UPLOAD_FAILED': 'Failed to upload image, please try again',

    // Server errors
    'VERIFICATION_FAILED': 'License verification failed',
    'SUBMISSION_FAILED': 'Failed to submit license for verification',
    'DATABASE_ERROR': 'Database error occurred, please try again',
    'PROCESSING_ERROR': 'Error processing your request',

    // Authentication errors
    'UNAUTHORIZED': 'You must be logged in to verify a license',
    'FORBIDDEN': 'You do not have permission to perform this action',
    'SESSION_EXPIRED': 'Your session has expired, please log in again',

    // Network errors
    'NETWORK_ERROR': 'Network error, please check your connection',
    'TIMEOUT_ERROR': 'Request timed out, please try again',
    'SERVER_UNAVAILABLE': 'Server is temporarily unavailable',

    // Verification process errors
    'VERIFICATION_NOT_FOUND': 'Verification record not found',
    'VERIFICATION_ALREADY_COMPLETED': 'This verification has already been completed',
    'VERIFICATION_EXPIRED': 'This verification request has expired',
    'DUPLICATE_SUBMISSION': 'You have already submitted this license for verification',

    // Admin/Staff errors
    'ADMIN_ACTION_REQUIRED': 'This action requires administrator approval',
    'STAFF_NOT_AUTHORIZED': 'Staff member not authorized for this action',
    'VERIFICATION_QUEUE_FULL': 'Verification queue is full, please try again later'
};

// HTTP status code to user-friendly message mapping
const HTTP_STATUS_MESSAGES = {
    400: 'Invalid request data provided',
    401: 'Authentication required - please log in',
    403: 'You do not have permission for this action',
    404: 'Requested resource not found',
    409: 'Conflict - resource already exists',
    413: 'File too large - please choose a smaller image',
    415: 'Unsupported file format - please upload JPG, PNG, or WebP',
    422: 'Validation failed - please check your input',
    429: 'Too many requests - please wait before trying again',
    500: 'Server error - please try again later',
    502: 'Service temporarily unavailable',
    503: 'Service maintenance in progress',
    504: 'Request timed out - please try again'
};

/**
 * Handle license API errors and return user-friendly messages
 * @param {Error} error - The error object from API call
 * @returns {string} User-friendly error message
 */
export const handleLicenseError = (error) => {
    // Handle network errors
    if (!error.response) {
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
            return 'Network connection error. Please check your internet connection and try again.';
        }
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }
        return 'Unable to connect to the server. Please try again later.';
    }

    const { status, data } = error.response;

    // Get specific error message from response
    if (data && data.message) {
        // Check if it's a known error code
        if (LICENSE_ERROR_CODES[data.message]) {
            return LICENSE_ERROR_CODES[data.message];
        }

        // Return the raw message if it's user-friendly
        if (typeof data.message === 'string' && data.message.length < 200) {
            return data.message;
        }
    }

    // Get error code from response
    if (data && data.code && LICENSE_ERROR_CODES[data.code]) {
        return LICENSE_ERROR_CODES[data.code];
    }

    // Get validation errors array
    if (data && data.errors && Array.isArray(data.errors)) {
        return data.errors.map(err =>
            LICENSE_ERROR_CODES[err] || err
        ).join('. ');
    }

    // Fallback to HTTP status message
    if (HTTP_STATUS_MESSAGES[status]) {
        return HTTP_STATUS_MESSAGES[status];
    }

    // Default error message
    return 'An unexpected error occurred during license verification. Please try again.';
};

/**
 * Get specific validation error message
 * @param {string} field - The field name that has error
 * @param {string} errorCode - The error code
 * @returns {string} Field-specific error message
 */
export const getValidationError = (field, errorCode) => {
    const fieldSpecificErrors = {
        licenseNumber: {
            'REQUIRED': 'License number is required',
            'TOO_SHORT': 'License number must be at least 8 characters',
            'TOO_LONG': 'License number cannot exceed 15 characters',
            'INVALID_FORMAT': 'License number can only contain letters and numbers',
            'ALREADY_EXISTS': 'This license number is already registered'
        },
        firstName: {
            'REQUIRED': 'First name is required',
            'TOO_SHORT': 'First name must be at least 2 characters',
            'TOO_LONG': 'First name cannot exceed 50 characters',
            'INVALID_FORMAT': 'First name can only contain letters and spaces'
        },
        lastName: {
            'REQUIRED': 'Last name is required',
            'TOO_SHORT': 'Last name must be at least 2 characters',
            'TOO_LONG': 'Last name cannot exceed 50 characters',
            'INVALID_FORMAT': 'Last name can only contain letters and spaces'
        },
        dateOfBirth: {
            'REQUIRED': 'Date of birth is required',
            'INVALID': 'Please enter a valid date',
            'TOO_YOUNG': 'You must be at least 18 years old',
            'TOO_OLD': 'Please check your date of birth',
            'FUTURE_DATE': 'Date of birth cannot be in the future'
        },
        issueDate: {
            'REQUIRED': 'Issue date is required',
            'INVALID': 'Please enter a valid issue date',
            'FUTURE_DATE': 'Issue date cannot be in the future',
            'TOO_OLD': 'Issue date seems too old'
        },
        expiryDate: {
            'INVALID': 'Please enter a valid expiry date',
            'BEFORE_ISSUE': 'Expiry date must be after issue date',
            'ALREADY_EXPIRED': 'This license has already expired',
            'TOO_LONG': 'License validity period seems too long'
        },
        issuedBy: {
            'REQUIRED': 'Issuing authority is required',
            'INVALID': 'Please select a valid issuing authority'
        },
        licenseImage: {
            'REQUIRED': 'License image is required',
            'INVALID_FORMAT': 'Please upload a valid image file (JPG, PNG, WebP)',
            'TOO_LARGE': 'Image size must be less than 5MB',
            'TOO_SMALL': 'Image file seems too small',
            'UPLOAD_FAILED': 'Failed to upload image, please try again'
        }
    };

    return fieldSpecificErrors[field]?.[errorCode] ||
        LICENSE_ERROR_CODES[errorCode] ||
        `Invalid ${field}`;
};

/**
 * Parse server validation errors into field-specific error object
 * @param {Object} errorResponse - Server error response
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const parseValidationErrors = (errorResponse) => {
    const fieldErrors = {};

    if (!errorResponse || !errorResponse.data) {
        return fieldErrors;
    }

    const { data } = errorResponse;

    // Handle validation errors object
    if (data.validationErrors && typeof data.validationErrors === 'object') {
        Object.keys(data.validationErrors).forEach(field => {
            const errorCode = data.validationErrors[field];
            fieldErrors[field] = getValidationError(field, errorCode);
        });
    }

    // Handle errors array with field information
    if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach(error => {
            if (error.field && error.code) {
                fieldErrors[error.field] = getValidationError(error.field, error.code);
            }
        });
    }

    return fieldErrors;
};

/**
 * Check if error is recoverable (user can retry)
 * @param {Error} error - The error object
 * @returns {boolean} True if user should retry
 */
export const isRecoverableError = (error) => {
    if (!error.response) {
        // Network errors are usually recoverable
        return true;
    }

    const { status } = error.response;

    // Recoverable status codes
    const recoverableStatuses = [408, 429, 500, 502, 503, 504];
    return recoverableStatuses.includes(status);
};

/**
 * Get retry suggestion based on error type
 * @param {Error} error - The error object
 * @returns {string} Suggestion for user action
 */
export const getRetrySuggestion = (error) => {
    if (!error.response) {
        return 'Please check your internet connection and try again.';
    }

    const { status } = error.response;

    switch (status) {
        case 400:
        case 422:
            return 'Please check your input and correct any errors.';
        case 401:
            return 'Please log in again and retry.';
        case 403:
            return 'You may not have permission for this action. Contact support if needed.';
        case 409:
            return 'This license may already be registered. Check your existing licenses.';
        case 413:
            return 'Please choose a smaller image file and try again.';
        case 415:
            return 'Please upload a JPG, PNG, or WebP image file.';
        case 429:
            return 'Please wait a few minutes before trying again.';
        case 500:
        case 502:
        case 503:
        case 504:
            return 'Server is experiencing issues. Please try again in a few minutes.';
        default:
            return 'Please try again. If the problem persists, contact support.';
    }
};

/**
 * Create user notification based on error type
 * @param {Error} error - The error object
 * @returns {Object} Notification object with type and message
 */
export const createErrorNotification = (error) => {
    const message = handleLicenseError(error);
    const isRecoverable = isRecoverableError(error);
    const suggestion = getRetrySuggestion(error);

    return {
        type: isRecoverable ? 'warning' : 'error',
        title: isRecoverable ? 'Temporary Issue' : 'Error',
        message,
        suggestion,
        canRetry: isRecoverable,
        duration: isRecoverable ? 6000 : 8000
    };
};

export default {
    handleLicenseError,
    getValidationError,
    parseValidationErrors,
    isRecoverableError,
    getRetrySuggestion,
    createErrorNotification,
    LICENSE_ERROR_CODES,
    HTTP_STATUS_MESSAGES
};