import axiosClient from './axiosClient';

const licenseApi = {
    // License verification
    verify: (data) => axiosClient.post('/api/License/verify', {
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        issuingAuthority: data.issuingAuthority
    }),

    // License CRUD operations
    create: (data) => axiosClient.post('/api/License', data),
    getAll: (params) => axiosClient.get('/api/License', { params }),
    getById: (id) => axiosClient.get(`/api/License/${id}`),
    update: (id, data) => axiosClient.put(`/api/License/${id}`, data),
    delete: (id) => axiosClient.delete(`/api/License/${id}`),

    // User license management
    getUserLicenses: () => axiosClient.get('/api/License/user'),
    addUserLicense: (data) => axiosClient.post('/api/License/user', data),
    updateUserLicense: (id, data) => axiosClient.put(`/api/License/user/${id}`, data),
    deleteUserLicense: (id) => axiosClient.delete(`/api/License/user/${id}`),

    // License status management
    activate: (id) => axiosClient.post(`/api/License/${id}/activate`),
    deactivate: (id) => axiosClient.post(`/api/License/${id}/deactivate`),
    suspend: (id, reason) => axiosClient.post(`/api/License/${id}/suspend`, { reason }),

    // License validation and checks
    checkValidity: (licenseNumber) => axiosClient.get(`/api/License/check/${licenseNumber}`),
    validateForVehicleType: (licenseId, vehicleType) => axiosClient.post(`/api/License/${licenseId}/validate-vehicle`, {
        vehicleType
    }),

    // License types and categories
    getLicenseTypes: () => axiosClient.get('/api/License/types'),
    getLicenseCategories: () => axiosClient.get('/api/License/categories'),

    // License renewal
    requestRenewal: (id, data) => axiosClient.post(`/api/License/${id}/renewal`, data),
    processRenewal: (renewalId, approved) => axiosClient.post(`/api/License/renewal/${renewalId}/process`, {
        approved
    }),

    // License statistics (Admin/Staff only)
    getStatistics: () => axiosClient.get('/api/License/statistics'),
    getExpiringLicenses: (days = 30) => axiosClient.get('/api/License/expiring', {
        params: { days }
    }),

    // License verification history
    getVerificationHistory: (licenseId) => axiosClient.get(`/api/License/${licenseId}/verification-history`),

    // Bulk operations (Admin only)
    bulkVerify: (licenseIds) => axiosClient.post('/api/License/bulk-verify', {
        licenseIds
    }),

    exportLicenses: (format = 'excel') => axiosClient.get('/api/License/export', {
        params: { format },
        responseType: 'blob'
    })
};

export default licenseApi;