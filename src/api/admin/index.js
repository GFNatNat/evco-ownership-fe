// Admin-specific API endpoints
import axiosClient from '../axiosClient';

const adminApi = {
  // Users Management
  users: {
    getAll: () => axiosClient.get('/api/User'),
    getById: (id) => axiosClient.get(`/api/User/${id}`),
    create: (userData) => axiosClient.post('/api/User', userData),
    update: (id, userData) => axiosClient.put(`/api/User/${id}`, userData),
    delete: (id) => axiosClient.delete(`/api/User/${id}`),
    activate: (id) => axiosClient.patch(`/api/User/${id}/activate`),
    deactivate: (id) => axiosClient.patch(`/api/User/${id}/deactivate`),
    searchUsers: (query) => axiosClient.get(`/api/User/search?q=${query}`)
  },

  // License Management
  licenses: {
    getAll: () => axiosClient.get('/api/License'),
    getById: (id) => axiosClient.get(`/api/License/${id}`),
    approve: (id) => axiosClient.patch(`/api/License/${id}/approve`),
    reject: (id, reason) => axiosClient.patch(`/api/License/${id}/reject`, { reason }),
    getPending: () => axiosClient.get('/api/License/pending'),
    getExpiring: () => axiosClient.get('/api/License/expiring')
  },

  // Groups Management
  groups: {
    getAll: () => axiosClient.get('/api/Group'),
    getById: (id) => axiosClient.get(`/api/Group/${id}`),
    getAnalytics: () => axiosClient.get('/api/Group/analytics'),
    dissolve: (id, reason) => axiosClient.patch(`/api/Group/${id}/dissolve`, { reason }),
    getDisputes: (groupId) => axiosClient.get(`/api/Group/${groupId}/disputes`)
  },

  // Reports & Analytics
  reports: {
    getDashboardStats: () => axiosClient.get('/api/Report/dashboard'),
    getFinancialReport: (period) => axiosClient.get(`/api/Report/financial?period=${period}`),
    getUserActivity: (period) => axiosClient.get(`/api/Report/users/activity?period=${period}`),
    getVehicleUtilization: () => axiosClient.get('/api/Report/vehicles/utilization'),
    getRevenueAnalytics: () => axiosClient.get('/api/Report/revenue'),
    exportReport: (type, period) => axiosClient.get(`/api/Report/export/${type}?period=${period}`, {
      responseType: 'blob'
    })
  },

  // System Settings
  settings: {
    get: () => axiosClient.get('/api/Settings'),
    update: (settings) => axiosClient.put('/api/Settings', settings),
    getSystemHealth: () => axiosClient.get('/api/Settings/health'),
    getAuditLogs: (page = 1, limit = 20) => axiosClient.get(`/api/Settings/audit-logs?page=${page}&limit=${limit}`)
  },

  // Platform Analytics
  analytics: {
    getOverview: () => axiosClient.get('/api/Analytics/overview'),
    getUserGrowth: (period) => axiosClient.get(`/api/Analytics/users/growth?period=${period}`),
    getVehicleStats: () => axiosClient.get('/api/Analytics/vehicles'),
    getRevenueMetrics: () => axiosClient.get('/api/Analytics/revenue'),
    getPerformanceMetrics: () => axiosClient.get('/api/Analytics/performance')
  }
};

export default adminApi;