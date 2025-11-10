/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';

export const adminApi = {
  users: {
    getAll: (params?: any) => axiosClient.get('admin/users', { params }),
    getById: (id: string) => axiosClient.get(`admin/users/${id}`),
    create: (payload: any) => axiosClient.post('admin/users', payload),
    update: (id: string, payload: any) => axiosClient.put(`admin/users/${id}`, payload),
    delete: (id: string) => axiosClient.delete(`admin/users/${id}`),
    activate: (id: string) => axiosClient.patch(`admin/users/${id}/activate`),
    deactivate: (id: string) => axiosClient.patch(`admin/users/${id}/deactivate`),
    search: (q: string) => axiosClient.get('admin/users/search', { params: { q } }),
  },
  licenses: {
    getAll: (params?: any) => axiosClient.get('admin/licenses', { params }),
    getById: (id: string) => axiosClient.get(`admin/licenses/${id}`),
    approve: (id: string) => axiosClient.patch(`admin/licenses/${id}/approve`),
    reject: (id: string, reason: string) => axiosClient.patch(`admin/licenses/${id}/reject`, { reason }),
    getPending: () => axiosClient.get('admin/licenses/pending'),
    getExpiring: () => axiosClient.get('admin/licenses/expiring'),
  },
  groups: {
    getAll: (params?: any) => axiosClient.get('admin/groups', { params }),
    getById: (id: string) => axiosClient.get(`admin/groups/${id}`),
    getAnalytics: (params?: any) => axiosClient.get('admin/groups/analytics', { params }),
    dissolve: (id: string, reason: string) => axiosClient.patch(`admin/groups/${id}/dissolve`, { reason }),
    getDisputes: (groupId: string) => axiosClient.get(`admin/groups/${groupId}/disputes`),
  },
  reports: {
    getDashboard: () => axiosClient.get('admin/reports/dashboard'),
    getFinancial: (period: string) => axiosClient.get('admin/reports/financial', { params: { period } }),
    getUserActivity: (period: string) => axiosClient.get('admin/reports/users/activity', { params: { period } }),
    getVehicleUtilization: () => axiosClient.get('admin/reports/vehicles/utilization'),
    getRevenue: () => axiosClient.get('admin/reports/revenue'),
    export: (type: string, period: string) =>
      axiosClient.get(`admin/reports/export/${type}`, { params: { period }, responseType: 'blob' }),
  },
  settings: {
    get: () => axiosClient.get('admin/settings'),
    update: (payload: any) => axiosClient.put('admin/settings', payload),
    health: () => axiosClient.get('admin/settings/health'),
    auditLogs: (page = 1, limit = 20) => axiosClient.get('admin/settings/audit-logs', { params: { page, limit } }),
  },
  analytics: {
    overview: () => axiosClient.get('admin/analytics/overview'),
    userGrowth: (period: string) => axiosClient.get('admin/analytics/users/growth', { params: { period } }),
    vehicles: () => axiosClient.get('admin/analytics/vehicles'),
    revenue: () => axiosClient.get('admin/analytics/revenue'),
    performance: () => axiosClient.get('admin/analytics/performance'),
  },
};
