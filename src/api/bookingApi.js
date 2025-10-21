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
  getBookingHistory: (params) => axiosClient.get('/api/Booking/history', { params })
};

export default bookingApi;