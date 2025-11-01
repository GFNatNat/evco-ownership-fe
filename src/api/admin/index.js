import axiosClient from '../axiosClient';

const adminApi = {
  // Users Management  
  users: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      return axiosClient.get(`/admin/users?${queryParams}`);
    },
    getById: (id) => axiosClient.get(`/admin/users/${id}`),
    create: (userData) => axiosClient.post('/admin/user', userData), // Fixed: singular /admin/user
    update: (id, userData) => axiosClient.patch(`/admin/user/${id}`, userData), // Fixed: PATCH instead of PUT, singular endpoint
    delete: (id) => axiosClient.delete(`/admin/users/${id}`),
    activate: (id) => axiosClient.patch(`/admin/users/${id}/activate`),
    deactivate: (id) => axiosClient.patch(`/admin/users/${id}/deactivate`),
    suspend: (id, reason) => axiosClient.patch(`/admin/users/${id}/suspend`, { reason }),
    unsuspend: (id) => axiosClient.patch(`/admin/users/${id}/unsuspend`),
    searchUsers: (query) => axiosClient.get(`/admin/users/search?q=${query}`),
    getUserStats: () => axiosClient.get('/admin/users/stats')
  },

  // License Management
  licenses: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString()); // Fixed: pageIndex consistency
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString()); // Fixed: pageSize consistency
      return axiosClient.get(`/admin/licenses?${queryParams}`);
    },
    getById: (id) => axiosClient.get(`/admin/licenses/${id}`),
    approve: (licenseId, notes) => axiosClient.patch('/admin/license/approve', { licenseId, notes }), // Fixed: match documentation structure
    reject: (licenseId, rejectReason) => axiosClient.patch('/admin/license/reject', { licenseId, rejectReason }), // Fixed: match documentation structure
    getPending: () => axiosClient.get('/admin/licenses?status=pending'),
    getExpiring: (days = 30) => axiosClient.get(`/admin/licenses/expiring?days=${days}`),
    getLicenseStats: () => axiosClient.get('/admin/licenses/stats'),
    bulkApprove: (licenseIds, notes) => axiosClient.post('/admin/licenses/bulk-approve', { licenseIds, notes }),
    bulkReject: (licenseIds, reason) => axiosClient.post('/admin/licenses/bulk-reject', { licenseIds, reason })
  },

  // Groups Management
  groups: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString()); // Fixed: pageIndex consistency
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString()); // Fixed: pageSize consistency
      if (params.search) queryParams.append('search', params.search);
      return axiosClient.get(`/admin/groups?${queryParams}`);
    },
    getById: (id) => axiosClient.get(`/admin/groups/${id}`),
    getOverview: () => axiosClient.get('/admin/groups/overview'), // Added from documentation
    create: (groupData) => axiosClient.post('/admin/group', groupData), // Added from documentation
    updateStatus: (updateData) => axiosClient.put('/admin/group/status', updateData), // Added from documentation
    getAnalytics: () => axiosClient.get('/admin/groups/analytics'),
    dissolve: (id, reason) => axiosClient.patch(`/admin/groups/${id}/dissolve`, { reason }),
    getDisputes: (groupId) => axiosClient.get(`/admin/groups/${groupId}/disputes`),
    getGroupStats: () => axiosClient.get('/admin/groups/stats'),
    getGroupMembers: (groupId) => axiosClient.get(`/admin/groups/${groupId}/members`),
    getGroupVehicles: (groupId) => axiosClient.get(`/admin/groups/${groupId}/vehicles`),
    getGroupFinancials: (groupId) => axiosClient.get(`/admin/groups/${groupId}/financials`)
  },

  // Reports & Analytics
  reports: {
    getSystemReports: () => axiosClient.get('/admin/reports'), // Added from documentation
    getDashboardStats: () => axiosClient.get('/admin/reports/dashboard'),
    getFinancialReport: (period) => axiosClient.get(`/admin/reports/financial?period=${period}`),
    getUserActivity: (period) => axiosClient.get(`/admin/reports/users/activity?period=${period}`),
    getVehicleUtilization: () => axiosClient.get('/admin/reports/vehicles/utilization'),
    getRevenueAnalytics: () => axiosClient.get('/admin/reports/revenue'),
    exportReport: (type, period) => axiosClient.get(`/admin/reports/export/${type}?period=${period}`, {
      responseType: 'blob'
    })
  },

  // System Settings
  settings: {
    get: () => axiosClient.get('/admin/settings'),
    update: (settings) => axiosClient.put('/admin/settings', settings),
    getSystemHealth: () => axiosClient.get('/admin/settings/health')
  },

  // Audit Logs
  auditLogs: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString()); // Fixed: pageIndex instead of page
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString()); // Fixed: pageSize instead of limit
      if (params.action) queryParams.append('action', params.action);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      return axiosClient.get(`/admin/audit-logs?${queryParams}`);
    }
  },

  // Notifications Management
  notifications: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString()); // Fixed: pageIndex instead of page
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString()); // Fixed: pageSize instead of limit
      if (params.notificationType) queryParams.append('notificationType', params.notificationType); // Added from documentation
      return axiosClient.get(`/admin/notifications?${queryParams}`);
    },
    sendToUser: (notificationData) => axiosClient.post('/admin/notifications/send-to-user', notificationData),
    create: (notificationData) => axiosClient.post('/admin/notifications/create-notification', notificationData)
  },

  // Helper methods for backward compatibility
  getNotifications: (params = {}) => adminApi.notifications.getAll(params),
  sendNotificationToUser: (data) => adminApi.notifications.sendToUser(data),
  createNotification: (data) => adminApi.notifications.create(data),
  getAuditLogs: (params = {}) => adminApi.auditLogs.getAll(params)
};

export default adminApi;