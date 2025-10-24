// CoOwner-specific API endpoints
import axiosClient from '../axiosClient';

const coOwnerApi = {
  // Vehicle Management
  vehicles: {
    getMy: () => axiosClient.get('/api/coowner/vehicles'),
    getById: (id) => axiosClient.get(`/api/coowner/vehicles/${id}`),
    create: (vehicleData) => axiosClient.post('/api/coowner/vehicles', vehicleData),
    update: (id, vehicleData) => axiosClient.put(`/api/coowner/vehicles/${id}`, vehicleData),
    delete: (id) => axiosClient.delete(`/api/coowner/vehicles/${id}`),
    getAvailability: (id) => axiosClient.get(`/api/coowner/vehicles/${id}/availability`),
    setAvailability: (id, schedule) => axiosClient.post(`/api/coowner/vehicles/${id}/availability`, schedule),
    getAnalytics: (id) => axiosClient.get(`/api/coowner/vehicles/${id}/analytics`)
  },

  // Booking Management
  bookings: {
    getMy: () => axiosClient.get('/api/coowner/bookings'),
    getById: (id) => axiosClient.get(`/api/coowner/bookings/${id}`),
    create: (bookingData) => axiosClient.post('/api/coowner/bookings', bookingData),
    update: (id, bookingData) => axiosClient.put(`/api/coowner/bookings/${id}`, bookingData),
    cancel: (id, reason) => axiosClient.patch(`/api/coowner/bookings/${id}/cancel`, { reason }),
    confirm: (id) => axiosClient.patch(`/api/coowner/bookings/${id}/confirm`),
    getUpcoming: () => axiosClient.get('/api/coowner/bookings/upcoming'),
    getHistory: () => axiosClient.get('/api/coowner/bookings/history')
  },

  // Schedule Management
  schedule: {
    getMySchedule: () => axiosClient.get('/api/coowner/schedule'),
    getVehicleSchedule: (vehicleId) => axiosClient.get(`/api/coowner/schedule/vehicle/${vehicleId}`),
    getAvailableSlots: (vehicleId, date) => axiosClient.get(`/api/coowner/schedule/available?vehicleId=${vehicleId}&date=${date}`),
    bookSlot: (slotData) => axiosClient.post('/api/coowner/schedule/book', slotData)
  },

  // Payments & Finance
  payments: {
    getMy: () => axiosClient.get('/api/coowner/payments'),
    getById: (id) => axiosClient.get(`/api/coowner/payments/${id}`),
    makePayment: (paymentData) => axiosClient.post('/api/coowner/payments', paymentData),
    getUpcoming: () => axiosClient.get('/api/coowner/payments/upcoming'),
    getHistory: () => axiosClient.get('/api/coowner/payments/history'),
    getSummary: (period) => axiosClient.get(`/api/coowner/payments/summary?period=${period}`)
  },

  // Fund Management
  funds: {
    getGroupFunds: () => axiosClient.get('/api/coowner/funds'),
    getFundHistory: (fundId) => axiosClient.get(`/api/coowner/funds/${fundId}/history`),
    contribute: (fundId, amount) => axiosClient.post(`/api/coowner/funds/${fundId}/contribute`, { amount }),
    requestWithdrawal: (fundId, amount, reason) => axiosClient.post(`/api/coowner/funds/${fundId}/withdraw`, { amount, reason }),
    getFundAnalytics: (fundId) => axiosClient.get(`/api/coowner/funds/${fundId}/analytics`)
  },

  // Maintenance Management
  maintenance: {
    getMyVehicleMaintenance: () => axiosClient.get('/api/coowner/maintenance'),
    getById: (id) => axiosClient.get(`/api/coowner/maintenance/${id}`),
    scheduleService: (maintenanceData) => axiosClient.post('/api/coowner/maintenance', maintenanceData),
    approveExpense: (id) => axiosClient.patch(`/api/coowner/maintenance/${id}/approve`),
    disputeExpense: (id, reason) => axiosClient.patch(`/api/coowner/maintenance/${id}/dispute`, { reason }),
    getUpcomingServices: () => axiosClient.get('/api/coowner/maintenance/upcoming')
  },

  // Maintenance Voting
  maintenanceVotes: {
    getActive: () => axiosClient.get('/api/coowner/maintenance-votes'),
    getById: (id) => axiosClient.get(`/api/coowner/maintenance-votes/${id}`),
    vote: (voteId, decision, notes) => axiosClient.post(`/api/coowner/maintenance-votes/${voteId}/vote`, { decision, notes }),
    createVote: (voteData) => axiosClient.post('/api/coowner/maintenance-votes', voteData),
    getHistory: () => axiosClient.get('/api/coowner/maintenance-votes/history')
  },

  // Group Management
  groups: {
    getMy: () => axiosClient.get('/api/coowner/groups'),
    getById: (id) => axiosClient.get(`/api/coowner/groups/${id}`),
    getMembers: (id) => axiosClient.get(`/api/coowner/groups/${id}/members`),
    inviteMember: (groupId, email, percentage) => axiosClient.post(`/api/coowner/groups/${groupId}/invite`, { email, percentage }),
    removeMember: (groupId, memberId) => axiosClient.delete(`/api/coowner/groups/${groupId}/members/${memberId}`),
    transferOwnership: (groupId, newOwnerId) => axiosClient.patch(`/api/coowner/groups/${groupId}/transfer`, { newOwnerId })
  },

  // Invitations
  invitations: {
    getReceived: () => axiosClient.get('/api/coowner/invitations/received'),
    getSent: () => axiosClient.get('/api/coowner/invitations/sent'),
    accept: (id) => axiosClient.patch(`/api/coowner/invitations/${id}/accept`),
    reject: (id, reason) => axiosClient.patch(`/api/coowner/invitations/${id}/reject`, { reason }),
    send: (invitationData) => axiosClient.post('/api/coowner/invitations', invitationData)
  },

  // Voting Management
  voting: {
    getActive: () => axiosClient.get('/api/coowner/voting'),
    getById: (id) => axiosClient.get(`/api/coowner/voting/${id}`),
    vote: (voteId, choice, notes) => axiosClient.post(`/api/coowner/voting/${voteId}/vote`, { choice, notes }),
    createVote: (voteData) => axiosClient.post('/api/coowner/voting', voteData),
    getHistory: () => axiosClient.get('/api/coowner/voting/history')
  },

  // Deposits Management
  deposits: {
    getMy: () => axiosClient.get('/api/coowner/deposits'),
    getById: (id) => axiosClient.get(`/api/coowner/deposits/${id}`),
    pay: (depositData) => axiosClient.post('/api/coowner/deposits', depositData),
    requestRefund: (id, reason) => axiosClient.post(`/api/coowner/deposits/${id}/refund`, { reason }),
    getRefundStatus: (id) => axiosClient.get(`/api/coowner/deposits/${id}/refund-status`)
  },

  // Disputes Management
  disputes: {
    getMy: () => axiosClient.get('/api/coowner/disputes'),
    getById: (id) => axiosClient.get(`/api/coowner/disputes/${id}`),
    create: (disputeData) => axiosClient.post('/api/coowner/disputes', disputeData),
    addEvidence: (id, evidence) => axiosClient.post(`/api/coowner/disputes/${id}/evidence`, evidence),
    respondToDispute: (id, response) => axiosClient.post(`/api/coowner/disputes/${id}/respond`, { response })
  },

  // Reports Management
  reports: {
    getMyReports: () => axiosClient.get('/api/coowner/reports'),
    generateUsageReport: (vehicleId, period) => axiosClient.post('/api/coowner/reports/usage', { vehicleId, period }),
    generateFinancialReport: (period) => axiosClient.post('/api/coowner/reports/financial', { period }),
    downloadReport: (reportId) => axiosClient.get(`/api/coowner/reports/${reportId}/download`, { responseType: 'blob' })
  },

  // Notifications Management
  notifications: {
    getMy: () => axiosClient.get('/api/coowner/notifications'),
    markAsRead: (id) => axiosClient.patch(`/api/coowner/notifications/${id}/read`),
    markAllAsRead: () => axiosClient.patch('/api/coowner/notifications/read-all'),
    getSettings: () => axiosClient.get('/api/coowner/notifications/settings'),
    updateSettings: (settings) => axiosClient.put('/api/coowner/notifications/settings', settings)
  },

  // Usage Analytics
  analytics: {
    getVehicleUsage: (vehicleId, period) => axiosClient.get(`/api/coowner/analytics/vehicle/${vehicleId}/usage?period=${period}`),
    getCostAnalysis: (period) => axiosClient.get(`/api/coowner/analytics/costs?period=${period}`),
    getUtilizationMetrics: () => axiosClient.get('/api/coowner/analytics/utilization'),
    getGroupPerformance: (groupId) => axiosClient.get(`/api/coowner/analytics/group/${groupId}/performance`)
  },

  // Fairness Optimization
  fairness: {
    getOptimizationSuggestions: () => axiosClient.get('/api/coowner/fairness/suggestions'),
    getUsageBalance: () => axiosClient.get('/api/coowner/fairness/usage-balance'),
    getCostEquity: () => axiosClient.get('/api/coowner/fairness/cost-equity'),
    requestRebalancing: (reason) => axiosClient.post('/api/coowner/fairness/rebalance', { reason })
  },

  // Dashboard Data
  dashboard: {
    getOverview: () => axiosClient.get('/api/coowner/dashboard/overview'),
    getUpcomingBookings: () => axiosClient.get('/api/coowner/dashboard/bookings'),
    getRecentActivities: () => axiosClient.get('/api/coowner/dashboard/activities'),
    getQuickStats: () => axiosClient.get('/api/coowner/dashboard/stats')
  }
};

export default coOwnerApi;