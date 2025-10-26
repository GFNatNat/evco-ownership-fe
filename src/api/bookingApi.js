// All endpoints updated to use capitalized controller names (e.g., /api/Booking) to match Swagger
import axiosClient from './axiosClient';

const bookingApi = {
  // Booking CRUD operations
  getAll: (params) => axiosClient.get('/api/Booking', { params }),
  getById: (id) => axiosClient.get(`/api/Booking/${id}`),
  create: (data) => axiosClient.post('/api/Booking', {
    vehicleId: data.vehicleId,
    startDateTime: data.startDateTime,
    endDateTime: data.endDateTime,
    purpose: data.purpose,
    notes: data.notes
  }),
  update: (id, data) => axiosClient.put(`/api/Booking/${id}`, data),
  cancel: (id, reason) => axiosClient.delete(`/api/Booking/${id}`, {
    data: { reason }
  }),

  // Check-in/Check-out operations
  checkIn: (id, data) => axiosClient.post(`/api/Booking/${id}/check-in`, {
    actualStartTime: data.actualStartTime,
    vehicleConditionNotes: data.vehicleConditionNotes,
    fuelLevel: data.fuelLevel,
    mileage: data.mileage
  }),

  checkOut: (id, data) => axiosClient.post(`/api/Booking/${id}/check-out`, {
    actualEndTime: data.actualEndTime,
    returnConditionNotes: data.returnConditionNotes,
    fuelLevel: data.fuelLevel,
    mileage: data.mileage,
    incidentReport: data.incidentReport
  }),

  // Booking queries
  getMyBookings: (status) => axiosClient.get('/api/Booking/my-bookings', {
    params: { status }
  }),

  getTodaysBookings: () => axiosClient.get('/api/Booking/today'),
  getUpcomingBookings: () => axiosClient.get('/api/Booking/upcoming'),
  getActiveBookings: () => axiosClient.get('/api/Booking/active'),

  // Vehicle specific bookings
  getVehicleBookings: (vehicleId, params) => axiosClient.get(`/api/Booking/vehicle/${vehicleId}`, {
    params
  }),

  getVehicleSchedule: (vehicleId, startDate, endDate) => axiosClient.get(`/api/Booking/vehicle/${vehicleId}/schedule`, {
    params: { startDate, endDate }
  }),

  // Booking status management
  approve: (id) => axiosClient.post(`/api/Booking/${id}/approve`),
  reject: (id, reason) => axiosClient.post(`/api/Booking/${id}/reject`, { reason }),

  // Booking conflicts and availability
  checkAvailability: (data) => axiosClient.post('/api/Booking/check-availability', {
    vehicleId: data.vehicleId,
    startDateTime: data.startDateTime,
    endDateTime: data.endDateTime
  }),

  getConflicts: (data) => axiosClient.post('/api/Booking/conflicts', data),

  // Reports and statistics
  getBookingStatistics: (params) => axiosClient.get('/api/Booking/statistics', { params }),
  getUsageReport: (vehicleId, startDate, endDate) => axiosClient.get('/api/Booking/usage-report', {
    params: { vehicleId, startDate, endDate }
  }),

  // Notifications
  sendReminder: (id) => axiosClient.post(`/api/Booking/${id}/reminder`),

  // Booking history
  getBookingHistory: (params) => axiosClient.get('/api/Booking/history', { params }),

  // ===== README 07 COMPLIANCE - ADVANCED FEATURES =====

  // Calendar view - GET /calendar
  getCalendar: (params) => axiosClient.get('/api/booking/calendar', {
    params: {
      startDate: params.startDate,
      endDate: params.endDate,
      vehicleId: params.vehicleId,
      status: params.status
    }
  }),

  // Availability check - GET /availability
  getAvailability: (params) => axiosClient.get('/api/booking/availability', {
    params: {
      vehicleId: params.vehicleId,
      startTime: params.startTime,
      endTime: params.endTime
    }
  }),

  // Slot Request System
  requestSlot: (vehicleId, data) => axiosClient.post(`/api/booking/vehicle/${vehicleId}/request-slot`, {
    preferredStartTime: data.preferredStartTime,
    preferredEndTime: data.preferredEndTime,
    purpose: data.purpose,
    priority: data.priority,
    isFlexible: data.isFlexible,
    autoConfirmIfAvailable: data.autoConfirmIfAvailable,
    estimatedDistance: data.estimatedDistance,
    usageType: data.usageType,
    alternativeSlots: data.alternativeSlots
  }),

  // Get all slot requests for co-owner
  getSlotRequests: () => axiosClient.get('/api/booking/slot-requests'),

  // Respond to slot request - POST /slot-request/{requestId}/respond
  respondToSlotRequest: (requestId, data) => axiosClient.post(`/api/booking/slot-request/${requestId}/respond`, {
    isApproved: data.isApproved,
    rejectionReason: data.rejectionReason,
    suggestedStartTime: data.suggestedStartTime,
    suggestedEndTime: data.suggestedEndTime,
    notes: data.notes
  }),

  // Cancel slot request - POST /slot-request/{requestId}/cancel
  cancelSlotRequest: (requestId) => axiosClient.post(`/api/booking/slot-request/${requestId}/cancel`),

  // Get pending slot requests - GET /vehicle/{vehicleId}/pending-slot-requests
  getPendingSlotRequests: (vehicleId) => axiosClient.get(`/api/booking/vehicle/${vehicleId}/pending-slot-requests`),

  // Slot request analytics - GET /vehicle/{vehicleId}/slot-request-analytics
  getSlotRequestAnalytics: (vehicleId, params) => axiosClient.get(`/api/booking/vehicle/${vehicleId}/slot-request-analytics`, { params }),

  // Conflict Resolution
  resolveConflict: (bookingId, data) => axiosClient.post(`/api/booking/${bookingId}/resolve-conflict`, {
    isApproved: data.isApproved,
    resolutionType: data.resolutionType,
    useOwnershipWeighting: data.useOwnershipWeighting,
    priorityJustification: data.priorityJustification,
    rejectionReason: data.rejectionReason,
    enableAutoNegotiation: data.enableAutoNegotiation
  }),

  // Get pending conflicts - GET /pending-conflicts
  getPendingConflicts: () => axiosClient.get('/api/booking/pending-conflicts'),

  // Conflict analytics - GET /vehicle/{vehicleId}/conflict-analytics
  getConflictAnalytics: (vehicleId, params) => axiosClient.get(`/api/booking/vehicle/${vehicleId}/conflict-analytics`, {
    params: {
      startDate: params?.startDate,
      endDate: params?.endDate
    }
  }),

  // Modification & Cancellation
  modifyBooking: (bookingId, data) => axiosClient.post(`/api/booking/${bookingId}/modify`, {
    newStartTime: data.newStartTime,
    newEndTime: data.newEndTime,
    newPurpose: data.newPurpose,
    modificationReason: data.modificationReason,
    skipConflictCheck: data.skipConflictCheck,
    notifyAffectedCoOwners: data.notifyAffectedCoOwners,
    requestApprovalIfConflict: data.requestApprovalIfConflict
  }),

  // Enhanced cancellation - POST /{bookingId}/cancel-enhanced
  cancelBookingEnhanced: (bookingId, data) => axiosClient.post(`/api/booking/${bookingId}/cancel-enhanced`, {
    cancellationReason: data.cancellationReason,
    cancellationType: data.cancellationType,
    requestReschedule: data.requestReschedule,
    preferredRescheduleStart: data.preferredRescheduleStart,
    preferredRescheduleEnd: data.preferredRescheduleEnd,
    acceptCancellationFee: data.acceptCancellationFee
  }),

  // Validate modification - POST /validate-modification
  validateModification: (data) => axiosClient.post('/api/booking/validate-modification', {
    bookingId: data.bookingId,
    newStartTime: data.newStartTime,
    newEndTime: data.newEndTime,
    newPurpose: data.newPurpose
  }),

  // Modification history - GET /modification-history
  getModificationHistory: (params) => axiosClient.get('/api/booking/modification-history', {
    params: {
      bookingId: params?.bookingId,
      userId: params?.userId,
      startDate: params?.startDate,
      endDate: params?.endDate,
      status: params?.status
    }
  })
};

export default bookingApi;