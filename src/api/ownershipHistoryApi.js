import axiosClient from './axiosClient';

/**
 * OwnershipHistory API
 * Provides endpoints to track and retrieve history of ownership changes
 * Following README 23 specifications
 */
const ownershipHistoryApi = {
  // Base endpoint
  baseURL: '/api/ownershiphistory',

  /**
   * Get vehicle ownership history
   * GET /vehicle/{vehicleId}
   */
  getVehicleHistory: (vehicleId, filters = {}) => {
    const { changeType, startDate, endDate, coOwnerId, offset = 0, limit = 50 } = filters;
    
    const params = { offset, limit };
    if (changeType) params.changeType = changeType;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (coOwnerId) params.coOwnerId = coOwnerId;

    return axiosClient.get(`${ownershipHistoryApi.baseURL}/vehicle/${vehicleId}`, {
      params
    });
  },

  /**
   * Get vehicle ownership timeline
   * GET /vehicle/{vehicleId}/timeline
   */
  getVehicleTimeline: (vehicleId) => {
    return axiosClient.get(`${ownershipHistoryApi.baseURL}/vehicle/${vehicleId}/timeline`);
  },

  /**
   * Get ownership snapshot at specific date
   * GET /vehicle/{vehicleId}/snapshot
   */
  getOwnershipSnapshot: (vehicleId, date) => {
    return axiosClient.get(`${ownershipHistoryApi.baseURL}/vehicle/${vehicleId}/snapshot`, {
      params: { date }
    });
  },

  /**
   * Get ownership history statistics
   * GET /vehicle/{vehicleId}/statistics
   */
  getVehicleStatistics: (vehicleId) => {
    return axiosClient.get(`${ownershipHistoryApi.baseURL}/vehicle/${vehicleId}/statistics`);
  },

  /**
   * Get co-owner's complete ownership history
   * GET /my-history
   */
  getMyHistory: () => {
    return axiosClient.get(`${ownershipHistoryApi.baseURL}/my-history`);
  },

  // Helper functions for filtering and formatting
  
  /**
   * Available change types for filtering
   */
  getChangeTypes: () => [
    { value: 'Initial', label: 'Khởi tạo ban đầu' },
    { value: 'Adjustment', label: 'Điều chỉnh tỷ lệ' },
    { value: 'Transfer', label: 'Chuyển nhượng' },
    { value: 'Exit', label: 'Rút khỏi nhóm' },
    { value: 'Investment', label: 'Đầu tư thêm' },
    { value: 'Correction', label: 'Sửa lỗi' }
  ],

  /**
   * Validate history filters
   */
  validateFilters: (filters) => {
    const errors = [];
    const { startDate, endDate, offset, limit } = filters;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        errors.push('Start date must be before end date');
      }
    }

    if (offset !== undefined && (offset < 0 || !Number.isInteger(offset))) {
      errors.push('Offset must be a non-negative integer');
    }

    if (limit !== undefined && (limit < 1 || limit > 100 || !Number.isInteger(limit))) {
      errors.push('Limit must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format history record for display
   */
  formatHistoryRecord: (record) => {
    return {
      ...record,
      formattedDate: new Date(record.changeDate).toLocaleString('vi-VN'),
      formattedOldPercentage: `${record.oldPercentage?.toFixed(2)}%`,
      formattedNewPercentage: `${record.newPercentage?.toFixed(2)}%`,
      formattedInvestmentChange: ownershipHistoryApi.formatCurrency(record.investmentChange),
      changeTypeLabel: ownershipHistoryApi.getChangeTypeLabel(record.changeType)
    };
  },

  /**
   * Get change type label in Vietnamese
   */
  getChangeTypeLabel: (changeType) => {
    const types = ownershipHistoryApi.getChangeTypes();
    const type = types.find(t => t.value === changeType);
    return type ? type.label : changeType;
  },

  /**
   * Format currency for display
   */
  formatCurrency: (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  /**
   * Format percentage for display
   */
  formatPercentage: (percentage) => {
    if (percentage === null || percentage === undefined) return 'N/A';
    return `${percentage.toFixed(2)}%`;
  },

  /**
   * Calculate ownership change impact
   */
  calculateChangeImpact: (oldPercentage, newPercentage) => {
    if (oldPercentage === null || newPercentage === null) return null;
    
    const change = newPercentage - oldPercentage;
    const changePercentage = oldPercentage > 0 ? (change / oldPercentage) * 100 : 0;

    return {
      absoluteChange: change,
      percentageChange: changePercentage,
      changeType: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'no-change',
      formattedAbsoluteChange: `${change > 0 ? '+' : ''}${change.toFixed(2)}%`,
      formattedPercentageChange: `${changePercentage > 0 ? '+' : ''}${changePercentage.toFixed(1)}%`
    };
  },

  /**
   * Group history records by time period
   */
  groupByTimePeriod: (records, period = 'month') => {
    const groups = {};
    
    records.forEach(record => {
      const date = new Date(record.changeDate);
      let key;
      
      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(record);
    });
    
    return groups;
  },

  /**
   * Generate timeline data for charts
   */
  generateTimelineData: (timeline) => {
    if (!timeline || !Array.isArray(timeline)) return [];

    return timeline.map(point => ({
      ...point,
      formattedDate: new Date(point.date).toLocaleDateString('vi-VN'),
      totalPercentage: point.coOwners?.reduce((sum, owner) => sum + owner.percentage, 0) || 0,
      coOwnerCount: point.coOwners?.length || 0
    }));
  },

  /**
   * Get status color for UI components
   */
  getStatusColor: (changeType) => {
    switch (changeType?.toLowerCase()) {
      case 'initial': return 'primary';
      case 'adjustment': return 'info';
      case 'transfer': return 'warning';
      case 'exit': return 'error';
      case 'investment': return 'success';
      case 'correction': return 'secondary';
      default: return 'default';
    }
  },

  /**
   * Export history data for download
   */
  prepareExportData: (records) => {
    return records.map(record => ({
      'Ngày thay đổi': new Date(record.changeDate).toLocaleDateString('vi-VN'),
      'Loại thay đổi': ownershipHistoryApi.getChangeTypeLabel(record.changeType),
      'Chủ sở hữu': record.coOwnerName,
      'Tỷ lệ cũ (%)': record.oldPercentage?.toFixed(2),
      'Tỷ lệ mới (%)': record.newPercentage?.toFixed(2),
      'Thay đổi đầu tư': ownershipHistoryApi.formatCurrency(record.investmentChange),
      'Lý do': record.reason || 'N/A'
    }));
  }
};

export default ownershipHistoryApi;