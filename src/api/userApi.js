import axiosClient from './axiosClient';

const userApi = {
    // User management (Admin only)
    getAll: (params) => axiosClient.get('/api/User', { params }),
    getById: (id) => axiosClient.get(`/api/User/${id}`),
    create: (data) => axiosClient.post('/api/User', {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        status: data.status || 'Active'
    }),
    update: (id, data) => axiosClient.put(`/api/User/${id}`, data),
    delete: (id) => axiosClient.delete(`/api/User/${id}`),

    // User status management
    updateStatus: (id, status) => axiosClient.put(`/api/User/${id}/status`, {
        status: status
    }),

    activate: (id) => axiosClient.post(`/api/User/${id}/activate`),
    deactivate: (id) => axiosClient.post(`/api/User/${id}/deactivate`),

    // Role management (Admin only)
    updateRole: (id, role) => axiosClient.put(`/api/User/${id}/role`, {
        role: role
    }),

    // User statistics (Admin only)
    getStatistics: () => axiosClient.get('/api/User/statistics'),
    getUsersByRole: (role) => axiosClient.get(`/api/User/role/${role}`),

    // Search and filter
    search: (query) => axiosClient.get('/api/User/search', {
        params: { query }
    })
};

export default userApi;