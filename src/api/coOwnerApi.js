import axiosClient from './axiosClient';

const coOwnerApi = {
  // Core CoOwner API endpoints as per 05-COOWNER-API.md

  // 1. GET /api/coowner/eligibility - Check eligibility to become co-owner
  checkEligibility: () => axiosClient.get('/api/CoOwner/eligibility'),

  // 2. POST /api/coowner/promote - Promote user to co-owner (Admin only)
  promote: (data) => axiosClient.post('/api/CoOwner/promote', {
    userId: data.userId,
    vehicleId: data.vehicleId
  }),

  // 3. GET /api/coowner/statistics - Get co-owner statistics (Admin only)
  getStatistics: () => axiosClient.get('/api/CoOwner/statistics'),

  // 4. GET /api/coowner/vehicles - Get vehicles associated with co-owner
  getVehicles: () => axiosClient.get('/api/CoOwner/vehicles'),

  // 5. DELETE /api/coowner/remove - Remove co-owner status (Admin only)
  remove: (data) => axiosClient.delete('/api/CoOwner/remove', {
    data: {
      userId: data.userId,
      vehicleId: data.vehicleId
    }
  }),

  // Extended functionality (for existing frontend compatibility)
  // These endpoints may need backend implementation

  // Profile and verification (kept for existing pages)
  getProfile: () => axiosClient.get('/api/CoOwner/profile'),
  updateProfile: (data) => axiosClient.put('/api/CoOwner/profile', data),

  // Vehicle ownership management
  getOwnerships: () => axiosClient.get('/api/CoOwner/ownerships'),
  getOwnershipById: (id) => axiosClient.get(`/api/CoOwner/ownership/${id}`),

  // Group management for existing functionality
  getGroups: () => axiosClient.get('/api/CoOwner/groups'),
  getGroupById: (id) => axiosClient.get(`/api/CoOwner/group/${id}`),
  getGroupMembers: (groupId) => axiosClient.get(`/api/CoOwner/group/${groupId}/members`),

  // Invitations (kept for existing invitation system)
  inviteToGroup: (groupId, data) => axiosClient.post(`/api/CoOwner/group/${groupId}/invite`, {
    email: data.email,
    message: data.message
  }),

  respondToInvitation: (invitationId, response) => axiosClient.post(`/api/CoOwner/invitation/${invitationId}/respond`, {
    accept: response
  }),

  getInvitations: () => axiosClient.get('/api/CoOwner/invitations'),

  // Vehicle scheduling (for booking system)
  getSchedule: (vehicleId) => axiosClient.get(`/api/CoOwner/vehicle/${vehicleId}/schedule`),
  bookTimeSlot: (vehicleId, data) => axiosClient.post(`/api/CoOwner/vehicle/${vehicleId}/book`, {
    startTime: data.startTime,
    endTime: data.endTime,
    purpose: data.purpose
  }),

  cancelBooking: (bookingId) => axiosClient.delete(`/api/CoOwner/booking/${bookingId}`),
  getMyBookings: () => axiosClient.get('/api/CoOwner/bookings'),

  // Financial management (for payment system)
  getPayments: () => axiosClient.get('/api/CoOwner/payments'),
  makePayment: (data) => axiosClient.post('/api/CoOwner/payment', {
    ownershipId: data.ownershipId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    description: data.description
  }),

  // Dashboard stats (for existing dashboard)
  getDashboardStats: () => axiosClient.get('/api/CoOwner/dashboard-stats'),
  getOwnershipSummary: () => axiosClient.get('/api/CoOwner/ownership-summary')
};

export default coOwnerApi;