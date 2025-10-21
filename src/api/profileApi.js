import axiosClient from './axiosClient';

const profileApi = {
    // Get user profile
    getProfile: () => axiosClient.get('/api/Profile'),

    // Update user profile
    updateProfile: (data) => axiosClient.put('/api/Profile', {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        emergencyContact: data.emergencyContact,
        bio: data.bio
    }),

    // Profile picture management
    uploadProfilePicture: (formData) => axiosClient.post('/api/Profile/picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    deleteProfilePicture: () => axiosClient.delete('/api/Profile/picture'),

    // Password management
    changePassword: (data) => axiosClient.post('/api/Profile/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
    }),

    // Email management
    updateEmail: (data) => axiosClient.put('/api/Profile/email', {
        newEmail: data.newEmail,
        password: data.password
    }),

    verifyEmail: (token) => axiosClient.post('/api/Profile/verify-email', {
        token
    }),

    resendEmailVerification: () => axiosClient.post('/api/Profile/resend-email-verification'),

    // Phone number management
    updatePhoneNumber: (data) => axiosClient.put('/api/Profile/phone', {
        newPhoneNumber: data.newPhoneNumber,
        password: data.password
    }),

    verifyPhoneNumber: (data) => axiosClient.post('/api/Profile/verify-phone', {
        phoneNumber: data.phoneNumber,
        verificationCode: data.verificationCode
    }),

    sendPhoneVerificationCode: (phoneNumber) => axiosClient.post('/api/Profile/send-phone-code', {
        phoneNumber
    }),

    // Account settings
    getAccountSettings: () => axiosClient.get('/api/Profile/settings'),
    updateAccountSettings: (data) => axiosClient.put('/api/Profile/settings', data),

    // Privacy settings
    getPrivacySettings: () => axiosClient.get('/api/Profile/privacy'),
    updatePrivacySettings: (data) => axiosClient.put('/api/Profile/privacy', data),

    // Notification preferences
    getNotificationPreferences: () => axiosClient.get('/api/Profile/notification-preferences'),
    updateNotificationPreferences: (data) => axiosClient.put('/api/Profile/notification-preferences', data),

    // Two-factor authentication
    enable2FA: (password) => axiosClient.post('/api/Profile/enable-2fa', { password }),
    disable2FA: (password) => axiosClient.post('/api/Profile/disable-2fa', { password }),
    verify2FA: (code) => axiosClient.post('/api/Profile/verify-2fa', { code }),

    // Security
    getSecuritySettings: () => axiosClient.get('/api/Profile/security'),
    getLoginHistory: () => axiosClient.get('/api/Profile/login-history'),
    revokeAllSessions: () => axiosClient.post('/api/Profile/revoke-sessions'),

    // Account deactivation
    deactivateAccount: (data) => axiosClient.post('/api/Profile/deactivate', {
        password: data.password,
        reason: data.reason,
        feedback: data.feedback
    }),

    // Export data (GDPR compliance)
    requestDataExport: () => axiosClient.post('/api/Profile/export-data'),
    getDataExportStatus: (requestId) => axiosClient.get(`/api/Profile/export-status/${requestId}`),
    downloadDataExport: (requestId) => axiosClient.get(`/api/Profile/download-export/${requestId}`, {
        responseType: 'blob'
    }),

    // Delete account
    deleteAccount: (data) => axiosClient.delete('/api/Profile', {
        data: {
            password: data.password,
            reason: data.reason,
            confirmDeletion: data.confirmDeletion
        }
    })
};

export default profileApi;
