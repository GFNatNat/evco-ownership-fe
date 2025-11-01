import axiosClient from '../axiosClient';

const coOwnerApi = {
  // Profile Management
  profile: {
    get: () => axiosClient.get('/coowner/profile'),
    update: (profileData) => axiosClient.put('/coowner/profile', profileData),
    uploadAvatar: (formData) => axiosClient.post('/coowner/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    changePassword: (passwordData) => axiosClient.post('/coowner/profile/change-password', passwordData),
    getNotificationSettings: () => axiosClient.get('/coowner/profile/notification-settings'),
    updateNotificationSettings: (settings) => axiosClient.put('/coowner/profile/notification-settings', settings)
  },

  // Vehicle Booking System
  vehicles: {
    getAvailable: (startDate, endDate, location) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      if (location) {
        params.append('lat', location.lat.toString());
        params.append('lng', location.lng.toString());
      }

      return axiosClient.get(`/coowner/vehicles/available?${params}`);
    },
    getDetails: (vehicleId) => axiosClient.get(`/coowner/vehicles/${vehicleId}`),
    getMyVehicles: () => axiosClient.get('/coowner/vehicles/my-vehicles'),
    // Vehicle favorites system (document missing endpoints)
    getFavorites: () => axiosClient.get('/coowner/vehicles/favorites'),
    addToFavorites: (vehicleId) => axiosClient.post(`/coowner/vehicles/${vehicleId}/favorite`),
    removeFromFavorites: (vehicleId) => axiosClient.delete(`/coowner/vehicles/${vehicleId}/favorite`),
    getUsageHistory: (vehicleId) => axiosClient.get(`/coowner/vehicles/${vehicleId}/usage-history`),
    // Vehicle availability management
    getAvailabilitySchedule: (vehicleId, dateRange) => axiosClient.get(`/coowner/vehicles/${vehicleId}/availability`, {
      params: dateRange
    }),
    findAvailableSlots: (vehicleId, searchCriteria) => axiosClient.post(`/coowner/vehicles/${vehicleId}/find-slots`, searchCriteria)
  },

  // Booking Management
  bookings: {
    create: (bookingData) => axiosClient.post('/coowner/bookings', bookingData),
    getMy: (status) => {
      const params = status ? `?status=${status}` : '';
      return axiosClient.get(`/coowner/bookings${params}`);
    },
    getById: (bookingId) => axiosClient.get(`/coowner/bookings/${bookingId}`),
    cancel: (bookingId, reason) => axiosClient.delete(`/coowner/bookings/${bookingId}`, {
      data: { reason }
    }),
    modify: (bookingId, modifications) => axiosClient.patch(`/coowner/bookings/${bookingId}`, modifications),
    getBookingHistory: (page = 1, pageSize = 10) =>
      axiosClient.get(`/coowner/bookings/history?page=${page}&pageSize=${pageSize}`),
    checkIn: (bookingId, checkInData) => axiosClient.post(`/coowner/bookings/${bookingId}/check-in`, checkInData),
    checkOut: (bookingId, checkOutData) => axiosClient.post(`/coowner/bookings/${bookingId}/check-out`, checkOutData),
    // Conflict resolution and slot requests
    getPendingConflicts: () => axiosClient.get('/coowner/bookings/conflicts'),
    getSlotRequests: () => axiosClient.get('/coowner/bookings/slot-requests'),
    resolveConflict: (conflictId, resolution) => axiosClient.post(`/coowner/bookings/conflicts/${conflictId}/resolve`, resolution)
  },

  // Fund Management
  funds: {
    getInfo: () => axiosClient.get('/coowner/funds'),
    addFunds: (request) => axiosClient.post('/coowner/funds/add', request),
    getHistory: (groupId, page = 1) => axiosClient.get(`/coowner/funds/${groupId}/history?page=${page}`),
    getMyContributions: () => axiosClient.get('/coowner/funds/my-contributions'),
    withdrawRequest: (groupId, amount, reason) => axiosClient.post(`/coowner/funds/${groupId}/withdraw-request`, {
      amount, reason
    }),
    getWithdrawRequests: () => axiosClient.get('/coowner/funds/withdraw-requests'),
    // Fund usage management (document missing endpoints)
    createUsage: (usageData) => axiosClient.post('/coowner/funds/usage', usageData),
    updateUsage: (usageId, usageData) => axiosClient.put(`/coowner/funds/usage/${usageId}`, usageData),
    deleteUsage: (usageId) => axiosClient.delete(`/coowner/funds/usage/${usageId}`),
    getUsageHistory: (page = 1) => axiosClient.get(`/coowner/funds/usage?page=${page}`)
  },

  // Usage Analytics
  analytics: {
    getUsageStatistics: () => axiosClient.get('/coowner/analytics/usage'),
    getCostAnalysis: (period = 'month') => axiosClient.get(`/coowner/analytics/costs?period=${period}`),
    getEnvironmentalImpact: () => axiosClient.get('/coowner/analytics/environmental-impact'),
    getDrivingPatterns: () => axiosClient.get('/coowner/analytics/driving-patterns'),
    getMonthlyReport: (year, month) => axiosClient.get(`/coowner/analytics/monthly-report?year=${year}&month=${month}`)
  },

  // Group Participation
  groups: {
    getMyGroups: () => axiosClient.get('/coowner/groups'),
    getGroupDetails: (groupId) => axiosClient.get(`/coowner/groups/${groupId}`),
    requestToJoin: (groupId, message) => axiosClient.post(`/coowner/groups/${groupId}/join-request`, { message }),
    leaveGroup: (groupId, reason) => axiosClient.post(`/coowner/groups/${groupId}/leave`, { reason }),
    getInvitations: () => axiosClient.get('/coowner/groups/invitations'),
    respondToInvitation: (invitationId, response, message) =>
      axiosClient.post(`/coowner/groups/invitations/${invitationId}/respond`, { response, message }),
    getMembers: (groupId) => axiosClient.get(`/coowner/groups/${groupId}/members`),
    inviteToGroup: (groupId, inviteData) => axiosClient.post(`/coowner/groups/${groupId}/invite`, inviteData)
  },

  // Payment Management
  payments: {
    getPayments: () => axiosClient.get('/coowner/payments'),
    getPaymentHistory: (page = 1) => axiosClient.get(`/coowner/payments/history?page=${page}`),
    makePayment: (paymentData) => axiosClient.post('/coowner/payments', paymentData),
    getPaymentMethods: () => axiosClient.get('/coowner/payments/methods'),
    updatePaymentMethod: (methodId, methodData) => axiosClient.put(`/coowner/payments/methods/${methodId}`, methodData)
  },

  // Dashboard
  dashboard: {
    getData: () => axiosClient.get('/coowner/dashboard'),
    getRecentActivity: () => axiosClient.get('/coowner/dashboard/recent-activity'),
    getUpcomingBookings: () => axiosClient.get('/coowner/dashboard/upcoming-bookings'),
    getQuickStats: () => axiosClient.get('/coowner/dashboard/quick-stats')
  },

  // Ownership Management (for AccountOwnership.jsx compatibility)
  getOwnerships: () => axiosClient.get('/coowner/ownerships'),
  getOwnershipRequests: () => axiosClient.get('/coowner/ownership-requests'),
  createOwnershipRequest: (ownershipData) => axiosClient.post('/coowner/ownership-request', ownershipData),
  cancelOwnershipRequest: (requestId) => axiosClient.delete(`/coowner/ownership-request/${requestId}`),
  getDocuments: () => axiosClient.get('/coowner/documents'),
  getDashboardStats: () => axiosClient.get('/coowner/dashboard/stats'),

  // Additional methods for compatibility
  getVehicleById: (vehicleId) => axiosClient.get(`/coowner/vehicles/${vehicleId}`),
  getUserSchedule: (params) => axiosClient.get('/coowner/schedule', { params })
};

export default coOwnerApi;