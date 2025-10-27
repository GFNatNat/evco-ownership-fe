import axiosClient from './axiosClient';

const profileApi = {
    // Exactly as per 03-PROFILE-API.md documentation

    // 1. GET /api/profile - Retrieve current user profile
    getProfile: () => axiosClient.get('/api/Profile'),

    // 2. GET /api/profile/{userId} - Retrieve specific user profile (Admin only)
    getProfileByUserId: (userId) => axiosClient.get(`/api/Profile/${userId}`),

    // 3. PUT /api/profile - Update current user profile
    updateProfile: (data) => axiosClient.put('/api/Profile', {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        address: data.address
    }),

    // 4. PUT /api/profile/change-password - Change password
    changePassword: (data) => axiosClient.put('/api/Profile/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
    }),

    // 5. POST /api/profile/picture - Upload profile picture  
    uploadProfilePicture: (formData) => axiosClient.post('/api/Profile/picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // 6. POST /api/profile/2fa/enable - Enable 2FA
    enable2FA: (data) => axiosClient.post('/api/Profile/2fa/enable', {
        password: data.password
    }),

    // 7. POST /api/profile/2fa/disable - Disable 2FA  
    disable2FA: (data) => axiosClient.post('/api/Profile/2fa/disable', {
        password: data.password
    }),

    // 8. PUT /api/profile/notifications - Update notification preferences
    updateNotificationPreferences: (data) => axiosClient.put('/api/Profile/notifications', data),

    // 9. GET /api/profile/statistics - Get profile statistics
    getProfileStatistics: () => axiosClient.get('/api/Profile/statistics'),

    // 10. DELETE /api/profile - Delete profile
    deleteProfile: () => axiosClient.delete('/api/Profile')
};

export default profileApi;
