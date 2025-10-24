import axiosClient from './axiosClient';

const vehicleUpgradeApi = {
  // 1. Đề Xuất Nâng Cấp Xe
  proposeUpgrade: (data) => {
    return axiosClient.post('/upgrade-vote/propose', data);
  },

  // 2. Bỏ Phiếu Cho Đề Xuất Nâng Cấp
  voteOnProposal: (proposalId, voteData) => {
    return axiosClient.post(`/upgrade-vote/${proposalId}/vote`, voteData);
  },

  // 3. Xem Chi Tiết Đề Xuất
  getProposalDetails: (proposalId) => {
    return axiosClient.get(`/upgrade-vote/${proposalId}`);
  },

  // 4. Lấy Danh Sách Đề Xuất Đang Chờ
  getPendingProposals: (vehicleId) => {
    return axiosClient.get(`/upgrade-vote/vehicle/${vehicleId}/pending`);
  },

  // 5. Đánh Dấu Đề Xuất Đã Thực Hiện
  executeProposal: (proposalId, executionData) => {
    return axiosClient.post(`/upgrade-vote/${proposalId}/execute`, executionData);
  },

  // 6. Hủy Đề Xuất
  cancelProposal: (proposalId) => {
    return axiosClient.delete(`/upgrade-vote/${proposalId}/cancel`);
  },

  // 7. Lịch Sử Bỏ Phiếu Cá Nhân
  getMyVotingHistory: () => {
    return axiosClient.get('/upgrade-vote/my-history');
  },

  // 8. Thống Kê Nâng Cấp Xe
  getVehicleUpgradeStatistics: (vehicleId) => {
    return axiosClient.get(`/upgrade-vote/vehicle/${vehicleId}/statistics`);
  },

  // Upgrade type mapping
  upgradeTypes: {
    0: { name: 'BatteryUpgrade', label: 'Nâng cấp pin', icon: '🔋', color: '#4caf50' },
    1: { name: 'InsurancePackage', label: 'Gói bảo hiểm', icon: '🛡️', color: '#2196f3' },
    2: { name: 'TechnologyUpgrade', label: 'Nâng cấp công nghệ', icon: '💻', color: '#9c27b0' },
    3: { name: 'InteriorUpgrade', label: 'Nâng cấp nội thất', icon: '🪑', color: '#ff9800' },
    4: { name: 'PerformanceUpgrade', label: 'Nâng cấp hiệu suất', icon: '⚡', color: '#f44336' },
    5: { name: 'SafetyUpgrade', label: 'Nâng cấp an toàn', icon: '🛡️', color: '#607d8b' },
    6: { name: 'Other', label: 'Nâng cấp khác', icon: '🔧', color: '#795548' }
  },

  // Status mapping
  statusTypes: {
    'Pending': { label: 'Đang chờ bỏ phiếu', color: '#ff9800', bgColor: '#fff3e0' },
    'Approved': { label: 'Đã phê duyệt', color: '#4caf50', bgColor: '#e8f5e8' },
    'Rejected': { label: 'Bị từ chối', color: '#f44336', bgColor: '#ffebee' },
    'Executed': { label: 'Đã thực hiện', color: '#2196f3', bgColor: '#e3f2fd' },
    'Cancelled': { label: 'Đã hủy', color: '#9e9e9e', bgColor: '#fafafa' }
  },

  // Helper functions
  getUpgradeTypeInfo: (upgradeType) => {
    if (typeof upgradeType === 'number') {
      return vehicleUpgradeApi.upgradeTypes[upgradeType] || vehicleUpgradeApi.upgradeTypes[6];
    }
    // If upgradeType is already a string name, find by name
    const typeEntry = Object.values(vehicleUpgradeApi.upgradeTypes).find(
      type => type.name === upgradeType
    );
    return typeEntry || vehicleUpgradeApi.upgradeTypes[6];
  },

  getStatusInfo: (status) => {
    return vehicleUpgradeApi.statusTypes[status] || {
      label: status,
      color: '#9e9e9e',
      bgColor: '#fafafa'
    };
  },

  // Validation functions
  validateProposalData: (data) => {
    const errors = [];
    
    if (!data.vehicleId) {
      errors.push('ID xe là bắt buộc');
    }
    
    if (data.upgradeType < 0 || data.upgradeType > 6) {
      errors.push('Loại nâng cấp không hợp lệ');
    }
    
    if (!data.title || data.title.trim().length < 5) {
      errors.push('Tiêu đề phải có ít nhất 5 ký tự');
    }
    
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Mô tả phải có ít nhất 10 ký tự');
    }
    
    if (!data.estimatedCost || data.estimatedCost <= 0) {
      errors.push('Chi phí ước tính phải lớn hơn 0');
    }
    
    if (!data.justification || data.justification.trim().length < 10) {
      errors.push('Lý do cần nâng cấp phải có ít nhất 10 ký tự');
    }
    
    if (data.proposedInstallationDate) {
      const installDate = new Date(data.proposedInstallationDate);
      const now = new Date();
      if (installDate <= now) {
        errors.push('Ngày lắp đặt phải trong tương lai');
      }
    }
    
    if (data.estimatedDurationDays && data.estimatedDurationDays <= 0) {
      errors.push('Thời gian ước tính phải lớn hơn 0');
    }
    
    return errors;
  },

  validateVoteData: (data) => {
    const errors = [];
    
    if (typeof data.isApprove !== 'boolean') {
      errors.push('Phải chọn đồng ý hoặc từ chối');
    }
    
    return errors;
  },

  validateExecutionData: (data) => {
    const errors = [];
    
    if (!data.actualCost || data.actualCost <= 0) {
      errors.push('Chi phí thực tế phải lớn hơn 0');
    }
    
    return errors;
  },

  // Format functions
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  },

  formatDate: (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatPercentage: (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  // Calculate voting progress
  calculateVotingProgress: (votingInfo) => {
    if (!votingInfo) return null;
    
    const { totalCoOwners, votedCount, approvedCount, rejectedCount } = votingInfo;
    const progressPercentage = (votedCount / totalCoOwners) * 100;
    const approvalPercentage = totalCoOwners > 0 ? (approvedCount / totalCoOwners) * 100 : 0;
    
    return {
      progressPercentage: Math.round(progressPercentage),
      approvalPercentage: Math.round(approvalPercentage),
      remainingVotes: totalCoOwners - votedCount,
      needsMoreVotes: approvedCount <= totalCoOwners / 2,
      hasRejection: rejectedCount > 0
    };
  },

  // Get days remaining for voting
  getDaysRemaining: (votingDeadline) => {
    if (!votingDeadline) return null;
    
    const deadline = new Date(votingDeadline);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  },

  // Format days remaining text
  formatDaysRemaining: (days) => {
    if (days === null || days === undefined) return 'Không xác định';
    if (days === 0) return 'Hết hạn';
    if (days === 1) return '1 ngày';
    return `${days} ngày`;
  },

  // Check if user can vote
  canUserVote: (proposal, currentUserId) => {
    if (!proposal || !proposal.votingInfo) return false;
    
    const { status, userHasVoted } = proposal.votingInfo;
    
    // Can only vote on pending proposals
    if (status !== 'Pending') return false;
    
    // Can't vote if already voted
    if (userHasVoted) return false;
    
    // Check if voting deadline passed
    if (proposal.votingInfo.votingDeadline) {
      const deadline = new Date(proposal.votingInfo.votingDeadline);
      if (new Date() > deadline) return false;
    }
    
    return true;
  },

  // Check if user can execute proposal
  canUserExecute: (proposal, currentUserId, isAdmin = false) => {
    if (!proposal) return false;
    
    const { status } = proposal.votingInfo || {};
    const { isExecuted } = proposal.executionInfo || {};
    
    // Can only execute approved, non-executed proposals
    if (status !== 'Approved' || isExecuted) return false;
    
    // Admin or proposer can execute
    if (isAdmin || (proposal.proposerInfo && proposal.proposerInfo.proposerId === currentUserId)) {
      return true;
    }
    
    return false;
  },

  // Check if user can cancel proposal
  canUserCancel: (proposal, currentUserId, isAdmin = false) => {
    if (!proposal) return false;
    
    const { status } = proposal.votingInfo || {};
    const { isExecuted } = proposal.executionInfo || {};
    
    // Can't cancel executed proposals
    if (isExecuted) return false;
    
    // Can only cancel pending or approved proposals
    if (!['Pending', 'Approved'].includes(status)) return false;
    
    // Admin or proposer can cancel
    if (isAdmin || (proposal.proposerInfo && proposal.proposerInfo.proposerId === currentUserId)) {
      return true;
    }
    
    return false;
  },

  // Prepare statistics chart data
  prepareStatisticsChartData: (statistics) => {
    if (!statistics) return null;
    
    const { upgradeTypeBreakdown } = statistics;
    if (!upgradeTypeBreakdown) return null;
    
    return {
      labels: upgradeTypeBreakdown.map(item => item.upgradeTypeName),
      datasets: [
        {
          label: 'Số lượng đề xuất',
          data: upgradeTypeBreakdown.map(item => item.count),
          backgroundColor: upgradeTypeBreakdown.map((_, index) => {
            const colors = ['#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#f44336', '#607d8b', '#795548'];
            return colors[index % colors.length];
          })
        }
      ]
    };
  },

  // Prepare cost statistics data
  prepareCostChartData: (statistics) => {
    if (!statistics || !statistics.upgradeTypeBreakdown) return null;
    
    const { upgradeTypeBreakdown } = statistics;
    
    return {
      labels: upgradeTypeBreakdown.map(item => item.upgradeTypeName),
      estimatedCosts: upgradeTypeBreakdown.map(item => item.totalCost),
      executedCosts: upgradeTypeBreakdown.map(item => item.executedCost),
      executionRates: upgradeTypeBreakdown.map(item => 
        item.count > 0 ? (item.executedCount / item.count) * 100 : 0
      )
    };
  },

  // Generate summary text for proposals
  generateProposalSummary: (proposal) => {
    if (!proposal) return '';
    
    const typeInfo = vehicleUpgradeApi.getUpgradeTypeInfo(proposal.upgradeType || proposal.upgradeTypeName);
    const cost = vehicleUpgradeApi.formatCurrency(proposal.estimatedCost);
    const status = vehicleUpgradeApi.getStatusInfo(proposal.status || proposal.votingInfo?.status);
    
    return `${typeInfo.label} - ${cost} - ${status.label}`;
  },

  // Sort proposals by priority
  sortProposalsByPriority: (proposals) => {
    if (!proposals || !Array.isArray(proposals)) return [];
    
    return proposals.sort((a, b) => {
      // Priority order: Pending (user can vote) > Approved > Pending (others) > Executed > Rejected/Cancelled
      const getPriority = (proposal) => {
        const status = proposal.status || proposal.votingInfo?.status;
        const userCanVote = proposal.votingInfo?.userCanVote;
        
        if (status === 'Pending' && userCanVote) return 1;
        if (status === 'Approved') return 2;
        if (status === 'Pending') return 3;
        if (status === 'Executed') return 4;
        return 5; // Rejected/Cancelled
      };
      
      const priorityA = getPriority(a);
      const priorityB = getPriority(b);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by date (newest first)
      const dateA = new Date(a.proposedAt || a.createdAt);
      const dateB = new Date(b.proposedAt || b.createdAt);
      return dateB - dateA;
    });
  }
};

export default vehicleUpgradeApi;