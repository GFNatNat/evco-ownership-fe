// Profile-specific API endpoints
import axiosClient from '../axiosClient';

const profileApi = {
  // Profile Management
  profile: {
    get: () => axiosClient.get('/api/Profile'),
    update: (profileData) => axiosClient.put('/api/Profile', profileData),
    updateAvatar: (avatarFile) => {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      return axiosClient.put('/api/Profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    uploadDocument: (documentType, file) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);
      return axiosClient.post('/api/Profile/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    getDocuments: () => axiosClient.get('/api/Profile/documents'),
    deleteDocument: (documentId) => axiosClient.delete(`/api/Profile/documents/${documentId}`)
  },

  // Account Settings
  settings: {
    get: () => axiosClient.get('/api/Profile/settings'),
    update: (settings) => axiosClient.put('/api/Profile/settings', settings),
    getNotificationPreferences: () => axiosClient.get('/api/Profile/settings/notifications'),
    updateNotificationPreferences: (preferences) => axiosClient.put('/api/Profile/settings/notifications', preferences),
    getPrivacySettings: () => axiosClient.get('/api/Profile/settings/privacy'),
    updatePrivacySettings: (privacy) => axiosClient.put('/api/Profile/settings/privacy', privacy)
  },

  // Security Management
  security: {
    changePassword: (currentPassword, newPassword) => axiosClient.post('/api/Profile/security/change-password', {
      currentPassword,
      newPassword
    }),
    enable2FA: () => axiosClient.post('/api/Profile/security/2fa/enable'),
    disable2FA: (code) => axiosClient.post('/api/Profile/security/2fa/disable', { code }),
    verify2FA: (code) => axiosClient.post('/api/Profile/security/2fa/verify', { code }),
    getBackupCodes: () => axiosClient.get('/api/Profile/security/backup-codes'),
    regenerateBackupCodes: () => axiosClient.post('/api/Profile/security/backup-codes/regenerate'),
    getLoginHistory: () => axiosClient.get('/api/Profile/security/login-history'),
    getActiveSessions: () => axiosClient.get('/api/Profile/security/sessions'),
    revokeSession: (sessionId) => axiosClient.delete(`/api/Profile/security/sessions/${sessionId}`)
  },

  // Notification Management
  notifications: {
    get: (page = 1, limit = 20) => axiosClient.get(`/api/Profile/notifications?page=${page}&limit=${limit}`),
    markAsRead: (notificationId) => axiosClient.patch(`/api/Profile/notifications/${notificationId}/read`),
    markAllAsRead: () => axiosClient.patch('/api/Profile/notifications/read-all'),
    delete: (notificationId) => axiosClient.delete(`/api/Profile/notifications/${notificationId}`),
    deleteAll: () => axiosClient.delete('/api/Profile/notifications'),
    getUnreadCount: () => axiosClient.get('/api/Profile/notifications/unread-count')
  },

  // Activity History
  activity: {
    getHistory: (page = 1, limit = 20, type = null) => {
      const params = new URLSearchParams({ page, limit });
      if (type) params.append('type', type);
      return axiosClient.get(`/api/Profile/activity?${params}`);
    },
    getActivityTypes: () => axiosClient.get('/api/Profile/activity/types'),
    exportActivity: (startDate, endDate) => axiosClient.get('/api/Profile/activity/export', {
      params: { startDate, endDate },
      responseType: 'blob'
    })
  },

  // Account Verification
  verification: {
    getStatus: () => axiosClient.get('/api/Profile/verification/status'),
    submitVerification: (verificationType, documents) => {
      const formData = new FormData();
      formData.append('type', verificationType);
      documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
      return axiosClient.post('/api/Profile/verification/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    getVerificationHistory: () => axiosClient.get('/api/Profile/verification/history')
  },

  // Data Export & Privacy
  data: {
    exportPersonalData: () => axiosClient.get('/api/Profile/data/export', {
      responseType: 'blob'
    }),
    requestDataDeletion: (reason) => axiosClient.post('/api/Profile/data/delete-request', { reason }),
    getDataUsage: () => axiosClient.get('/api/Profile/data/usage'),
    downloadDataArchive: (archiveId) => axiosClient.get(`/api/Profile/data/archives/${archiveId}`, {
      responseType: 'blob'
    })
  },

  // Connected Accounts
  connections: {
    getConnectedAccounts: () => axiosClient.get('/api/Profile/connections'),
    connectAccount: (provider, authCode) => axiosClient.post('/api/Profile/connections/connect', {
      provider,
      authCode
    }),
    disconnectAccount: (connectionId) => axiosClient.delete(`/api/Profile/connections/${connectionId}`),
    refreshConnection: (connectionId) => axiosClient.post(`/api/Profile/connections/${connectionId}/refresh`)
  }
};

export default profileApi;