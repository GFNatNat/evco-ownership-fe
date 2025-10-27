import axiosClient from './axiosClient';

const licenseApi = {
    // Core License API endpoints as per 04-LICENSE-API.md

    // 1. GET /api/license - Retrieve user's licenses with filter support
    getAll: (params) => axiosClient.get('/api/License', { params }),

    // 2. GET /api/license/{licenseId} - Get specific license details
    getById: (licenseId) => axiosClient.get(`/api/License/${licenseId}`),


    // 3. POST /api/License/verify - Verify a driving license (multipart/form-data)
    verify: (formData) => axiosClient.post('/api/License/verify', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // 4. POST /api/License/register - Register a verified license
    register: (data) => axiosClient.post('/api/License/register', data),

    // 4. PUT /api/license/{licenseId}/verify - Verify license (Admin only)
    verify: (licenseId, data) => axiosClient.put(`/api/License/${licenseId}/verify`, {
        status: data.status,
        notes: data.notes
    }),

    // 5. DELETE /api/license/{licenseId} - Delete license
    delete: (licenseId) => axiosClient.delete(`/api/License/${licenseId}`),

    // Additional helper methods (for existing frontend compatibility)
    // These may not be in current backend spec but needed for admin features

    // License validation and checks
    checkValidity: (licenseNumber) => axiosClient.get(`/api/License/check/${licenseNumber}`),

    // License statistics (Admin/Staff only) - for admin dashboard
    getStatistics: () => axiosClient.get('/api/License/statistics'),

    // Get expiring licenses for admin monitoring
    getExpiringLicenses: (days = 30) => axiosClient.get('/api/License/expiring', {
        params: { days }
    })
};

export default licenseApi;