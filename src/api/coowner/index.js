import axiosClient from '../axiosClient';

const coOwnerApi = {
  // Profile Management - ✅ FIXED to match backend endpoints
  profile: {
    // ✅ Backend endpoint: GET /api/coowner/profile
    get: () => axiosClient.get('/api/coowner/profile'),
    // ✅ Backend endpoint: PATCH /api/coowner/profile  
    update: (profileData) => axiosClient.patch('/api/coowner/profile', profileData),

    // ✅ My Profile endpoints (backend confirmed)
    getMyProfile: () => axiosClient.get('/api/coowner/my-profile'),
    updateMyProfile: (profileData) => axiosClient.put('/api/coowner/my-profile', profileData),
    changePassword: (passwordData) => axiosClient.put('/api/coowner/my-profile/change-password', passwordData),
    getVehicles: () => axiosClient.get('/api/coowner/my-profile/vehicles'),
    getActivity: () => axiosClient.get('/api/coowner/my-profile/activity')

    // ❌ REMOVED - Not available in backend:
    // uploadAvatar, getNotificationSettings, updateNotificationSettings
  },

  // ✅ Registration & Promotion - Added missing implementations
  registration: {
    register: (registrationData) => axiosClient.post('/api/coowner/register', registrationData),
    checkEligibility: () => axiosClient.get('/api/coowner/eligibility'),
    promote: () => axiosClient.post('/api/coowner/promote'),
    promoteUser: (userId) => axiosClient.post(`/api/coowner/promote/${userId}`),
    getStatistics: () => axiosClient.get('/api/coowner/statistics')
  },

  // Ownership Management - Updated
  ownership: {
    get: () => axiosClient.get('/api/coowner/ownership'),
    getOwnerships: () => axiosClient.get('/api/coowner/ownership'),
    createOwnershipRequest: (ownershipData) => axiosClient.post('/api/coowner/ownership', ownershipData),
    cancelOwnershipRequest: (requestId) => axiosClient.delete(`/api/coowner/ownership/${requestId}`)
  },

  // ✅ Schedule Management - Updated with all backend endpoints
  schedule: {
    // ✅ Backend endpoint: GET /api/coowner/schedule
    get: () => axiosClient.get('/api/coowner/schedule'),
    // ✅ Backend endpoint: GET /api/coowner/schedule/vehicle/{vehicleId}
    getVehicleSchedule: (vehicleId, params) => axiosClient.get(`/api/coowner/schedule/vehicle/${vehicleId}`, { params }),
    // ✅ Backend endpoint: POST /api/coowner/schedule/check-availability
    checkAvailability: (availabilityData) => axiosClient.post('/api/coowner/schedule/check-availability', availabilityData),
    // ✅ Backend endpoint: POST /api/coowner/schedule/find-optimal-slots
    findOptimalSlots: (slotCriteria) => axiosClient.post('/api/coowner/schedule/find-optimal-slots', slotCriteria),
    // ✅ Backend endpoint: GET /api/coowner/schedule/my-schedule
    getMySchedule: (params) => axiosClient.get('/api/coowner/schedule/my-schedule', { params }),
    // ✅ Backend endpoint: GET /api/coowner/schedule/conflicts
    getConflicts: () => axiosClient.get('/api/coowner/schedule/conflicts')
  },

  // Vehicle Booking System - Updated to match backend
  vehicles: {
    getAvailable: () => axiosClient.get('/api/coowner/vehicles/available'),
    getDetails: (vehicleId) => axiosClient.get(`/api/coowner/vehicles/${vehicleId}`),
    getMyVehicles: () => axiosClient.get('/api/coowner/vehicles/my-vehicles'),
    // Vehicle favorites system
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

  // ⚠️ Booking Management - FIXED to match backend (mixed singular/plural)
  bookings: {
    // ✅ Backend endpoint: POST /api/coowner/booking (singular)
    create: (bookingData) => axiosClient.post('/api/coowner/booking', bookingData),
    // ✅ Backend endpoint: GET /api/coowner/booking/history  
    getHistory: (page = 1, pageSize = 10) => axiosClient.get(`/api/coowner/booking/history?pageIndex=${page}&pageSize=${pageSize}`),

    // ✅ Additional booking endpoints (plural form available in backend)
    createBooking: (bookingData) => axiosClient.post('/api/coowner/bookings', bookingData),
    getMyBookings: (status) => axiosClient.get('/api/coowner/bookings/my-bookings'),
    getById: (bookingId) => axiosClient.get(`/api/coowner/bookings/${bookingId}`),
    update: (bookingId, modifications) => axiosClient.put(`/api/coowner/bookings/${bookingId}`, modifications),
    cancel: (bookingId, reason) => axiosClient.post(`/api/coowner/bookings/${bookingId}/cancel`, { reason }),
    getAvailability: (params) => axiosClient.get('/api/coowner/bookings/availability', { params }),

    // ✅ Backend confirmed: GET /api/coowner/bookings/vehicle/{vehicleId}
    getVehicleBookings: (vehicleId, params) => axiosClient.get(`/api/coowner/bookings/vehicle/${vehicleId}`, { params }),

    // ❌ Missing in backend - need backend implementation:
    // checkIn: (bookingId, checkInData) => axiosClient.post(`/api/coowner/bookings/${bookingId}/check-in`, checkInData),
    // checkOut: (bookingId, checkOutData) => axiosClient.post(`/api/coowner/bookings/${bookingId}/check-out`, checkOutData),

    // Additional booking features
    modify: (bookingId, modifications) => axiosClient.patch(`/api/coowner/bookings/${bookingId}`, modifications),
    getPendingConflicts: () => axiosClient.get('/api/coowner/bookings/conflicts'),
    getSlotRequests: () => axiosClient.get('/api/coowner/bookings/slot-requests'),
    resolveConflict: (conflictId, resolution) => axiosClient.post(`/api/coowner/bookings/conflicts/${conflictId}/resolve`, resolution)
  },

  // ✅ Fund Management - Updated with ALL backend endpoints
  funds: {
    // ✅ Basic fund operations
    getInfo: () => axiosClient.get('/api/coowner/funds'),
    addFunds: (request) => axiosClient.post('/api/coowner/funds/add', request),
    getMyContributions: () => axiosClient.get('/api/coowner/funds/my-contributions'),

    // ✅ All backend fund endpoints confirmed
    getCosts: (params) => axiosClient.get('/api/coowner/costs', { params }),
    getBalance: (vehicleId) => axiosClient.get(`/api/coowner/fund/balance/${vehicleId}`),
    getAdditions: (vehicleId, pageNumber = 1, pageSize = 20) =>
      axiosClient.get(`/api/coowner/fund/additions/${vehicleId}?pageNumber=${pageNumber}&pageSize=${pageSize}`),
    getUsages: (vehicleId, pageNumber = 1, pageSize = 20) =>
      axiosClient.get(`/api/coowner/fund/usages/${vehicleId}?pageNumber=${pageNumber}&pageSize=${pageSize}`),
    getSummary: (vehicleId, monthsToAnalyze = 6) =>
      axiosClient.get(`/api/coowner/fund/summary/${vehicleId}?monthsToAnalyze=${monthsToAnalyze}`),
    createUsage: (usageData) => axiosClient.post('/api/coowner/fund/usage', usageData),
    getCategoryUsages: (vehicleId, category, startDate, endDate) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      return axiosClient.get(`/api/coowner/fund/category/${vehicleId}/usages/${category}?${params}`);
    },

    // Fund usage management (compatibility)
    getHistory: (groupId) => axiosClient.get(`/api/coowner/funds/${groupId}/history`),
    updateUsage: (usageId, usageData) => axiosClient.put(`/api/coowner/funds/usage/${usageId}`, usageData),
    deleteUsage: (usageId) => axiosClient.delete(`/api/coowner/funds/usage/${usageId}`),
    getUsageHistory: (page = 1) => axiosClient.get(`/api/coowner/funds/usage?page=${page}`),

    // Withdraw management (may not be in backend)
    withdrawRequest: (groupId, amount, reason) => axiosClient.post(`/api/coowner/funds/${groupId}/withdraw-request`, {
      amount, reason
    }),
    getWithdrawRequests: () => axiosClient.get('/api/coowner/funds/withdraw-requests')
  },

  // ✅ Usage Analytics - Updated with ALL backend endpoints
  analytics: {
    // ✅ Backend endpoint: GET /api/coowner/analytics
    get: () => axiosClient.get('/api/coowner/analytics'),
    getUsageStatistics: () => axiosClient.get('/api/coowner/analytics/usage'),
    getCostAnalysis: (period = 'month') => axiosClient.get(`/api/coowner/analytics/costs?period=${period}`),
    getEnvironmentalImpact: () => axiosClient.get('/api/coowner/analytics/environmental-impact'),
    getDrivingPatterns: () => axiosClient.get('/api/coowner/analytics/driving-patterns'),
    getMonthlyReport: (year, month) => axiosClient.get(`/api/coowner/analytics/monthly-report?year=${year}&month=${month}`),

    // ✅ ALL backend analytics endpoints confirmed
    getVehicleUsageVsOwnership: (vehicleId, params) =>
      axiosClient.get(`/api/coowner/analytics/vehicle/${vehicleId}/usage-vs-ownership`, { params }),
    getVehicleUsageTrends: (vehicleId, params) =>
      axiosClient.get(`/api/coowner/analytics/vehicle/${vehicleId}/usage-trends`, { params }),
    getMyUsageHistory: (params) => axiosClient.get('/api/coowner/analytics/my-usage-history', { params }),
    getGroupSummary: () => axiosClient.get('/api/coowner/analytics/group-summary')
  },

  // ⚠️ Groups - FIXED to use SINGULAR endpoint as per backend
  groups: {
    // ✅ Backend endpoint: GET /api/coowner/group (singular)
    getMyGroups: () => axiosClient.get('/api/coowner/group'),

    // ❌ BACKEND MISSING - Need backend to implement:
    // getGroupDetails: (groupId) => axiosClient.get(`/api/coowner/group/${groupId}`),
    // getMembers: (groupId) => axiosClient.get(`/api/coowner/group/${groupId}/members`),
    // TODO: Ask backend team to implement these endpoints

    // ✅ Backend endpoints confirmed
    invite: (inviteData) => axiosClient.post('/api/coowner/group/invite', inviteData),
    removeMember: (memberId) => axiosClient.delete(`/api/coowner/group/member/${memberId}`),
    vote: (voteData) => axiosClient.post('/api/coowner/group/vote', voteData),
    getFund: () => axiosClient.get('/api/coowner/group/fund'),

    // Legacy endpoints (may need to be removed or updated)
    requestToJoin: (groupId, message) => axiosClient.post(`/api/coowner/groups/${groupId}/join-request`, { message }),
    leaveGroup: (groupId, reason) => axiosClient.post(`/api/coowner/groups/${groupId}/leave`, { reason }),
    getInvitations: () => axiosClient.get('/api/coowner/groups/invitations'),
    respondToInvitation: (invitationId, response, message) =>
      axiosClient.post(`/api/coowner/groups/invitations/${invitationId}/respond`, { response, message }),
    inviteToGroup: (groupId, inviteData) => axiosClient.post(`/api/coowner/groups/${groupId}/invite`, inviteData)
  },

  // ⚠️ Payment Management - FIXED to use correct backend endpoints
  payments: {
    // ✅ Backend endpoint: POST /api/coowner/payment (singular)
    makePayment: (paymentData) => axiosClient.post('/api/coowner/payment', paymentData),

    // ✅ Backend endpoints with plural form confirmed
    create: (paymentData) => axiosClient.post('/api/coowner/payments', paymentData),
    getById: (paymentId) => axiosClient.get(`/api/coowner/payments/${paymentId}`),
    getMyPayments: (params) => axiosClient.get('/api/coowner/payments/my-payments', { params }),
    cancelPayment: (paymentId) => axiosClient.post(`/api/coowner/payments/${paymentId}/cancel`),
    getGateways: () => axiosClient.get('/api/coowner/payments/gateways'),

    // ❌ DEPRECATED - Remove old Payment API endpoints:
    // getPayments: () => axiosClient.get('/api/Payment/invoices'),
    // getPaymentHistory: (page = 1) => axiosClient.get(`/api/Payment/invoices?pageIndex=${page}`),
    // getPaymentMethods: () => axiosClient.get('/api/Payment/methods'),

    // Legacy compatibility
    getStatistics: () => axiosClient.get('/api/coowner/statistics'),
    updatePaymentMethod: (methodId, methodData) => axiosClient.put(`/api/coowner/payments/methods/${methodId}`, methodData)
  },

  // ✅ Test Endpoints - Development only (confirmed in backend)
  test: {
    getEligibilityScenarios: () => axiosClient.get('/api/coowner/test/eligibility-scenarios'),
    getPromotionWorkflow: () => axiosClient.get('/api/coowner/test/promotion-workflow')
  },

  // ✅ Dashboard - All endpoints confirmed
  dashboard: {
    getData: () => axiosClient.get('/api/coowner/dashboard'),
    getQuickStats: () => axiosClient.get('/api/coowner/dashboard/quick-stats'),

    // ❌ BACKEND MISSING - May need backend implementation:
    // getRecentActivity: () => axiosClient.get('/api/coowner/dashboard/recent-activity'),
    // getUpcomingBookings: () => axiosClient.get('/api/coowner/dashboard/upcoming-bookings'),
  },

  // Legacy/Compatibility methods for existing components
  getDashboardStats: () => axiosClient.get('/api/coowner/dashboard'),
  getOwnerships: () => axiosClient.get('/api/coowner/ownership'),
  getOwnershipRequests: () => axiosClient.get('/api/coowner/ownership'),
  createOwnershipRequest: (ownershipData) => axiosClient.post('/api/coowner/ownership', ownershipData),
  cancelOwnershipRequest: (requestId) => axiosClient.delete(`/api/coowner/ownership/${requestId}`),
  getDocuments: () => axiosClient.get('/api/coowner/profile'),
  getVehicleById: (vehicleId) => axiosClient.get(`/api/coowner/vehicles/${vehicleId}`),
  getUserSchedule: (params) => axiosClient.get('/api/coowner/schedule/my-schedule', { params }),

  // Additional convenience methods
  getProfile: () => axiosClient.get('/api/coowner/profile'),
  updateProfile: (profileData) => axiosClient.patch('/api/coowner/profile', profileData)
};

export default coOwnerApi;