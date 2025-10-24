import axiosClient from './axiosClient';

/**
 * BookingReminder API - README 13 Compliant Implementation
 * Handles booking reminder configuration and notifications
 * All endpoints follow exact README 13 specifications
 */

const bookingReminderApi = {
    // ===== README 13 COMPLIANCE - 5 ENDPOINTS =====

    // 1. Configure booking reminder - POST /api/booking-reminder/configure (README 13 compliant)
    configure: (data) => axiosClient.post('/api/booking-reminder/configure', {
        hoursBeforeBooking: data.hoursBeforeBooking || 24,
        enabled: data.enabled !== undefined ? data.enabled : true
    }),

    // 2. Get reminder preferences - GET /api/booking-reminder/preferences (README 13 compliant)
    getPreferences: () => axiosClient.get('/api/booking-reminder/preferences'),

    // 3. Get upcoming bookings - GET /api/booking-reminder/upcoming (README 13 compliant)
    getUpcomingBookings: (params) => axiosClient.get('/api/booking-reminder/upcoming', {
        params: {
            daysAhead: params?.daysAhead || 7
        }
    }),

    // 4. Send manual reminder - POST /api/booking-reminder/send/{bookingId} (README 13 compliant)
    sendManualReminder: (bookingId) => axiosClient.post(`/api/booking-reminder/send/${bookingId}`),

    // 5. Get reminder statistics (Admin) - GET /api/booking-reminder/statistics (README 13 compliant)
    getStatistics: () => axiosClient.get('/api/booking-reminder/statistics'),

    // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

    // Update reminder settings
    updateSettings: (settings) => axiosClient.put('/api/booking-reminder/preferences', {
        hoursBeforeBooking: settings.hoursBeforeBooking,
        enabled: settings.enabled,
        emailNotifications: settings.emailNotifications || true,
        pushNotifications: settings.pushNotifications || true,
        smsNotifications: settings.smsNotifications || false
    }),

    // Enable/disable reminders
    toggleReminders: (enabled) => axiosClient.patch('/api/booking-reminder/toggle', {
        enabled: enabled
    }),

    // Get reminder history for user
    getReminderHistory: (params) => axiosClient.get('/api/booking-reminder/history', {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 20,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            status: params?.status, // 'Sent', 'Delivered', 'Failed'
            sortBy: params?.sortBy || 'SentAt',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // Check if reminder can be sent
    canSendReminder: (bookingId) => axiosClient.get(`/api/booking-reminder/can-send/${bookingId}`),

    // Get reminders for specific vehicle
    getVehicleReminders: (vehicleId, params) => axiosClient.get(`/api/booking-reminder/vehicle/${vehicleId}/reminders`, {
        params: {
            status: params?.status,
            fromDate: params?.fromDate,
            toDate: params?.toDate
        }
    }),

    // Validate reminder configuration
    validateReminderConfig: (config) => {
        const errors = [];

        if (!config.hoursBeforeBooking || config.hoursBeforeBooking < 1) {
            errors.push('Hours before booking must be at least 1');
        }

        if (config.hoursBeforeBooking > 168) { // 7 days
            errors.push('Hours before booking cannot exceed 168 hours (7 days)');
        }

        if (config.enabled === undefined || config.enabled === null) {
            errors.push('Enabled status must be specified');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Format reminder data for display
    formatReminderData: (reminder) => ({
        id: reminder.reminderId || reminder.id,
        bookingId: reminder.bookingId,
        vehicleName: reminder.vehicleName,
        licensePlate: reminder.licensePlate,
        startTime: reminder.startTime,
        formattedStartTime: new Date(reminder.startTime).toLocaleString('vi-VN'),
        hoursUntilStart: reminder.hoursUntilStart,
        reminderSent: reminder.reminderSent,
        reminderSentAt: reminder.reminderSentAt,
        formattedReminderSentAt: reminder.reminderSentAt ?
            new Date(reminder.reminderSentAt).toLocaleString('vi-VN') : null,
        purpose: reminder.purpose,
        status: reminder.status,
        canSendManual: !reminder.reminderSent && reminder.hoursUntilStart > 0
    }),

    // Get reminder notification preferences
    getNotificationPreferences: () => axiosClient.get('/api/booking-reminder/notification-preferences'),

    // Update notification preferences
    updateNotificationPreferences: (preferences) => axiosClient.put('/api/booking-reminder/notification-preferences', {
        emailEnabled: preferences.emailEnabled || true,
        pushEnabled: preferences.pushEnabled || true,
        smsEnabled: preferences.smsEnabled || false,
        preferredTime: preferences.preferredTime, // e.g., "08:00" for 8 AM
        timeZone: preferences.timeZone || 'Asia/Ho_Chi_Minh'
    })
};

export default bookingReminderApi;