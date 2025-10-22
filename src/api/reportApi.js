import axiosClient from './axiosClient';
const p = '/api/Report';
const reportApi = {
  financial: (params) => axiosClient.get(`${p}/financial`, { params }),

  // Admin dashboard stats
  getDashboardStats: () => axiosClient.get(`${p}/admin/dashboard-stats`),
  getUserStats: () => axiosClient.get(`${p}/admin/user-stats`),
  getVehicleStats: () => axiosClient.get(`${p}/admin/vehicle-stats`),
  getRevenueStats: (params) => axiosClient.get(`${p}/admin/revenue-stats`, { params }),
  getActivityLog: (params) => axiosClient.get(`${p}/admin/activity-log`, { params }),
  getUsageStatistics: () => axiosClient.get(`${p}/admin/usage-statistics`),
};
export default reportApi;