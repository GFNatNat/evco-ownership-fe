// CoOwner-specific API endpoints
// All endpoints updated to use capitalized controller names (e.g., /api/CoOwner) to match Swagger
import axiosClient from '../axiosClient';

const coOwnerApi = {
  // Vehicle Management
  vehicles: {
    getMy: () => axiosClient.get('/api/Vehicle'),
    getById: (id) => axiosClient.get(`/api/Vehicle/${id}`),
    create: (vehicleData) => axiosClient.post('/api/Vehicle', vehicleData),
    update: (id, vehicleData) => axiosClient.put(`/api/Vehicle/${id}`, vehicleData),
    delete: (id) => axiosClient.delete(`/api/Vehicle/${id}`),
    getAvailability: (id) => axiosClient.get(`/api/Vehicle/${id}/availability`),
    setAvailability: (id, schedule) => axiosClient.post(`/api/Vehicle/${id}/availability`, schedule),
    getAnalytics: (id) => axiosClient.get(`/api/Vehicle/${id}/analytics`)
  },

  // Booking Management
  bookings: {
    getMy: () => axiosClient.get('/api/Booking/my-bookings'),
    getById: (id) => axiosClient.get(`/api/Booking/${id}`),
    create: (bookingData) => axiosClient.post('/api/Booking', bookingData),
    update: (id, bookingData) => axiosClient.put(`/api/Booking/${id}`, bookingData),
    cancel: (id, reason) => axiosClient.post(`/api/Booking/${id}/cancel`, { reason }),
    confirm: (id) => axiosClient.post(`/api/Booking/${id}/confirm`),
    getUpcoming: () => axiosClient.get('/api/Booking/upcoming'),
    getHistory: () => axiosClient.get('/api/Booking/history')
  },

  // Schedule Management
  schedule: {
    getMySchedule: () => axiosClient.get('/api/Schedule/user'),
    getVehicleSchedule: (vehicleId) => axiosClient.get(`/api/Schedule/vehicle/${vehicleId}`),
    getAvailableSlots: (vehicleId, date) => axiosClient.get(`/api/Schedule/available-slots?vehicleId=${vehicleId}&date=${date}`),
    bookSlot: (slotData) => axiosClient.post('/api/Schedule/book', slotData)
  },

  // Payments & Finance
  payments: {
    getMy: () => axiosClient.get('/api/Payment/my-payments'),
    getById: (id) => axiosClient.get(`/api/Payment/${id}`),
    makePayment: (paymentData) => axiosClient.post('/api/Payment', paymentData),
    getUpcoming: () => axiosClient.get('/api/Payment/upcoming'),
    getHistory: () => axiosClient.get('/api/Payment/history'),
    getSummary: (period) => axiosClient.get(`/api/Payment/summary?period=${period}`)
  },

  // Fund Management
  funds: {
    getGroupFunds: () => axiosClient.get('/api/Fund'),
    getFundHistory: (fundId) => axiosClient.get(`/api/Fund/history/${fundId}`),
    contribute: (fundId, amount) => axiosClient.post(`/api/Fund/${fundId}/contribute`, { amount }),
    requestWithdrawal: (fundId, amount, reason) => axiosClient.post(`/api/Fund/${fundId}/withdraw`, { amount, reason }),
    getFundAnalytics: (fundId) => axiosClient.get(`/api/Fund/${fundId}/analytics`)
  },

  // Maintenance Management
  maintenance: {
    getMyVehicleMaintenance: () => axiosClient.get('/api/Maintenance'),
    getById: (id) => axiosClient.get(`/api/Maintenance/${id}`),
    scheduleService: (maintenanceData) => axiosClient.post('/api/Maintenance', maintenanceData),
    approveExpense: (id) => axiosClient.post(`/api/Maintenance/${id}/mark-paid`),
    disputeExpense: (id, reason) => axiosClient.post(`/api/Maintenance/${id}/dispute`, { reason }),
    getUpcomingServices: () => axiosClient.get('/api/Maintenance/upcoming')
  },

  // Maintenance Voting
  maintenanceVotes: {
    getActive: () => axiosClient.get('/api/MaintenanceVote/my-voting-history'),
    getById: (id) => axiosClient.get(`/api/MaintenanceVote/${id}`),
    vote: (voteId, decision, notes) => axiosClient.post(`/api/MaintenanceVote/${voteId}/vote`, { decision, notes }),
    createVote: (voteData) => axiosClient.post('/api/MaintenanceVote/propose', voteData),
    getHistory: () => axiosClient.get('/api/MaintenanceVote/my-voting-history')
  },

  // Group Management
  groups: {
    getMy: () => axiosClient.get('/api/Group'),
    getById: (id) => axiosClient.get(`/api/Group/${id}`),
    getMembers: (id) => axiosClient.get(`/api/Group/${id}/members`),
    inviteMember: (groupId, email, percentage) => axiosClient.post(`/api/Group/${groupId}/invite`, { email, percentage }),
    removeMember: (groupId, memberId) => axiosClient.delete(`/api/Group/${groupId}/members/${memberId}`),
    transferOwnership: (groupId, newOwnerId) => axiosClient.post(`/api/Group/${groupId}/transfer`, { newOwnerId })
  },

  // Invitations
  invitations: {
    getReceived: () => axiosClient.get('/api/Group/invitations/received'),
    getSent: () => axiosClient.get('/api/Group/invitations/sent'),
    accept: (id) => axiosClient.post(`/api/Group/invitations/${id}/accept`),
    reject: (id, reason) => axiosClient.post(`/api/Group/invitations/${id}/reject`, { reason }),
    send: (invitationData) => axiosClient.post('/api/Group/invitations', invitationData)
  },

  // Voting Management
  voting: {
    getActive: () => axiosClient.get('/api/Group/votes'),
    getById: (id) => axiosClient.get(`/api/Group/votes/${id}`),
    vote: (voteId, choice, notes) => axiosClient.post(`/api/Group/votes/${voteId}/vote`, { choice, notes }),
    createVote: (voteData) => axiosClient.post('/api/Group/votes', voteData),
    getHistory: () => axiosClient.get('/api/Group/votes/history')
  },

  // Deposits Management
  deposits: {
    getMy: () => axiosClient.get('/api/Deposit/my-deposits'),
    getById: (id) => axiosClient.get(`/api/Deposit/${id}`),
    pay: (depositData) => axiosClient.post('/api/Deposit', depositData),
    requestRefund: (id, reason) => axiosClient.post(`/api/Deposit/${id}/refund`, { reason }),
    getRefundStatus: (id) => axiosClient.get(`/api/Deposit/${id}/refund-status`)
  },

  // Disputes Management
  disputes: {
    getMy: () => axiosClient.get('/api/Dispute'),
    getById: (id) => axiosClient.get(`/api/Dispute/${id}`),
    create: (disputeData) => axiosClient.post('/api/Dispute/booking', disputeData),
    addEvidence: (id, evidence) => axiosClient.post(`/api/Dispute/${id}/evidence`, evidence),
    respondToDispute: (id, response) => axiosClient.post(`/api/Dispute/${id}/respond`, { response })
  },

  // Reports Management
  reports: {
    getMyReports: () => axiosClient.get('/api/Report'),
    generateUsageReport: (vehicleId, period) => axiosClient.post('/api/Report/usage', { vehicleId, period }),
    generateFinancialReport: (period) => axiosClient.post('/api/Report/financial', { period }),
    downloadReport: (reportId) => axiosClient.get(`/api/Report/${reportId}/download`, { responseType: 'blob' })
  },

  // Notifications Management
  notifications: {
    getMy: () => axiosClient.get('/api/Notification/my-notifications'),
    markAsRead: (id) => axiosClient.put(`/api/Notification/mark-read`, { id }),
    markAllAsRead: () => axiosClient.put('/api/Notification/mark-all-read'),
    getSettings: () => axiosClient.get('/api/Notification/settings'),
    updateSettings: (settings) => axiosClient.put('/api/Notification/settings', settings)
  },

  // Usage Analytics
  analytics: {
    getVehicleUsage: (vehicleId, period) => axiosClient.get(`/api/UsageAnalytics/vehicle/${vehicleId}/usage?period=${period}`),
    getCostAnalysis: (period) => axiosClient.get(`/api/UsageAnalytics/costs?period=${period}`),
    getUtilizationMetrics: () => axiosClient.get('/api/UsageAnalytics/utilization'),
    getGroupPerformance: (groupId) => axiosClient.get(`/api/UsageAnalytics/group/${groupId}/performance`)
  },

  // Fairness Optimization
  fairness: {
    getOptimizationSuggestions: () => axiosClient.get('/api/FairnessOptimization/suggestions'),
    getUsageBalance: () => axiosClient.get('/api/FairnessOptimization/usage-balance'),
    getCostEquity: () => axiosClient.get('/api/FairnessOptimization/cost-equity'),
    requestRebalancing: (reason) => axiosClient.post('/api/FairnessOptimization/rebalance', { reason })
  },

  // Dashboard Data
  dashboard: {
    getOverview: () => axiosClient.get('/api/Dashboard/overview'),
    getUpcomingBookings: () => axiosClient.get('/api/Dashboard/bookings'),
    getRecentActivities: () => axiosClient.get('/api/Dashboard/activities'),
    getQuickStats: () => axiosClient.get('/api/Dashboard/stats')
  }
};

export default coOwnerApi;