import axiosClient from '../axiosClient';

const coOwnerApi = {
  // Profile Management
  profile: {
    get: () => axiosClient.get('/api/coowner/my-profile'),
    update: (profileData) => axiosClient.put('/api/coowner/my-profile', profileData),
    uploadAvatar: (formData) => axiosClient.post('/api/coowner/my-profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    changePassword: (passwordData) => axiosClient.put('/api/coowner/my-profile/change-password', passwordData),
    getNotificationSettings: () => axiosClient.get('/api/coowner/profile/notification-settings'),
    updateNotificationSettings: (settings) => axiosClient.put('/api/coowner/profile/notification-settings', settings)
  },

  // Vehicle Booking System
  vehicles: {
    getAvailable: () => axiosClient.get('/api/Vehicle'), // Use Vehicle API as documented
    getDetails: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}`),
    getMyVehicles: () => axiosClient.get('/api/Vehicle'), // Get all vehicles, filter by ownership
    // Vehicle favorites system (document missing endpoints)
    getFavorites: () => axiosClient.get('/api/coowner/vehicles/favorites'),
    addToFavorites: (vehicleId) => axiosClient.post(`/api/coowner/vehicles/${vehicleId}/favorite`),
    removeFromFavorites: (vehicleId) => axiosClient.delete(`/api/coowner/vehicles/${vehicleId}/favorite`),
    getUsageHistory: (vehicleId) => axiosClient.get(`/api/coowner/vehicles/${vehicleId}/usage-history`),
    // Vehicle availability management
    getAvailabilitySchedule: (vehicleId, dateRange) => axiosClient.get(`/api/coowner/vehicles/${vehicleId}/availability`, {
      params: dateRange
    }),
    findAvailableSlots: (vehicleId, searchCriteria) => axiosClient.post(`/api/coowner/vehicles/${vehicleId}/find-slots`, searchCriteria)
  },

  // Booking Management
  bookings: {
    create: (bookingData) => axiosClient.post('/api/Booking', bookingData),
    getMy: (status) => axiosClient.get('/api/Booking/my-bookings'),
    getById: (bookingId) => axiosClient.get(`/api/Booking/${bookingId}`),
    cancel: (bookingId, reason) => axiosClient.post(`/api/Booking/${bookingId}/cancel`, { reason }),
    modify: (bookingId, modifications) => axiosClient.patch(`/api/Booking/${bookingId}`, modifications),
    getBookingHistory: (page = 1, pageSize = 10) =>
      axiosClient.get(`/api/Booking/my-bookings?pageIndex=${page}&pageSize=${pageSize}`),
    checkIn: (bookingId, checkInData) => axiosClient.post(`/api/coowner/bookings/${bookingId}/check-in`, checkInData),
    checkOut: (bookingId, checkOutData) => axiosClient.post(`/api/coowner/bookings/${bookingId}/check-out`, checkOutData),
    // Conflict resolution and slot requests
    getPendingConflicts: () => axiosClient.get('/api/coowner/bookings/conflicts'),
    getSlotRequests: () => axiosClient.get('/api/coowner/bookings/slot-requests'),
    resolveConflict: (conflictId, resolution) => axiosClient.post(`/api/coowner/bookings/conflicts/${conflictId}/resolve`, resolution)
  },

  // Fund Management
  funds: {
    getInfo: () => axiosClient.get('/api/coowner/group/fund'),
    addFunds: (request) => axiosClient.post('/api/Group/{groupId}/fund/contribute', request),
    getHistory: (groupId) => axiosClient.get(`/api/Group/${groupId}/fund/history`),
    getMyContributions: () => axiosClient.get('/api/coowner/group/fund'),
    withdrawRequest: (groupId, amount, reason) => axiosClient.post(`/api/coowner/funds/${groupId}/withdraw-request`, {
      amount, reason
    }),
    getWithdrawRequests: () => axiosClient.get('/api/coowner/funds/withdraw-requests'),
    // Fund usage management (document missing endpoints)
    createUsage: (usageData) => axiosClient.post('/api/coowner/funds/usage', usageData),
    updateUsage: (usageId, usageData) => axiosClient.put(`/api/coowner/funds/usage/${usageId}`, usageData),
    deleteUsage: (usageId) => axiosClient.delete(`/api/coowner/funds/usage/${usageId}`),
    getUsageHistory: (page = 1) => axiosClient.get(`/api/coowner/funds/usage?page=${page}`)
  },

  // Usage Analytics
  analytics: {
    getUsageStatistics: () => axiosClient.get('/api/coowner/analytics/usage'),
    getCostAnalysis: (period = 'month') => axiosClient.get(`/api/coowner/analytics/costs?period=${period}`),
    getEnvironmentalImpact: () => axiosClient.get('/api/coowner/analytics/environmental-impact'),
    getDrivingPatterns: () => axiosClient.get('/api/coowner/analytics/driving-patterns'),
    getMonthlyReport: (year, month) => axiosClient.get(`/api/coowner/analytics/monthly-report?year=${year}&month=${month}`)
  },

  // Group Participation
  groups: {
    getMyGroups: () => axiosClient.get('/api/coowner/group'),
    getGroupDetails: (groupId) => axiosClient.get(`/api/Group/${groupId}`),
    requestToJoin: (groupId, message) => axiosClient.post(`/api/Group/${groupId}/members`, { message }),
    leaveGroup: (groupId, reason) => axiosClient.post(`/api/coowner/groups/${groupId}/leave`, { reason }),
    getInvitations: () => axiosClient.get('/api/coowner/groups/invitations'),
    respondToInvitation: (invitationId, response, message) =>
      axiosClient.post(`/api/coowner/groups/invitations/${invitationId}/respond`, { response, message }),
    getMembers: (groupId) => axiosClient.get(`/api/coowner/groups/${groupId}/members`),
    inviteToGroup: (groupId, inviteData) => axiosClient.post(`/api/coowner/groups/${groupId}/invite`, inviteData)
  },

  // Payment Management
  payments: {
    getPayments: () => axiosClient.get('/api/Payment/invoices'),
    getPaymentHistory: (page = 1) => axiosClient.get(`/api/Payment/invoices?pageIndex=${page}`),
    makePayment: (paymentData) => axiosClient.post('/api/coowner/payments', paymentData),
    getPaymentMethods: () => axiosClient.get('/api/Payment/methods'),
    updatePaymentMethod: (methodId, methodData) => axiosClient.put(`/api/coowner/payments/methods/${methodId}`, methodData),
    getGateways: () => axiosClient.get('/api/Payment/methods'),
    getStatistics: () => axiosClient.get('/api/coowner/statistics')
  },

  // Dashboard
  dashboard: {
    getData: () => axiosClient.get('/api/coowner/dashboard'),
    getRecentActivity: () => axiosClient.get('/api/coowner/dashboard/recent-activity'),
    getUpcomingBookings: () => axiosClient.get('/api/coowner/dashboard/upcoming-bookings'),
    getQuickStats: () => axiosClient.get('/api/coowner/dashboard/quick-stats')
  },

  // Ownership Management (for AccountOwnership.jsx compatibility)
  getOwnerships: () => axiosClient.get('/api/coowner/ownership'),
  getOwnershipRequests: () => axiosClient.get('/api/coowner/ownership'),
  createOwnershipRequest: (ownershipData) => axiosClient.post('/api/coowner/ownership', ownershipData),
  cancelOwnershipRequest: (requestId) => axiosClient.delete(`/api/coowner/ownership/${requestId}`),
  getDocuments: () => axiosClient.get('/api/coowner/my-profile'),
  getDashboardStats: () => axiosClient.get('/api/coowner/statistics'),

  // Additional methods for compatibility
  getVehicleById: (vehicleId) => axiosClient.get(`/api/Group/{groupId}/vehicles/${vehicleId}`),
  getUserSchedule: (params) => axiosClient.get('/api/coowner/schedule/my-schedule', { params })
};

export default coOwnerApi;