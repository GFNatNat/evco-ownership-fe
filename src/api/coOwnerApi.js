import axiosClient from './axiosClient';

const coOwnerApi = {
  // Co-owner profile and verification
  getProfile: () => axiosClient.get('/api/CoOwner/profile'),
  updateProfile: (data) => axiosClient.put('/api/CoOwner/profile', data),
  checkEligibility: (data) => axiosClient.post('/api/CoOwner/eligibility', data),

  // Vehicle ownership management
  getOwnerships: () => axiosClient.get('/api/CoOwner/ownerships'),
  getOwnershipById: (id) => axiosClient.get(`/api/CoOwner/ownership/${id}`),

  // Ownership requests
  createOwnershipRequest: (data) => axiosClient.post('/api/CoOwner/ownership-request', {
    vehicleId: data.vehicleId,
    ownershipPercentage: data.ownershipPercentage,
    investmentAmount: data.investmentAmount,
    notes: data.notes
  }),

  getOwnershipRequests: () => axiosClient.get('/api/CoOwner/ownership-requests'),
  updateOwnershipRequest: (id, data) => axiosClient.put(`/api/CoOwner/ownership-request/${id}`, data),
  cancelOwnershipRequest: (id) => axiosClient.delete(`/api/CoOwner/ownership-request/${id}`),

  // Co-ownership group management
  getGroups: () => axiosClient.get('/api/CoOwner/groups'),
  getGroupById: (id) => axiosClient.get(`/api/CoOwner/group/${id}`),
  getGroupMembers: (groupId) => axiosClient.get(`/api/CoOwner/group/${groupId}/members`),

  // Group invitations
  inviteToGroup: (groupId, data) => axiosClient.post(`/api/CoOwner/group/${groupId}/invite`, {
    email: data.email,
    message: data.message
  }),

  respondToInvitation: (invitationId, response) => axiosClient.post(`/api/CoOwner/invitation/${invitationId}/respond`, {
    accept: response
  }),

  getInvitations: () => axiosClient.get('/api/CoOwner/invitations'),

  // Vehicle scheduling and usage
  getSchedule: (vehicleId) => axiosClient.get(`/api/CoOwner/vehicle/${vehicleId}/schedule`),
  bookTimeSlot: (vehicleId, data) => axiosClient.post(`/api/CoOwner/vehicle/${vehicleId}/book`, {
    startTime: data.startTime,
    endTime: data.endTime,
    purpose: data.purpose
  }),

  cancelBooking: (bookingId) => axiosClient.delete(`/api/CoOwner/booking/${bookingId}`),
  getMyBookings: () => axiosClient.get('/api/CoOwner/bookings'),

  // Financial management
  getPayments: () => axiosClient.get('/api/CoOwner/payments'),
  makePayment: (data) => axiosClient.post('/api/CoOwner/payment', {
    ownershipId: data.ownershipId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    description: data.description
  }),

  // Documents and verification
  uploadDocument: (data) => axiosClient.post('/api/CoOwner/documents', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  getDocuments: () => axiosClient.get('/api/CoOwner/documents'),
  deleteDocument: (id) => axiosClient.delete(`/api/CoOwner/documents/${id}`),

  // Activity history
  getActivityHistory: () => axiosClient.get('/api/CoOwner/activity-history'),

  // Notifications
  getNotifications: () => axiosClient.get('/api/CoOwner/notifications'),
  markNotificationAsRead: (id) => axiosClient.put(`/api/CoOwner/notification/${id}/read`),

  // Statistics and reports
  getDashboardStats: () => axiosClient.get('/api/CoOwner/dashboard-stats'),
  getOwnershipSummary: () => axiosClient.get('/api/CoOwner/ownership-summary')
};

export default coOwnerApi;