import axiosClient from './axiosClient';

/**
 * OwnershipChange API
 * Handles vehicle ownership percentage changes within co-ownership groups
 * Following README 22 specifications
 */
const ownershipChangeApi = {
  // Base endpoint
  baseURL: '/api/ownership-change',

  /**
   * Propose ownership change
   * POST /propose
   */
  proposeChange: (changeData) => {
    const { vehicleId, reason, proposedChanges } = changeData;
    return axiosClient.post(`${ownershipChangeApi.baseURL}/propose`, {
      vehicleId,
      reason,
      proposedChanges
    });
  },

  /**
   * Get ownership change request details
   * GET /{requestId}
   */
  getRequestDetails: (requestId) => {
    return axiosClient.get(`${ownershipChangeApi.baseURL}/${requestId}`);
  },

  /**
   * Get vehicle ownership change requests
   * GET /vehicle/{vehicleId}
   */
  getVehicleRequests: (vehicleId, includeCompleted = false) => {
    return axiosClient.get(`${ownershipChangeApi.baseURL}/vehicle/${vehicleId}`, {
      params: { includeCompleted }
    });
  },

  /**
   * Get pending approvals for current user
   * GET /pending-approvals
   */
  getPendingApprovals: () => {
    return axiosClient.get(`${ownershipChangeApi.baseURL}/pending-approvals`);
  },

  /**
   * Approve or reject ownership change
   * POST /{requestId}/respond
   */
  respondToRequest: (requestId, responseData) => {
    const { approve, comments } = responseData;
    return axiosClient.post(`${ownershipChangeApi.baseURL}/${requestId}/respond`, {
      approve,
      comments
    });
  },

  /**
   * Cancel ownership change request
   * DELETE /{requestId}
   */
  cancelRequest: (requestId) => {
    return axiosClient.delete(`${ownershipChangeApi.baseURL}/${requestId}`);
  },

  /**
   * Get ownership change statistics (Admin/Staff only)
   * GET /statistics
   */
  getStatistics: () => {
    return axiosClient.get(`${ownershipChangeApi.baseURL}/statistics`);
  },

  /**
   * Get user's ownership change requests
   * GET /my-requests
   */
  getMyRequests: (includeCompleted = false) => {
    return axiosClient.get(`${ownershipChangeApi.baseURL}/my-requests`, {
      params: { includeCompleted }
    });
  },

  // Helper functions
  formatProposedChanges: (changes) => {
    return changes.map(change => ({
      coOwnerId: change.coOwnerId,
      proposedPercentage: parseFloat(change.proposedPercentage),
      proposedInvestment: parseFloat(change.proposedInvestment)
    }));
  },

  validateChangeProposal: (changeData) => {
    const { vehicleId, reason, proposedChanges } = changeData;
    const errors = [];

    if (!vehicleId) errors.push('Vehicle ID is required');
    if (!reason || reason.trim().length < 10) errors.push('Reason must be at least 10 characters');
    if (!proposedChanges || !Array.isArray(proposedChanges) || proposedChanges.length === 0) {
      errors.push('Proposed changes are required');
    } else {
      // Validate each change
      const totalPercentage = proposedChanges.reduce((sum, change) => sum + parseFloat(change.proposedPercentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        errors.push('Total ownership percentage must equal 100%');
      }
      
      proposedChanges.forEach((change, index) => {
        if (!change.coOwnerId) errors.push(`Co-owner ID is required for change ${index + 1}`);
        if (!change.proposedPercentage || change.proposedPercentage <= 0 || change.proposedPercentage > 100) {
          errors.push(`Valid ownership percentage (0-100) is required for change ${index + 1}`);
        }
        if (!change.proposedInvestment || change.proposedInvestment <= 0) {
          errors.push(`Valid investment amount is required for change ${index + 1}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format currency for display
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  },

  // Get status color for UI
  getStatusColor: (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'info';
    }
  }
};

export default ownershipChangeApi;