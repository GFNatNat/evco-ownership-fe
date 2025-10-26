import axiosClient from './axiosClient';

const coOwnerApi = {
  // Core CoOwner API endpoints as per 05-COOWNER-API.md

  // 1. GET /api/coowner/eligibility - Check eligibility to become co-owner
  checkEligibility: () => axiosClient.get('/api/coowner/eligibility'),

  // 2. POST /api/coowner/promote - Promote user to co-owner (Admin only)
  promote: (data) => axiosClient.post('/api/coowner/promote', {
    userId: data.userId,
    vehicleId: data.vehicleId
  }),

  // 3. GET /api/coowner/statistics - Get co-owner statistics (Admin only)
  getStatistics: () => axiosClient.get('/api/coowner/statistics'),

  // 4. GET /api/coowner/vehicles - Get vehicles associated with co-owner
  getVehicles: () => axiosClient.get('/api/vehicle'),

  // 5. DELETE /api/coowner/remove - Remove co-owner status (Admin only)
  remove: (data) => axiosClient.delete('/api/coowner/remove', {
    data: {
      userId: data.userId,
      vehicleId: data.vehicleId
    }
  }),

  // Extended functionality (for existing frontend compatibility)
  // These endpoints may need backend implementation

  // Profile and verification (kept for existing pages)
  getProfile: () => axiosClient.get('/api/profile'),
  updateProfile: (data) => axiosClient.put('/api/profile', data),

  // Vehicle ownership management
  getOwnerships: () => axiosClient.get('/api/ownershiphistory/my-history'),
  getOwnershipById: (id) => axiosClient.get(`/api/ownershiphistory/vehicle/${id}`),
  getOwnershipRequests: () => axiosClient.get('/api/ownership-change/my-requests'),
  createOwnershipRequest: (data) => axiosClient.post('/api/ownership-change/propose', {
    vehicleId: data.vehicleId,
    ownershipPercentage: data.ownershipPercentage,
    investmentAmount: data.investmentAmount,
    notes: data.notes
  }),

  // Document management
  getDocuments: () => axiosClient.get('/api/fileupload'),
  uploadDocument: (data) => axiosClient.post('/api/fileupload/upload', data),

  // Group management for existing functionality
  getGroups: () => axiosClient.get('/api/group'),
  getGroupById: (id) => axiosClient.get(`/api/group/${id}`),
  getGroupMembers: (groupId) => axiosClient.get(`/api/group/${groupId}/members`),

  // Invitations (kept for existing invitation system)
  inviteToGroup: (groupId, data) => axiosClient.post(`/api/group/${groupId}/invite`, {
    email: data.email,
    message: data.message
  }),

  respondToInvitation: (invitationId, response) => axiosClient.post(`/api/group/invitation/${invitationId}/respond`, {
    accept: response
  }),

  getInvitations: () => axiosClient.get('/api/group/invitations'),

  // Vehicle scheduling (for booking system)
  getSchedule: (vehicleId) => axiosClient.get(`/api/schedule/vehicle/${vehicleId}`),
  bookTimeSlot: (vehicleId, data) => axiosClient.post(`/api/schedule/book`, {
    startTime: data.startTime,
    endTime: data.endTime,
    purpose: data.purpose
  }),

  cancelBooking: (bookingId) => axiosClient.delete(`/api/booking/${bookingId}`),
  getMyBookings: () => axiosClient.get('/api/booking/my-bookings'),

  // Financial management (for payment system)
  getPayments: () => axiosClient.get('/api/payment/my-payments'),
  makePayment: (data) => axiosClient.post('/api/payment', {
    ownershipId: data.ownershipId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    description: data.description
  }),

  // Dashboard stats (for existing dashboard)
  getDashboardStats: () => axiosClient.get('/api/dashboard/overview'),
  getOwnershipSummary: () => axiosClient.get('/api/ownershiphistory/my-history')
};

export default coOwnerApi;