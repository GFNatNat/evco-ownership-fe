import axiosClient from './axiosClient';

const notificationApi = {
    // Get notifications for current user
    getNotifications: (params) => axiosClient.get('/api/Notification', { params }),

    // Mark notification as read
    markAsRead: (id) => axiosClient.put(`/api/Notification/${id}/read`),

    // Mark all notifications as read
    markAllAsRead: () => axiosClient.put('/api/Notification/read-all'),

    // Delete notification
    delete: (id) => axiosClient.delete(`/api/Notification/${id}`),

    // Get unread count
    getUnreadCount: () => axiosClient.get('/api/Notification/unread-count'),

    // Subscribe to push notifications (web push)
    subscribePush: (subscription) => axiosClient.post('/api/Notification/subscribe', subscription),

    // Unsubscribe from push notifications
    unsubscribePush: () => axiosClient.post('/api/Notification/unsubscribe'),

    // Send test notification (admin only)
    sendTest: (data) => axiosClient.post('/api/Notification/send-test', data),
};

export default notificationApi;