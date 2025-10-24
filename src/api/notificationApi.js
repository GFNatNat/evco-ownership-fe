import axiosClient from './axiosClient';

/**
 * Notification API - README 11 Compliant Implementation
 * Handles user notifications and admin notification management
 * All endpoints follow exact README 11 specifications
 */

const notificationApi = {
    // ===== README 11 COMPLIANCE - 7 ENDPOINTS =====

    // 1. Get notifications for current user - GET /api/notification (README 11 compliant)
    getNotifications: (params) => axiosClient.get('/api/notification', {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10,
            isRead: params?.isRead,
            notificationType: params?.notificationType,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            sortBy: params?.sortBy || 'CreatedAt',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // 2. Get my notifications with pagination - GET /api/notification/my-notifications (README 11 compliant)
    getMyNotifications: (params) => axiosClient.get('/api/notification/my-notifications', {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10,
            isRead: params?.isRead,
            notificationType: params?.notificationType,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            sortBy: params?.sortBy || 'CreatedAt',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // 3. Mark single notification as read - PUT /api/notification/{id}/read (README 11 compliant)
    markAsRead: (notificationId) => axiosClient.put(`/api/notification/${notificationId}/read`),

    // 4. Mark multiple notifications as read - PUT /api/notification/read-multiple (README 11 compliant)
    markMultipleRead: (notificationIds) => axiosClient.put('/api/notification/read-multiple', {
        notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
    }),

    // 5. Mark all notifications as read - PUT /api/notification/read-all (README 11 compliant)
    markAllRead: () => axiosClient.put('/api/notification/read-all'),

    // 6. Send notification to user (Admin only) - POST /api/notification/send-to-user (README 11 compliant)
    sendToUser: (data) => axiosClient.post('/api/notification/send-to-user', {
        userId: data.userId,
        title: data.title,
        message: data.message,
        notificationType: data.notificationType || 'General',
        priority: data.priority || 'Medium',
        relatedEntityId: data.relatedEntityId,
        relatedEntityType: data.relatedEntityType,
        scheduledSendTime: data.scheduledSendTime,
        isSystemGenerated: data.isSystemGenerated || false,
        actionUrl: data.actionUrl,
        expiryTime: data.expiryTime
    }),

    // 7. Create notification (Admin only) - POST /api/notification/create (README 11 compliant)
    createNotification: (data) => axiosClient.post('/api/notification/create', {
        title: data.title,
        message: data.message,
        notificationType: data.notificationType || 'General',
        priority: data.priority || 'Medium',
        targetUserIds: data.targetUserIds || [],
        targetRoles: data.targetRoles || [],
        isGlobal: data.isGlobal || false,
        relatedEntityId: data.relatedEntityId,
        relatedEntityType: data.relatedEntityType,
        scheduledSendTime: data.scheduledSendTime,
        expiryTime: data.expiryTime,
        actionUrl: data.actionUrl,
        isSystemGenerated: data.isSystemGenerated || false
    }),

    // ===== BACKWARD COMPATIBILITY METHODS =====

    // Legacy: Get unread count
    getUnreadCount: () => axiosClient.get('/api/notification/unread-count'),

    // Legacy: Mark notification as read (old method name)
    markNotificationAsRead: (userNotificationId) => axiosClient.put('/api/notification/mark-read', {
        userNotificationId: userNotificationId
    }),

    // Legacy: Mark multiple as read (old method name)
    markMultipleAsRead: (userNotificationIds) => axiosClient.put('/api/notification/mark-multiple-read', {
        userNotificationIds: userNotificationIds
    }),

    // Legacy: Mark all as read (old method name)
    markAllNotificationsAsRead: () => axiosClient.put('/api/notification/mark-all-read'),

    // Legacy: Send notification to user (old method name)
    sendNotificationToUser: (data) => axiosClient.post('/api/notification/send-to-user', {
        userId: data.userId,
        notificationType: data.notificationType,
        additionalData: data.additionalData
    }),

    // Delete notification
    delete: (id) => axiosClient.delete(`/api/Notification/${id}`),

    // Subscribe to push notifications (web push)
    subscribePush: (subscription) => axiosClient.post('/api/Notification/subscribe', subscription),

    // Unsubscribe from push notifications
    unsubscribePush: () => axiosClient.post('/api/Notification/unsubscribe'),

    // Send test notification (admin only)
    sendTest: (data) => axiosClient.post('/api/Notification/send-test', data),

    // ===== HELPER METHODS =====

    // Get notifications with filtering
    getNotificationsWithFilter: (filterOptions = {}) => {
        return notificationApi.getMyNotifications({
            pageIndex: filterOptions.page || 1,
            pageSize: filterOptions.limit || 20,
            includeRead: filterOptions.includeRead !== undefined ? filterOptions.includeRead : true
        });
    },

    // Batch mark notifications as read
    batchMarkAsRead: (notificationIds) => {
        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            throw new Error('Notification IDs must be a non-empty array');
        }

        if (notificationIds.length === 1) {
            return notificationApi.markNotificationAsRead(notificationIds[0]);
        }

        return notificationApi.markMultipleAsRead(notificationIds);
    },

    // Send system notification (Admin helper)
    sendSystemNotification: (userIds, message, additionalData = {}) => {
        return notificationApi.createNotification({
            notificationType: 'System',
            userIds: Array.isArray(userIds) ? userIds : [userIds],
            additionalData: JSON.stringify({ message, ...additionalData })
        });
    },

    // Send booking notification (Admin helper)
    sendBookingNotification: (userId, bookingId, vehicleId, additionalData = {}) => {
        return notificationApi.sendNotificationToUser({
            userId: userId,
            notificationType: 'Booking',
            additionalData: JSON.stringify({ bookingId, vehicleId, ...additionalData })
        });
    }
};

export default notificationApi;