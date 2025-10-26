import axiosClient from './axiosClient';

/**
 * Contract API - README 15 Compliant Implementation  
 * Handles electronic contract management for co-ownership agreements
 * All endpoints follow exact README 15 specifications
// All endpoints updated to use capitalized controller names (e.g., /api/Contract) to match Swagger
 */

const contractApi = {
  // ===== README 15 COMPLIANCE - 11 ENDPOINTS =====

  // 1. Create electronic contract - POST /api/Contract (README 15 compliant)
  create: (data) => axiosClient.post('/api/Contract', {
    vehicleId: data.vehicleId,
    templateType: data.templateType,
    title: data.title,
    description: data.description,
    signatoryUserIds: data.signatoryUserIds,
    effectiveDate: data.effectiveDate,
    expiryDate: data.expiryDate,
    signatureDeadline: data.signatureDeadline,
    autoActivate: data.autoActivate !== undefined ? data.autoActivate : true,
    customTerms: data.customTerms,
    attachmentUrls: data.attachmentUrls
  }),

  // 2. Get contract details - GET /api/Contract/{contractId} (README 15 compliant)
  getById: (contractId) => axiosClient.get(`/api/Contract/${contractId}`),

  // 3. Get contracts list - GET /api/Contract (README 15 compliant)
  list: (params) => axiosClient.get('/api/Contract', {
    params: {
      vehicleId: params?.vehicleId,
      templateType: params?.templateType,
      status: params?.status,
      isCreator: params?.isCreator,
      isSignatory: params?.isSignatory,
      mySignatureStatus: params?.mySignatureStatus,
      createdFrom: params?.createdFrom,
      createdTo: params?.createdTo,
      activeOnly: params?.activeOnly,
      pendingMySignature: params?.pendingMySignature,
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 20,
      sortBy: params?.sortBy || 'CreatedAt',
      sortOrder: params?.sortOrder || 'desc'
    }
  }),

  // 4. Sign contract - POST /api/Contract/{contractId}/sign (README 15 compliant)
  sign: (contractId, data) => axiosClient.post(`/api/Contract/${contractId}/sign`, {
    signature: data.signature,
    ipAddress: data.ipAddress,
    deviceInfo: data.deviceInfo,
    geolocation: data.geolocation,
    agreementConfirmation: data.agreementConfirmation,
    signerNotes: data.signerNotes
  }),

  // 5. Decline contract - POST /api/Contract/{contractId}/decline (README 15 compliant)
  decline: (contractId, data) => axiosClient.post(`/api/Contract/${contractId}/decline`, {
    reason: data.reason,
    suggestedChanges: data.suggestedChanges
  }),

  // 6. Terminate contract - POST /api/Contract/{contractId}/terminate (README 15 compliant)
  terminate: (contractId, data) => axiosClient.post(`/api/Contract/${contractId}/terminate`, {
    reason: data.reason,
    effectiveDate: data.effectiveDate,
    notes: data.notes
  }),

  // 7. Get contract templates - GET /api/Contract/templates (README 15 compliant)
  getTemplates: () => axiosClient.get('/api/Contract/templates'),

  // 8. Get specific template - GET /api/Contract/templates/{templateType} (README 15 compliant)
  getTemplate: (templateType) => axiosClient.get(`/api/Contract/templates/${templateType}`),

  // 9. Download contract PDF - GET /api/Contract/{contractId}/download (README 15 compliant)
  download: (contractId) => axiosClient.get(`/api/Contract/${contractId}/download`, {
    responseType: 'blob'
  }),

  // 10. Get pending signature contracts - GET /api/Contract/pending-signature (README 15 compliant)
  getPendingSignature: () => axiosClient.get('/api/Contract/pending-signature'),

  // 11. Get signed contracts - GET /api/Contract/signed (README 15 compliant)
  getSigned: (params) => axiosClient.get('/api/Contract/signed', {
    params: {
      vehicleId: params?.vehicleId
    }
  }),

  // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

  // Validate contract data before creation
  validateContractData: (data) => {
    const errors = [];

    if (!data.vehicleId) {
      errors.push('Vehicle ID is required');
    }

    if (!data.templateType) {
      errors.push('Template type is required');
    }

    if (!data.title || data.title.trim().length < 5 || data.title.trim().length > 200) {
      errors.push('Title must be between 5 and 200 characters');
    }

    if (data.description && data.description.length > 2000) {
      errors.push('Description must be less than 2000 characters');
    }

    if (!data.signatoryUserIds || data.signatoryUserIds.length === 0) {
      errors.push('At least one signatory is required');
    }

    if (data.effectiveDate && new Date(data.effectiveDate) <= new Date()) {
      errors.push('Effective date must be in the future');
    }

    if (data.expiryDate && data.effectiveDate &&
      new Date(data.expiryDate) <= new Date(data.effectiveDate)) {
      errors.push('Expiry date must be after effective date');
    }

    if (data.signatureDeadline && new Date(data.signatureDeadline) <= new Date()) {
      errors.push('Signature deadline must be in the future');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate signature data
  validateSignatureData: (data) => {
    const errors = [];

    if (!data.signature || data.signature.length < 10) {
      errors.push('Valid signature is required (minimum 10 characters)');
    }

    if (data.ipAddress && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(data.ipAddress)) {
      errors.push('Invalid IP address format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Generate signature hash
  generateSignatureHash: (contractContent, userPrivateKey) => {
    // This should use proper cryptographic libraries in production
    const combinedData = contractContent + userPrivateKey + Date.now();
    return btoa(combinedData).substring(0, 64);
  },

  // Get contract status color for UI
  getStatusColor: (status) => {
    const statusColors = {
      'Draft': '#757575',
      'PendingSignatures': '#FF9800',
      'PartiallySigned': '#2196F3',
      'FullySigned': '#4CAF50',
      'Active': '#4CAF50',
      'Expired': '#F44336',
      'Terminated': '#9E9E9E',
      'Rejected': '#F44336'
    };
    return statusColors[status] || '#757575';
  },

  // Get template type display name
  getTemplateTypeDisplayName: (templateType) => {
    const displayNames = {
      'CoOwnershipAgreement': 'Thỏa thuận đồng sở hữu xe điện',
      'VehicleUsageAgreement': 'Thỏa thuận sử dụng xe',
      'CostSharingAgreement': 'Thỏa thuận chia sẻ chi phí',
      'MaintenanceAgreement': 'Hợp đồng bảo trì'
    };
    return displayNames[templateType] || templateType;
  },

  // Format contract for display
  formatContractForDisplay: (contract) => ({
    id: contract.contractId || contract.id,
    title: contract.title,
    templateType: contract.templateType,
    templateDisplayName: contractApi.getTemplateTypeDisplayName(contract.templateType),
    status: contract.status,
    statusColor: contractApi.getStatusColor(contract.status),
    vehicleName: contract.vehicleName,
    creatorName: contract.creatorName,
    myRole: contract.myRole,
    mySignatureStatus: contract.mySignatureStatus,
    totalSignatories: contract.totalSignatories,
    completedSignatures: contract.completedSignatures,
    signatureProgress: contract.totalSignatories > 0 ?
      (contract.completedSignatures / contract.totalSignatories) * 100 : 0,
    effectiveDate: contract.effectiveDate,
    formattedEffectiveDate: contract.effectiveDate ?
      new Date(contract.effectiveDate).toLocaleDateString('vi-VN') : null,
    expiryDate: contract.expiryDate,
    formattedExpiryDate: contract.expiryDate ?
      new Date(contract.expiryDate).toLocaleDateString('vi-VN') : null,
    signatureDeadline: contract.signatureDeadline,
    formattedSignatureDeadline: contract.signatureDeadline ?
      new Date(contract.signatureDeadline).toLocaleDateString('vi-VN') : null,
    daysUntilDeadline: contract.signatureDeadline ?
      Math.ceil((new Date(contract.signatureDeadline) - new Date()) / (1000 * 60 * 60 * 24)) : null,
    createdAt: contract.createdAt,
    formattedCreatedAt: contract.createdAt ?
      new Date(contract.createdAt).toLocaleString('vi-VN') : null,
    isUrgent: contract.signatureDeadline ?
      Math.ceil((new Date(contract.signatureDeadline) - new Date()) / (1000 * 60 * 60 * 24)) <= 7 : false
  }),

  // Calculate signature progress
  calculateSignatureProgress: (signatories) => {
    if (!signatories || signatories.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const completed = signatories.filter(s => s.signatureStatus === 'Signed').length;
    const total = signatories.length;
    const percentage = (completed / total) * 100;

    return { completed, total, percentage };
  },

  // Get contracts dashboard summary
  getDashboardSummary: () => axiosClient.get('/api/Contract/dashboard-summary'),

  // Search contracts
  searchContracts: (query, filters = {}) => axiosClient.get('/api/Contract/search', {
    params: {
      query: query,
      ...filters
    }
  }),

  // Get contract activity log
  getActivityLog: (contractId) => axiosClient.get(`/api/Contract/${contractId}/activity-log`),

  // Update contract (draft only)
  update: (contractId, data) => axiosClient.put(`/api/Contract/${contractId}`, data),

  // Delete contract (draft only)
  delete: (contractId) => axiosClient.delete(`/api/Contract/${contractId}`),

  // Send reminder to signatories
  sendSignatureReminder: (contractId, userIds) => axiosClient.post(`/api/Contract/${contractId}/send-reminder`, {
    userIds: userIds
  }),

  // Export contracts to Excel/PDF
  exportContracts: (filters, format = 'excel') => axiosClient.get('/api/Contract/export', {
    params: { ...filters, format },
    responseType: 'blob'
  })
};

export default contractApi;