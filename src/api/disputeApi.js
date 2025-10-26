import axiosClient from './axiosClient';

/**
 * Dispute API - README 17 Compliant Implementation
 * Manages disputes related to bookings, cost sharing, and group decisions
 * All endpoints follow exact README 17 specifications
// All endpoints updated to use capitalized controller names (e.g., /api/Dispute) to match Swagger
 */

const disputeApi = {
  // ===== README 17 COMPLIANCE - 8 ENDPOINTS =====

  // 1. Raise a booking dispute - POST /api/dispute/booking (README 17 compliant)
  raiseBookingDispute: (data) => axiosClient.post('/api/Dispute/booking', {
    bookingId: data.bookingId,
    vehicleId: data.vehicleId,
    title: data.title,
    description: data.description,
    priority: data.priority, // Low, Medium, High, Critical
    category: data.category, // Unauthorized, Cancellation, Damage, NoShow, etc.
    respondentUserIds: data.respondentUserIds,
    evidenceUrls: data.evidenceUrls || [],
    requestedResolution: data.requestedResolution
  }),

  // 2. Raise a cost sharing dispute - POST /api/dispute/cost-sharing (README 17 compliant)
  raiseCostSharingDispute: (data) => axiosClient.post('/api/Dispute/cost-sharing', {
    vehicleId: data.vehicleId,
    maintenanceCostId: data.maintenanceCostId,
    title: data.title,
    description: data.description,
    disputedAmount: data.disputedAmount,
    expectedAmount: data.expectedAmount,
    priority: data.priority,
    category: data.category, // UnfairSplit, WrongCalculation, etc.
    respondentUserIds: data.respondentUserIds,
    evidenceUrls: data.evidenceUrls || [],
    requestedResolution: data.requestedResolution
  }),

  // 3. Raise a group decision dispute - POST /api/dispute/group-decision (README 17 compliant)
  raiseGroupDecisionDispute: (data) => axiosClient.post('/api/Dispute/group-decision', {
    vehicleId: data.vehicleId,
    vehicleUpgradeProposalId: data.vehicleUpgradeProposalId,
    title: data.title,
    description: data.description,
    priority: data.priority,
    category: data.category, // VotingIrregularity, ProcessViolation, etc.
    violatedPolicy: data.violatedPolicy,
    respondentUserIds: data.respondentUserIds,
    evidenceUrls: data.evidenceUrls || [],
    requestedResolution: data.requestedResolution
  }),

  // 4. Get dispute by ID - GET /api/dispute/{disputeId} (README 17 compliant)
  getById: (disputeId) => axiosClient.get(`/api/Dispute/${disputeId}`),

  // 5. Get list of disputes - GET /api/dispute (README 17 compliant)
  list: (params) => axiosClient.get('/api/Dispute', {
    params: {
      vehicleId: params?.vehicleId,
      disputeType: params?.disputeType, // Booking, CostSharing, GroupDecision
      status: params?.status, // Open, UnderReview, Resolved, Rejected, Withdrawn
      priority: params?.priority, // Low, Medium, High, Critical
      isInitiator: params?.isInitiator,
      isRespondent: params?.isRespondent,
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 20,
      sortBy: params?.sortBy || 'CreatedDate',
      sortOrder: params?.sortOrder || 'desc'
    }
  }),

  // 6. Respond to a dispute - POST /api/dispute/{disputeId}/respond (README 17 compliant)
  respond: (disputeId, data) => axiosClient.post(`/api/Dispute/${disputeId}/respond`, {
    message: data.message,
    evidenceUrls: data.evidenceUrls || [],
    agreesWithDispute: data.agreesWithDispute,
    proposedSolution: data.proposedSolution
  }),

  // 7. Update dispute status (Admin) - PUT /api/dispute/{disputeId}/status (README 17 compliant)
  updateStatus: (disputeId, data) => axiosClient.put(`/api/Dispute/${disputeId}/status`, {
    status: data.status, // Open, UnderReview, Resolved, Rejected
    resolutionNotes: data.resolutionNotes,
    actionsRequired: data.actionsRequired
  }),

  // 8. Withdraw a dispute - POST /api/dispute/{disputeId}/withdraw (README 17 compliant)
  withdraw: (disputeId, data) => axiosClient.post(`/api/Dispute/${disputeId}/withdraw`, {
    reason: data.reason
  }),

  // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

  // Validate dispute data
  validateDisputeData: (data, disputeType) => {
    const errors = [];

    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters');
    }

    if (!data.description || data.description.trim().length < 20) {
      errors.push('Description must be at least 20 characters');
    }

    if (!data.priority || !['Low', 'Medium', 'High', 'Critical'].includes(data.priority)) {
      errors.push('Valid priority is required');
    }

    if (!data.category) {
      errors.push('Category is required');
    }

    if (!data.respondentUserIds || data.respondentUserIds.length === 0) {
      errors.push('At least one respondent is required');
    }

    if (!data.requestedResolution || data.requestedResolution.trim().length < 10) {
      errors.push('Requested resolution must be at least 10 characters');
    }

    // Specific validations by dispute type
    if (disputeType === 'booking' && !data.bookingId) {
      errors.push('Booking ID is required for booking disputes');
    }

    if (disputeType === 'cost-sharing') {
      if (!data.disputedAmount || data.disputedAmount <= 0) {
        errors.push('Disputed amount must be greater than 0');
      }
      if (!data.expectedAmount || data.expectedAmount < 0) {
        errors.push('Expected amount must be 0 or greater');
      }
    }

    if (disputeType === 'group-decision' && !data.vehicleUpgradeProposalId) {
      errors.push('Vehicle upgrade proposal ID is required for group decision disputes');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get dispute type display name
  getDisputeTypeDisplayName: (type) => {
    const types = {
      'Booking': 'Tranh chấp đặt xe',
      'CostSharing': 'Tranh chấp chia sẻ chi phí',
      'GroupDecision': 'Tranh chấp quyết định nhóm'
    };
    return types[type] || type;
  },

  // Get dispute status display name
  getDisputeStatusDisplayName: (status) => {
    const statuses = {
      'Open': 'Mở',
      'UnderReview': 'Đang xem xét',
      'Resolved': 'Đã giải quyết',
      'Rejected': 'Bị từ chối',
      'Withdrawn': 'Đã rút lại'
    };
    return statuses[status] || status;
  },

  // Get priority display name and color
  getPriorityConfig: (priority) => {
    const configs = {
      'Low': { name: 'Thấp', color: '#4CAF50', bgColor: '#E8F5E8' },
      'Medium': { name: 'Trung bình', color: '#FF9800', bgColor: '#FFF3E0' },
      'High': { name: 'Cao', color: '#F44336', bgColor: '#FFEBEE' },
      'Critical': { name: 'Khẩn cấp', color: '#D32F2F', bgColor: '#FFCDD2' }
    };
    return configs[priority] || { name: priority, color: '#757575', bgColor: '#F5F5F5' };
  },

  // Get category display name
  getCategoryDisplayName: (category, disputeType) => {
    const categories = {
      booking: {
        'Unauthorized': 'Sử dụng không được phép',
        'Cancellation': 'Vấn đề hủy đặt xe',
        'Damage': 'Hư hại trong quá trình sử dụng',
        'NoShow': 'Không đến nhận xe',
        'LateFee': 'Phí trễ hạn',
        'Other': 'Khác'
      },
      'cost-sharing': {
        'UnfairSplit': 'Chia sẻ chi phí không công bằng',
        'WrongCalculation': 'Tính toán sai',
        'UnapprovedExpense': 'Chi phí chưa được phê duyệt',
        'Other': 'Khác'
      },
      'group-decision': {
        'VotingIrregularity': 'Bất thường trong bỏ phiếu',
        'ProcessViolation': 'Vi phạm quy trình',
        'BiasedDecision': 'Quyết định thiên vị',
        'Other': 'Khác'
      }
    };

    const typeCategories = categories[disputeType?.toLowerCase()] || {};
    return typeCategories[category] || category;
  },

  // Format dispute for display
  formatDisputeForDisplay: (dispute) => ({
    id: dispute.disputeId || dispute.id,
    title: dispute.title,
    description: dispute.description,
    disputeType: dispute.disputeType,
    disputeTypeName: disputeApi.getDisputeTypeDisplayName(dispute.disputeType),
    status: dispute.status,
    statusName: disputeApi.getDisputeStatusDisplayName(dispute.status),
    priority: dispute.priority,
    priorityConfig: disputeApi.getPriorityConfig(dispute.priority),
    category: dispute.category,
    categoryName: disputeApi.getCategoryDisplayName(dispute.category, dispute.disputeType),
    initiatorName: dispute.initiatorName,
    respondentNames: dispute.respondentNames || [],
    vehicleName: dispute.vehicleName,
    createdAt: dispute.createdAt,
    formattedCreatedAt: dispute.createdAt ?
      new Date(dispute.createdAt).toLocaleString('vi-VN') : null,
    updatedAt: dispute.updatedAt,
    formattedUpdatedAt: dispute.updatedAt ?
      new Date(dispute.updatedAt).toLocaleString('vi-VN') : null,
    responseCount: dispute.responseCount || 0,
    evidenceCount: dispute.evidenceUrls?.length || 0,
    requestedResolution: dispute.requestedResolution,
    canRespond: dispute.canRespond || false,
    canWithdraw: dispute.canWithdraw || false,
    canUpdateStatus: dispute.canUpdateStatus || false,
    disputedAmount: dispute.disputedAmount,
    formattedDisputedAmount: dispute.disputedAmount ?
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(dispute.disputedAmount) : null
  }),

  // Get dispute categories by type
  getDisputeCategories: (disputeType) => {
    const categories = {
      booking: [
        { value: 'Unauthorized', label: 'Sử dụng không được phép' },
        { value: 'Cancellation', label: 'Vấn đề hủy đặt xe' },
        { value: 'Damage', label: 'Hư hại trong quá trình sử dụng' },
        { value: 'NoShow', label: 'Không đến nhận xe' },
        { value: 'LateFee', label: 'Phí trễ hạn' },
        { value: 'Other', label: 'Khác' }
      ],
      'cost-sharing': [
        { value: 'UnfairSplit', label: 'Chia sẻ chi phí không công bằng' },
        { value: 'WrongCalculation', label: 'Tính toán sai' },
        { value: 'UnapprovedExpense', label: 'Chi phí chưa được phê duyệt' },
        { value: 'Other', label: 'Khác' }
      ],
      'group-decision': [
        { value: 'VotingIrregularity', label: 'Bất thường trong bỏ phiếu' },
        { value: 'ProcessViolation', label: 'Vi phạm quy trình' },
        { value: 'BiasedDecision', label: 'Quyết định thiên vị' },
        { value: 'Other', label: 'Khác' }
      ]
    };

    return categories[disputeType?.toLowerCase()] || [];
  },

  // Get dispute priorities
  getDisputePriorities: () => [
    { value: 'Low', label: 'Thấp', color: '#4CAF50' },
    { value: 'Medium', label: 'Trung bình', color: '#FF9800' },
    { value: 'High', label: 'Cao', color: '#F44336' },
    { value: 'Critical', label: 'Khẩn cấp', color: '#D32F2F' }
  ]
};

export default disputeApi;