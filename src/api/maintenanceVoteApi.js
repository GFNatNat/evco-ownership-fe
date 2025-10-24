import axiosClient from './axiosClient';

/**
 * MaintenanceVote API - README 21 Compliant Implementation
 * Manages maintenance voting operations including proposals, voting, and approvals
 * All endpoints follow exact README 21 specifications
 */

const maintenanceVoteApi = {
  // ===== README 21 COMPLIANCE - 6 ENDPOINTS =====

  // 1. Propose maintenance expenditure - POST /api/maintenance-vote/propose (README 21 compliant)
  propose: (data) => axiosClient.post('/api/maintenance-vote/propose', {
    vehicleId: data.vehicleId,
    maintenanceCostId: data.maintenanceCostId,
    reason: data.reason,
    amount: data.amount,
    imageUrl: data.imageUrl
  }),

  // 2. Vote on proposal - POST /api/maintenance-vote/{fundUsageId}/vote (README 21 compliant)
  vote: (fundUsageId, data) => axiosClient.post(`/api/maintenance-vote/${fundUsageId}/vote`, {
    approve: data.approve, // true/false
    comments: data.comments
  }),

  // 3. Get proposal details - GET /api/maintenance-vote/{fundUsageId} (README 21 compliant)
  getProposalDetails: (fundUsageId) => axiosClient.get(`/api/maintenance-vote/${fundUsageId}`),

  // 4. Get pending proposals for vehicle - GET /api/maintenance-vote/vehicle/{vehicleId}/pending (README 21 compliant)
  getPendingProposals: (vehicleId, params) => axiosClient.get(`/api/maintenance-vote/vehicle/${vehicleId}/pending`, {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 20
    }
  }),

  // 5. Get user voting history - GET /api/maintenance-vote/my-voting-history (README 21 compliant)
  getMyVotingHistory: (params) => axiosClient.get('/api/maintenance-vote/my-voting-history', {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 20
    }
  }),

  // 6. Cancel proposal - DELETE /api/maintenance-vote/{fundUsageId}/cancel (README 21 compliant)
  cancelProposal: (fundUsageId, cancelReason) => axiosClient.delete(`/api/maintenance-vote/${fundUsageId}/cancel`, {
    data: { cancelReason }
  }),

  // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

  // Validate proposal data (README 21 compliant)
  validateProposalData: (data) => {
    const errors = [];
    
    if (!data.vehicleId || data.vehicleId <= 0) {
      errors.push('Vehicle ID is required');
    }
    
    if (!data.maintenanceCostId || data.maintenanceCostId <= 0) {
      errors.push('Maintenance cost ID is required');
    }
    
    if (!data.reason || data.reason.trim().length < 5) {
      errors.push('Reason must be at least 5 characters');
    }
    
    if (data.reason && data.reason.length > 500) {
      errors.push('Reason cannot exceed 500 characters');
    }
    
    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate vote data (README 21 compliant)
  validateVoteData: (data) => {
    const errors = [];
    
    if (data.approve === undefined || data.approve === null || typeof data.approve !== 'boolean') {
      errors.push('Vote decision (approve) is required and must be boolean');
    }
    
    if (!data.comments || data.comments.trim().length < 5) {
      errors.push('Comments must be at least 5 characters');
    }
    
    if (data.comments && data.comments.length > 500) {
      errors.push('Comments cannot exceed 500 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get maintenance type display name
  getMaintenanceTypeDisplayName: (type) => {
    const types = {
      0: 'Bảo dưỡng định kỳ',
      1: 'Sửa chữa khẩn cấp',
      2: 'Nâng cấp',
      3: 'Tùy chọn'
    };
    return types[type] || 'Không xác định';
  },

  // Get maintenance type with color and icon
  getMaintenanceTypeInfo: (type) => {
    const types = {
      0: { name: 'Bảo dưỡng định kỳ', color: '#4CAF50', bgColor: '#E8F5E8', icon: '🔧' },
      1: { name: 'Sửa chữa khẩn cấp', color: '#F44336', bgColor: '#FFEBEE', icon: '🚨' },
      2: { name: 'Nâng cấp', color: '#2196F3', bgColor: '#E3F2FD', icon: '⬆️' },
      3: { name: 'Tùy chọn', color: '#FF9800', bgColor: '#FFF3E0', icon: '💡' }
    };
    return types[type] || { name: 'Không xác định', color: '#757575', bgColor: '#F5F5F5', icon: '❓' };
  },

  // Get priority display name
  getPriorityDisplayName: (priority) => {
    const priorities = {
      0: 'Thấp',
      1: 'Trung bình', 
      2: 'Cao',
      3: 'Khẩn cấp'
    };
    return priorities[priority] || 'Không xác định';
  },

  // Get priority with color and icon
  getPriorityInfo: (priority) => {
    const priorities = {
      0: { name: 'Thấp', color: '#4CAF50', bgColor: '#E8F5E8', icon: '🟢' },
      1: { name: 'Trung bình', color: '#FF9800', bgColor: '#FFF3E0', icon: '🟡' },
      2: { name: 'Cao', color: '#FF5722', bgColor: '#FFF3E0', icon: '🟠' },
      3: { name: 'Khẩn cấp', color: '#F44336', bgColor: '#FFEBEE', icon: '🔴' }
    };
    return priorities[priority] || { name: 'Không xác định', color: '#757575', bgColor: '#F5F5F5', icon: '❓' };
  },

  // Get vote decision display name
  getVoteDecisionDisplayName: (decision) => {
    const decisions = {
      0: 'Từ chối',
      1: 'Đồng ý',
      2: 'Có điều kiện'
    };
    return decisions[decision] || 'Không xác định';
  },

  // Get vote decision with color and icon
  getVoteDecisionInfo: (decision) => {
    const decisions = {
      0: { name: 'Từ chối', color: '#F44336', bgColor: '#FFEBEE', icon: '❌' },
      1: { name: 'Đồng ý', color: '#4CAF50', bgColor: '#E8F5E8', icon: '✅' },
      2: { name: 'Có điều kiện', color: '#FF9800', bgColor: '#FFF3E0', icon: '⚠️' }
    };
    return decisions[decision] || { name: 'Không xác định', color: '#757575', bgColor: '#F5F5F5', icon: '❓' };
  },

  // Get proposal status display name
  getProposalStatusDisplayName: (status) => {
    const statuses = {
      0: 'Đang chờ',
      1: 'Được duyệt',
      2: 'Bị từ chối',
      3: 'Hết hạn',
      4: 'Đã hủy'
    };
    return statuses[status] || 'Không xác định';
  },

  // Get proposal status with color and icon
  getProposalStatusInfo: (status) => {
    const statuses = {
      0: { name: 'Đang chờ', color: '#FF9800', bgColor: '#FFF3E0', icon: '⏳' },
      1: { name: 'Được duyệt', color: '#4CAF50', bgColor: '#E8F5E8', icon: '✅' },
      2: { name: 'Bị từ chối', color: '#F44336', bgColor: '#FFEBEE', icon: '❌' },
      3: { name: 'Hết hạn', color: '#9E9E9E', bgColor: '#F5F5F5', icon: '⏰' },
      4: { name: 'Đã hủy', color: '#607D8B', bgColor: '#ECEFF1', icon: '🚫' }
    };
    return statuses[status] || { name: 'Không xác định', color: '#757575', bgColor: '#F5F5F5', icon: '❓' };
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  },

  // Format proposal for display
  formatProposalForDisplay: (proposal) => {
    if (!proposal) return null;
    
    const maintenanceTypeInfo = maintenanceVoteApi.getMaintenanceTypeInfo(proposal.maintenanceType);
    const priorityInfo = maintenanceVoteApi.getPriorityInfo(proposal.priority);
    const statusInfo = maintenanceVoteApi.getProposalStatusInfo(proposal.proposalStatus);
    
    return {
      ...proposal,
      maintenanceTypeInfo,
      priorityInfo,
      statusInfo,
      formattedEstimatedCost: maintenanceVoteApi.formatCurrency(proposal.estimatedCost),
      formattedCreatedAt: proposal.createdAt ? new Date(proposal.createdAt).toLocaleString('vi-VN') : null,
      formattedProposedDate: proposal.proposedDate ? new Date(proposal.proposedDate).toLocaleDateString('vi-VN') : null,
      formattedDeadline: proposal.votingDeadline ? new Date(proposal.votingDeadline).toLocaleString('vi-VN') : null,
      isExpired: proposal.votingDeadline ? new Date(proposal.votingDeadline) < new Date() : false,
      daysUntilDeadline: proposal.votingDeadline ? Math.max(0, Math.ceil((new Date(proposal.votingDeadline) - new Date()) / (1000 * 60 * 60 * 24))) : null
    };
  },

  // Format vote for display
  formatVoteForDisplay: (vote) => {
    if (!vote) return null;
    
    const decisionInfo = maintenanceVoteApi.getVoteDecisionInfo(vote.voteDecision);
    
    return {
      ...vote,
      decisionInfo,
      formattedCreatedAt: vote.createdAt ? new Date(vote.createdAt).toLocaleString('vi-VN') : null,
      voteDecisionName: maintenanceVoteApi.getVoteDecisionDisplayName(vote.voteDecision)
    };
  },

  // Calculate voting statistics
  calculateVotingStatistics: (votes) => {
    if (!votes || !votes.length) {
      return {
        totalVotes: 0,
        approveVotes: 0,
        rejectVotes: 0,
        conditionalVotes: 0,
        approvePercentage: 0,
        rejectPercentage: 0,
        conditionalPercentage: 0,
        consensusLevel: 'Unknown'
      };
    }

    const totalVotes = votes.length;
    const approveVotes = votes.filter(v => v.voteDecision === 1).length;
    const rejectVotes = votes.filter(v => v.voteDecision === 0).length;
    const conditionalVotes = votes.filter(v => v.voteDecision === 2).length;

    const approvePercentage = (approveVotes / totalVotes) * 100;
    const rejectPercentage = (rejectVotes / totalVotes) * 100;
    const conditionalPercentage = (conditionalVotes / totalVotes) * 100;

    let consensusLevel;
    if (approvePercentage >= 75) {
      consensusLevel = 'Strong Approval';
    } else if (approvePercentage >= 60) {
      consensusLevel = 'Majority Approval';
    } else if (rejectPercentage >= 60) {
      consensusLevel = 'Majority Rejection';
    } else {
      consensusLevel = 'Mixed Opinion';
    }

    return {
      totalVotes,
      approveVotes,
      rejectVotes,
      conditionalVotes,
      approvePercentage,
      rejectPercentage,
      conditionalPercentage,
      consensusLevel,
      formattedApprovePercentage: `${approvePercentage.toFixed(1)}%`,
      formattedRejectPercentage: `${rejectPercentage.toFixed(1)}%`,
      formattedConditionalPercentage: `${conditionalPercentage.toFixed(1)}%`
    };
  },

  // Get maintenance types for dropdown
  getMaintenanceTypes: () => [
    { value: 0, label: 'Bảo dưỡng định kỳ', color: '#4CAF50', icon: '🔧' },
    { value: 1, label: 'Sửa chữa khẩn cấp', color: '#F44336', icon: '🚨' },
    { value: 2, label: 'Nâng cấp', color: '#2196F3', icon: '⬆️' },
    { value: 3, label: 'Tùy chọn', color: '#FF9800', icon: '💡' }
  ],

  // Get priorities for dropdown
  getPriorities: () => [
    { value: 0, label: 'Thấp', color: '#4CAF50', icon: '🟢' },
    { value: 1, label: 'Trung bình', color: '#FF9800', icon: '🟡' },
    { value: 2, label: 'Cao', color: '#FF5722', icon: '🟠' },
    { value: 3, label: 'Khẩn cấp', color: '#F44336', icon: '🔴' }
  ],

  // Get vote decisions for dropdown
  getVoteDecisions: () => [
    { value: 0, label: 'Từ chối', color: '#F44336', icon: '❌' },
    { value: 1, label: 'Đồng ý', color: '#4CAF50', icon: '✅' },
    { value: 2, label: 'Có điều kiện', color: '#FF9800', icon: '⚠️' }
  ],

  // Get proposal statuses for filtering
  getProposalStatuses: () => [
    { value: 0, label: 'Đang chờ', color: '#FF9800', icon: '⏳' },
    { value: 1, label: 'Được duyệt', color: '#4CAF50', icon: '✅' },
    { value: 2, label: 'Bị từ chối', color: '#F44336', icon: '❌' },
    { value: 3, label: 'Hết hạn', color: '#9E9E9E', icon: '⏰' },
    { value: 4, label: 'Đã hủy', color: '#607D8B', icon: '🚫' }
  ],

  // Check if user can vote on proposal
  canUserVote: (proposal, currentUserId) => {
    if (!proposal || !currentUserId) return { canVote: false, reason: 'Invalid data' };
    
    // Check if proposal is still pending
    if (proposal.proposalStatus !== 0) {
      return { canVote: false, reason: 'Proposal is no longer pending' };
    }
    
    // Check if deadline has passed
    if (proposal.votingDeadline && new Date(proposal.votingDeadline) < new Date()) {
      return { canVote: false, reason: 'Voting deadline has passed' };
    }
    
    // Check if user has already voted
    if (proposal.votes && proposal.votes.some(vote => vote.coOwnerId === currentUserId)) {
      return { canVote: false, reason: 'User has already voted' };
    }
    
    // Check if user is the proposer (usually proposers cannot vote on their own proposals)
    if (proposal.proposerId === currentUserId) {
      return { canVote: false, reason: 'Proposer cannot vote on their own proposal' };
    }
    
    return { canVote: true, reason: 'User can vote' };
  },

  // Check if user can edit/cancel proposal
  canUserEditProposal: (proposal, currentUserId) => {
    if (!proposal || !currentUserId) return { canEdit: false, reason: 'Invalid data' };
    
    // Only proposer can edit
    if (proposal.proposerId !== currentUserId) {
      return { canEdit: false, reason: 'Only proposer can edit' };
    }
    
    // Cannot edit if not pending
    if (proposal.proposalStatus !== 0) {
      return { canEdit: false, reason: 'Cannot edit non-pending proposals' };
    }
    
    // Cannot edit if votes have been cast
    if (proposal.votes && proposal.votes.length > 0) {
      return { canEdit: false, reason: 'Cannot edit proposal with existing votes' };
    }
    
    return { canEdit: true, reason: 'User can edit proposal' };
  },

  // Generate proposal summary for notifications
  generateProposalSummary: (proposal) => {
    if (!proposal) return '';
    
    const typeInfo = maintenanceVoteApi.getMaintenanceTypeInfo(proposal.maintenanceType);
    const priorityInfo = maintenanceVoteApi.getPriorityInfo(proposal.priority);
    const formattedCost = maintenanceVoteApi.formatCurrency(proposal.estimatedCost);
    
    return `${typeInfo.icon} ${proposal.title}\n💰 Chi phí ước tính: ${formattedCost}\n${priorityInfo.icon} Độ ưu tiên: ${priorityInfo.name}`;
  }
};

export default maintenanceVoteApi;