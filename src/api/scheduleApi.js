import axiosClient from './axiosClient';

const scheduleApi = {
  // Schedule CRUD operations
  getAll: (params) => axiosClient.get('/api/Schedule', { params }),
  getById: (id) => axiosClient.get(`/api/Schedule/${id}`),
  create: (data) => axiosClient.post('/api/Schedule', {
    vehicleId: data.vehicleId,
    title: data.title,
    startDateTime: data.startDateTime,
    endDateTime: data.endDateTime,
    description: data.description,
    scheduleType: data.scheduleType, // 'Booking', 'Maintenance', 'Inspection', 'Other'
    priority: data.priority,
    isRecurring: data.isRecurring,
    recurrencePattern: data.recurrencePattern
  }),

  update: (id, data) => axiosClient.put(`/api/Schedule/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/Schedule/${id}`),

  // Schedule booking operations
  bookTimeSlot: (data) => axiosClient.post('/api/Schedule/book', {
    vehicleId: data.vehicleId,
    startDateTime: data.startDateTime,
    endDateTime: data.endDateTime,
    purpose: data.purpose,
    notes: data.notes
  }),

  // Schedule queries
  getVehicleSchedule: (vehicleId, params) => axiosClient.get(`/api/Schedule/vehicle/${vehicleId}`, {
    params
  }),

  getUserSchedule: (params) => axiosClient.get('/api/Schedule/user', { params }),

  getDailySchedule: (date) => axiosClient.get('/api/Schedule/daily', {
    params: { date }
  }),

  getWeeklySchedule: (startDate) => axiosClient.get('/api/Schedule/weekly', {
    params: { startDate }
  }),

  getMonthlySchedule: (year, month) => axiosClient.get('/api/Schedule/monthly', {
    params: { year, month }
  }),

  // Availability checking
  checkAvailability: (vehicleId, startDateTime, endDateTime) => axiosClient.post('/api/Schedule/availability', {
    vehicleId,
    startDateTime,
    endDateTime
  }),

  getAvailableTimeSlots: (vehicleId, date, duration) => axiosClient.get('/api/Schedule/available-slots', {
    params: { vehicleId, date, duration }
  }),

  // Schedule conflicts
  getConflicts: (data) => axiosClient.post('/api/Schedule/conflicts', data),
  resolveConflict: (conflictId, resolution) => axiosClient.post(`/api/Schedule/conflicts/${conflictId}/resolve`, {
    resolution
  }),

  // Recurring schedules
  createRecurringSchedule: (data) => axiosClient.post('/api/Schedule/recurring', data),
  updateRecurringSchedule: (id, data) => axiosClient.put(`/api/Schedule/recurring/${id}`, data),
  deleteRecurringSchedule: (id, deleteAll = false) => axiosClient.delete(`/api/Schedule/recurring/${id}`, {
    params: { deleteAll }
  }),

  // Schedule templates
  getTemplates: () => axiosClient.get('/api/Schedule/templates'),
  createTemplate: (data) => axiosClient.post('/api/Schedule/templates', data),
  applyTemplate: (templateId, data) => axiosClient.post(`/api/Schedule/templates/${templateId}/apply`, data),

  // Schedule notifications
  getUpcomingReminders: () => axiosClient.get('/api/Schedule/reminders'),
  setReminder: (scheduleId, reminderTime) => axiosClient.post(`/api/Schedule/${scheduleId}/reminder`, {
    reminderTime
  }),

  // Schedule reports
  getUsageReport: (params) => axiosClient.get('/api/Schedule/usage-report', { params }),
  getUtilizationStats: (vehicleId, startDate, endDate) => axiosClient.get('/api/Schedule/utilization', {
    params: { vehicleId, startDate, endDate }
  }),

  // Bulk operations
  bulkCreate: (schedules) => axiosClient.post('/api/Schedule/bulk-create', { schedules }),
  bulkUpdate: (updates) => axiosClient.put('/api/Schedule/bulk-update', { updates }),
  bulkDelete: (ids) => axiosClient.delete('/api/Schedule/bulk-delete', {
    data: { ids }
  })
};

export default scheduleApi;