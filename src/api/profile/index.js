// Profile-specific API endpoints
import axiosClient from '../axiosClient';

const profileApi = {
  // Profile Management
  profile: {
    get: () => axiosClient.get('/api/profile'),
    update: (profileData) => axiosClient.put('/api/profile', profileData),
    updateAvatar: (avatarFile) => {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      return axiosClient.put('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    uploadDocument: (documentType, file) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);
      return axiosClient.post('/api/profile/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    getDocuments: () => axiosClient.get('/api/profile/documents'),
    deleteDocument: (documentId) => axiosClient.delete(`/api/profile/documents/${documentId}`)
  },

  // Account Settings
  settings: {
    get: () => axiosClient.get('/api/profile/settings'),
    update: (settings) => axiosClient.put('/api/profile/settings', settings),
    getNotificationPreferences: () => axiosClient.get('/api/profile/settings/notifications'),
    updateNotificationPreferences: (preferences) => axiosClient.put('/api/profile/settings/notifications', preferences),
    getPrivacySettings: () => axiosClient.get('/api/profile/settings/privacy'),
    updatePrivacySettings: (privacy) => axiosClient.put('/api/profile/settings/privacy', privacy)
  },

  // Security Management
  security: {
    changePassword: (currentPassword, newPassword) => axiosClient.post('/api/profile/security/change-password', {
      currentPassword,
      newPassword
    }),
    enable2FA: () => axiosClient.post('/api/profile/security/2fa/enable'),
    disable2FA: (code) => axiosClient.post('/api/profile/security/2fa/disable', { code }),
    verify2FA: (code) => axiosClient.post('/api/profile/security/2fa/verify', { code }),
    getBackupCodes: () => axiosClient.get('/api/profile/security/backup-codes'),
    regenerateBackupCodes: () => axiosClient.post('/api/profile/security/backup-codes/regenerate'),
    getLoginHistory: () => axiosClient.get('/api/profile/security/login-history'),
    getActiveSessions: () => axiosClient.get('/api/profile/security/sessions'),
    revokeSession: (sessionId) => axiosClient.delete(`/api/profile/security/sessions/${sessionId}`)
  },

  // Notification Management
  notifications: {
    get: (page = 1, limit = 20) => axiosClient.get(`/api/profile/notifications?page=${page}&limit=${limit}`),
    markAsRead: (notificationId) => axiosClient.patch(`/api/profile/notifications/${notificationId}/read`),
    markAllAsRead: () => axiosClient.patch('/api/profile/notifications/read-all'),
    delete: (notificationId) => axiosClient.delete(`/api/profile/notifications/${notificationId}`),
    deleteAll: () => axiosClient.delete('/api/profile/notifications'),
    getUnreadCount: () => axiosClient.get('/api/profile/notifications/unread-count')
  },

  // Activity History
  activity: {
    getHistory: (page = 1, limit = 20, type = null) => {
      const params = new URLSearchParams({ page, limit });
      if (type) params.append('type', type);
      return axiosClient.get(`/api/profile/activity?${params}`);
    },
    getActivityTypes: () => axiosClient.get('/api/profile/activity/types'),
    exportActivity: (startDate, endDate) => axiosClient.get('/api/profile/activity/export', {
      params: { startDate, endDate },
      responseType: 'blob'
    })
  },

  // Account Verification
  verification: {
    getStatus: () => axiosClient.get('/api/profile/verification/status'),
    submitVerification: (verificationType, documents) => {
      const formData = new FormData();
      formData.append('type', verificationType);
      documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
      return axiosClient.post('/api/profile/verification/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    getVerificationHistory: () => axiosClient.get('/api/profile/verification/history')
  },

  // Data Export & Privacy
  data: {
    exportPersonalData: () => axiosClient.get('/api/profile/data/export', {
      responseType: 'blob'
    }),
    requestDataDeletion: (reason) => axiosClient.post('/api/profile/data/delete-request', { reason }),
    getDataUsage: () => axiosClient.get('/api/profile/data/usage'),
    downloadDataArchive: (archiveId) => axiosClient.get(`/api/profile/data/archives/${archiveId}`, {
      responseType: 'blob'
    })
  },

  // Connected Accounts
  connections: {
    getConnectedAccounts: () => axiosClient.get('/api/profile/connections'),
    connectAccount: (provider, authCode) => axiosClient.post('/api/profile/connections/connect', {
      provider,
      authCode
    }),
    disconnectAccount: (connectionId) => axiosClient.delete(`/api/profile/connections/${connectionId}`),
    refreshConnection: (connectionId) => axiosClient.post(`/api/profile/connections/${connectionId}/refresh`)
  }
};

export default profileApi;