// Admin-specific API endpoints
import axiosClient from '../axiosClient';

const adminApi = {
  // Users Management
  users: {
    getAll: () => axiosClient.get('/api/admin/users'),
    getById: (id) => axiosClient.get(`/api/admin/users/${id}`),
    create: (userData) => axiosClient.post('/api/admin/users', userData),
    update: (id, userData) => axiosClient.put(`/api/admin/users/${id}`, userData),
    delete: (id) => axiosClient.delete(`/api/admin/users/${id}`),
    activate: (id) => axiosClient.patch(`/api/admin/users/${id}/activate`),
    deactivate: (id) => axiosClient.patch(`/api/admin/users/${id}/deactivate`),
    searchUsers: (query) => axiosClient.get(`/api/admin/users/search?q=${query}`)
  },

  // License Management
  licenses: {
    getAll: () => axiosClient.get('/api/admin/licenses'),
    getById: (id) => axiosClient.get(`/api/admin/licenses/${id}`),
    approve: (id) => axiosClient.patch(`/api/admin/licenses/${id}/approve`),
    reject: (id, reason) => axiosClient.patch(`/api/admin/licenses/${id}/reject`, { reason }),
    getPending: () => axiosClient.get('/api/admin/licenses/pending'),
    getExpiring: () => axiosClient.get('/api/admin/licenses/expiring')
  },

  // Groups Management
  groups: {
    getAll: () => axiosClient.get('/api/admin/groups'),
    getById: (id) => axiosClient.get(`/api/admin/groups/${id}`),
    getAnalytics: () => axiosClient.get('/api/admin/groups/analytics'),
    dissolve: (id, reason) => axiosClient.patch(`/api/admin/groups/${id}/dissolve`, { reason }),
    getDisputes: (groupId) => axiosClient.get(`/api/admin/groups/${groupId}/disputes`)
  },

  // Reports & Analytics
  reports: {
    getDashboardStats: () => axiosClient.get('/api/admin/reports/dashboard'),
    getFinancialReport: (period) => axiosClient.get(`/api/admin/reports/financial?period=${period}`),
    getUserActivity: (period) => axiosClient.get(`/api/admin/reports/users/activity?period=${period}`),
    getVehicleUtilization: () => axiosClient.get('/api/admin/reports/vehicles/utilization'),
    getRevenueAnalytics: () => axiosClient.get('/api/admin/reports/revenue'),
    exportReport: (type, period) => axiosClient.get(`/api/admin/reports/export/${type}?period=${period}`, {
      responseType: 'blob'
    })
  },

  // System Settings
  settings: {
    get: () => axiosClient.get('/api/admin/settings'),
    update: (settings) => axiosClient.put('/api/admin/settings', settings),
    getSystemHealth: () => axiosClient.get('/api/admin/settings/health'),
    getAuditLogs: (page = 1, limit = 20) => axiosClient.get(`/api/admin/settings/audit-logs?page=${page}&limit=${limit}`)
  },

  // Platform Analytics
  analytics: {
    getOverview: () => axiosClient.get('/api/admin/analytics/overview'),
    getUserGrowth: (period) => axiosClient.get(`/api/admin/analytics/users/growth?period=${period}`),
    getVehicleStats: () => axiosClient.get('/api/admin/analytics/vehicles'),
    getRevenueMetrics: () => axiosClient.get('/api/admin/analytics/revenue'),
    getPerformanceMetrics: () => axiosClient.get('/api/admin/analytics/performance')
  }
};

export default adminApi;