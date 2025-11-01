import axiosClient from '../axiosClient';

const staffApi = {
  // Group Management
  groups: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.search) queryParams.append('search', params.search);
      return axiosClient.get(`/staff/groups?${queryParams}`);
    },
    getById: (id) => axiosClient.get(`/staff/groups/${id}`),
    getGroupMembers: (groupId) => axiosClient.get(`/staff/groups/${groupId}/members`),
    getGroupVehicles: (groupId) => axiosClient.get(`/staff/groups/${groupId}/vehicles`),
    getGroupBookings: (groupId, status) => {
      const params = status ? `?status=${status}` : '';
      return axiosClient.get(`/staff/groups/${groupId}/bookings${params}`);
    }
  },

  // Contract Management
  contracts: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      return axiosClient.get(`/staff/contracts?${queryParams}`);
    },
    getById: (id) => axiosClient.get(`/staff/contracts/${id}`),
    create: (contractData) => axiosClient.post('/staff/contracts', contractData),
    update: (id, updates) => axiosClient.patch(`/staff/contracts/${id}`, updates),
    approve: (id, notes) => axiosClient.patch(`/staff/contracts/${id}/approve`, { notes }),
    reject: (id, reason) => axiosClient.patch(`/staff/contracts/${id}/reject`, { reason }),
    getTemplate: (type) => axiosClient.get(`/staff/contracts/template/${type}`),
    generateContract: (contractRequest) => axiosClient.post('/staff/contracts/generate', contractRequest)
  },

  // Check-in/Check-out Management
  checkInOut: {
    checkIn: (request) => axiosClient.post('/staff/check-in', request),
    checkOut: (request) => axiosClient.post('/staff/check-out', request),
    getPendingCheckIns: () => axiosClient.get('/staff/check-ins/pending'),
    getPendingCheckOuts: () => axiosClient.get('/staff/check-outs/pending'),
    getCheckInHistory: (vehicleId, page = 1) =>
      axiosClient.get(`/staff/check-ins/history?vehicleId=${vehicleId}&page=${page}`),
    approveCheckIn: (checkInId, notes) => axiosClient.patch(`/staff/check-ins/${checkInId}/approve`, { notes }),
    rejectCheckIn: (checkInId, reason) => axiosClient.patch(`/staff/check-ins/${checkInId}/reject`, { reason }),
    approveCheckOut: (checkOutId, notes) => axiosClient.patch(`/staff/check-outs/${checkOutId}/approve`, { notes }),
    rejectCheckOut: (checkOutId, reason) => axiosClient.patch(`/staff/check-outs/${checkOutId}/reject`, { reason })
  },

  // Maintenance Management
  maintenance: {
    getTasks: (status) => {
      const params = status ? `?status=${status}` : '';
      return axiosClient.get(`/staff/maintenance${params}`);
    },
    getTaskById: (taskId) => axiosClient.get(`/staff/maintenance/${taskId}`),
    createTask: (taskData) => axiosClient.post('/staff/maintenance', taskData),
    assignTask: (taskId, staffId) => axiosClient.patch(`/staff/maintenance/${taskId}/assign`, { staffId }),
    updateStatus: (taskId, status, notes) => axiosClient.patch(`/staff/maintenance/${taskId}/status`, { status, notes }),
    createReport: (report) => axiosClient.post('/staff/maintenance/report', report),
    getMaintenanceHistory: (vehicleId) => axiosClient.get(`/staff/maintenance/history/${vehicleId}`),
    scheduleMaintenace: (scheduleData) => axiosClient.post('/staff/maintenance/schedule', scheduleData)
  },

  // Dispute Management
  disputes: {
    getAll: (status) => {
      const params = status ? `?status=${status}` : '';
      return axiosClient.get(`/staff/disputes${params}`);
    },
    getById: (disputeId) => axiosClient.get(`/staff/disputes/${disputeId}`),
    assign: (disputeId, staffId) => axiosClient.patch(`/staff/disputes/${disputeId}/assign`, { staffId }),
    updateStatus: (disputeId, status, notes) => axiosClient.patch(`/staff/disputes/${disputeId}/status`, { status, notes }),
    resolve: (disputeId, resolution) => axiosClient.post(`/staff/disputes/${disputeId}/resolve`, resolution),
    escalate: (disputeId, reason) => axiosClient.post(`/staff/disputes/${disputeId}/escalate`, { reason }),
    addNote: (disputeId, note) => axiosClient.post(`/staff/disputes/${disputeId}/notes`, { note }),
    getDisputeHistory: (disputeId) => axiosClient.get(`/staff/disputes/${disputeId}/history`)
  },

  // Vehicle Management
  vehicles: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      return axiosClient.get(`/staff/vehicles?${queryParams}`);
    },
    getById: (vehicleId) => axiosClient.get(`/staff/vehicles/${vehicleId}`),
    verify: (vehicleId, verificationData) => axiosClient.post(`/staff/vehicles/${vehicleId}/verify`, verificationData),
    approve: (vehicleId, notes) => axiosClient.patch(`/staff/vehicles/${vehicleId}/approve`, { notes }),
    reject: (vehicleId, reason) => axiosClient.patch(`/staff/vehicles/${vehicleId}/reject`, { reason }),
    updateStatus: (vehicleId, status, notes) => axiosClient.patch(`/staff/vehicles/${vehicleId}/status`, { status, notes }),
    getInspectionHistory: (vehicleId) => axiosClient.get(`/staff/vehicles/${vehicleId}/inspections`)
  },

  // Profile Management
  profile: {
    get: () => axiosClient.get('/staff/profile'),
    update: (profileData) => axiosClient.put('/staff/profile', profileData),
    changePassword: (passwordData) => axiosClient.post('/staff/profile/change-password', passwordData),
    getWorkSchedule: () => axiosClient.get('/staff/profile/work-schedule'),
    updateWorkSchedule: (schedule) => axiosClient.put('/staff/profile/work-schedule', schedule),
    getPerformanceMetrics: () => axiosClient.get('/staff/profile/performance'),
    getAssignedTasks: () => axiosClient.get('/staff/profile/assigned-tasks')
  },

  // Dashboard
  dashboard: {
    getData: () => axiosClient.get('/staff/dashboard'),
    getWorkload: () => axiosClient.get('/staff/dashboard/workload'),
    getRecentActivity: () => axiosClient.get('/staff/dashboard/recent-activity'),
    getStats: () => axiosClient.get('/staff/dashboard/stats')
  }
};

export default staffApi;