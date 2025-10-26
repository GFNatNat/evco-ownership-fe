import axiosClient from './axiosClient';

/**
 * UsageAnalytics API
 * Provides endpoints for analyzing vehicle usage patterns and comparisons
 * Following README 24 specifications
 */
const usageAnalyticsApi = {
  // Base endpoint
  baseURL: '/api/UsageAnalytics',

  /**
   * Get usage vs ownership comparison
   * GET /vehicle/{vehicleId}/usage-vs-ownership
   */
  getUsageVsOwnership: (vehicleId, params = {}) => {
    const { startDate, endDate, usageMetric } = params;

    const queryParams = {};
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (usageMetric) queryParams.usageMetric = usageMetric;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/vehicle/${vehicleId}/usage-vs-ownership`, {
      params: queryParams
    });
  },

  /**
   * Get usage vs ownership trends
   * GET /vehicle/{vehicleId}/usage-vs-ownership/trends
   */
  getUsageVsOwnershipTrends: (vehicleId, params = {}) => {
    const { startDate, endDate, granularity } = params;

    const queryParams = {};
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (granularity) queryParams.granularity = granularity;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/vehicle/${vehicleId}/usage-vs-ownership/trends`, {
      params: queryParams
    });
  },

  /**
   * Get co-owner usage detail
   * GET /vehicle/{vehicleId}/co-owner/{coOwnerId}/usage-detail
   */
  getCoOwnerUsageDetail: (vehicleId, coOwnerId, params = {}) => {
    const { startDate, endDate } = params;

    const queryParams = {};
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/vehicle/${vehicleId}/co-owner/${coOwnerId}/usage-detail`, {
      params: queryParams
    });
  },

  /**
   * Get my usage history
   * GET /my/usage-history
   */
  getMyUsageHistory: (params = {}) => {
    const { startDate, endDate, vehicleId, pageIndex = 1, pageSize = 20 } = params;

    const queryParams = { pageIndex, pageSize };
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (vehicleId) queryParams.vehicleId = vehicleId;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/my/usage-history`, {
      params: queryParams
    });
  },

  /**
   * Get group usage summary
   * GET /group-summary
   */
  getGroupUsageSummary: (params = {}) => {
    const { startDate, endDate } = params;

    const queryParams = {};
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/group-summary`, {
      params: queryParams
    });
  },

  /**
   * Compare co-owners usage
   * GET /compare/co-owners
   */
  compareCoOwners: (params = {}) => {
    const { vehicleId, coOwnerIds, startDate, endDate, metric } = params;

    const queryParams = {};
    if (vehicleId) queryParams.vehicleId = vehicleId;
    if (coOwnerIds && Array.isArray(coOwnerIds)) queryParams.coOwnerIds = coOwnerIds.join(',');
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (metric) queryParams.metric = metric;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/compare/co-owners`, {
      params: queryParams
    });
  },

  /**
   * Compare vehicles usage
   * GET /compare/vehicles
   */
  compareVehicles: (params = {}) => {
    const { vehicleIds, startDate, endDate, metric } = params;

    const queryParams = {};
    if (vehicleIds && Array.isArray(vehicleIds)) queryParams.vehicleIds = vehicleIds.join(',');
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (metric) queryParams.metric = metric;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/compare/vehicles`, {
      params: queryParams
    });
  },

  /**
   * Compare time periods
   * GET /compare/periods
   */
  compareTimePeriods: (params = {}) => {
    const {
      vehicleId,
      period1Start,
      period1End,
      period2Start,
      period2End,
      granularity
    } = params;

    const queryParams = {};
    if (vehicleId) queryParams.vehicleId = vehicleId;
    if (period1Start) queryParams.period1Start = period1Start;
    if (period1End) queryParams.period1End = period1End;
    if (period2Start) queryParams.period2Start = period2Start;
    if (period2End) queryParams.period2End = period2End;
    if (granularity) queryParams.granularity = granularity;

    return axiosClient.get(`${usageAnalyticsApi.baseURL}/compare/periods`, {
      params: queryParams
    });
  },

  // Helper functions and utilities

  /**
   * Available usage metrics
   */
  getUsageMetrics: () => [
    { value: 'Hours', label: 'Giờ sử dụng' },
    { value: 'Distance', label: 'Khoảng cách' },
    { value: 'Bookings', label: 'Số lần đặt' },
    { value: 'Cost', label: 'Chi phí' }
  ],

  /**
   * Available granularity options
   */
  getGranularityOptions: () => [
    { value: 'Daily', label: 'Hằng ngày' },
    { value: 'Weekly', label: 'Hằng tuần' },
    { value: 'Monthly', label: 'Hằng tháng' },
    { value: 'Quarterly', label: 'Hằng quý' }
  ],

  /**
   * Available comparison metrics
   */
  getComparisonMetrics: () => [
    { value: 'Hours', label: 'Giờ sử dụng' },
    { value: 'Distance', label: 'Khoảng cách' },
    { value: 'Bookings', label: 'Số lần đặt' },
    { value: 'Efficiency', label: 'Hiệu suất' },
    { value: 'Usage', label: 'Mức sử dụng' },
    { value: 'Cost', label: 'Chi phí' }
  ],

  /**
   * Validate analytics parameters
   */
  validateAnalyticsParams: (params) => {
    const errors = [];
    const { startDate, endDate, pageIndex, pageSize } = params;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        errors.push('Start date must be before end date');
      }
    }

    if (pageIndex !== undefined && (pageIndex < 1 || !Number.isInteger(pageIndex))) {
      errors.push('Page index must be a positive integer');
    }

    if (pageSize !== undefined && (pageSize < 1 || pageSize > 100 || !Number.isInteger(pageSize))) {
      errors.push('Page size must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format usage data for display
   */
  formatUsageData: (data) => {
    if (!data) return null;

    return {
      ...data,
      formattedUsageValue: usageAnalyticsApi.formatUsageValue(data.actualUsageValue, data.usageMetric),
      formattedOwnershipPercentage: `${data.ownershipPercentage?.toFixed(2)}%`,
      formattedUsagePercentage: `${data.usagePercentage?.toFixed(2)}%`,
      formattedDelta: `${data.usageVsOwnershipDelta > 0 ? '+' : ''}${data.usageVsOwnershipDelta?.toFixed(2)}%`,
      deltaColor: usageAnalyticsApi.getDeltaColor(data.usageVsOwnershipDelta)
    };
  },

  /**
   * Format usage value based on metric
   */
  formatUsageValue: (value, metric) => {
    if (value === null || value === undefined) return 'N/A';

    switch (metric?.toLowerCase()) {
      case 'hours':
        return `${value.toFixed(1)} giờ`;
      case 'distance':
        return `${value.toFixed(1)} km`;
      case 'bookings':
        return `${Math.round(value)} lần`;
      case 'cost':
        return usageAnalyticsApi.formatCurrency(value);
      default:
        return value.toString();
    }
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
   * Get color for usage delta
   */
  getDeltaColor: (delta) => {
    if (delta === null || delta === undefined) return 'default';
    if (Math.abs(delta) <= 5) return 'success'; // Balanced
    if (delta > 5) return 'warning'; // Overutilized
    return 'info'; // Underutilized
  },

  /**
   * Get usage pattern label
   */
  getUsagePatternLabel: (pattern) => {
    const patterns = {
      'Balanced': 'Cân bằng',
      'Overutilized': 'Sử dụng quá mức',
      'Underutilized': 'Sử dụng ít',
      'Above Average': 'Trên trung bình',
      'Below Average': 'Dưới trung bình'
    };
    return patterns[pattern] || pattern;
  },

  /**
   * Calculate usage efficiency
   */
  calculateUsageEfficiency: (usageData) => {
    const { usagePercentage, ownershipPercentage } = usageData;

    if (!usagePercentage || !ownershipPercentage || ownershipPercentage === 0) {
      return 0;
    }

    // Efficiency is inversely related to the difference between usage and ownership
    const difference = Math.abs(usagePercentage - ownershipPercentage);
    const maxDifference = 100; // Maximum possible difference
    const efficiency = Math.max(0, 100 - (difference / maxDifference) * 100);

    return Math.round(efficiency);
  },

  /**
   * Generate insights from usage data
   */
  generateUsageInsights: (usageData) => {
    const insights = [];

    if (!usageData || !Array.isArray(usageData.coOwnersData)) {
      return insights;
    }

    const coOwners = usageData.coOwnersData;
    const summary = usageData.summary;

    // Check for overutilization
    const overutilized = coOwners.filter(co => co.usageVsOwnershipDelta > 10);
    if (overutilized.length > 0) {
      insights.push({
        type: 'warning',
        message: `${overutilized.length} chủ sở hữu đang sử dụng xe nhiều hơn tỷ lệ sở hữu`
      });
    }

    // Check for underutilization
    const underutilized = coOwners.filter(co => co.usageVsOwnershipDelta < -10);
    if (underutilized.length > 0) {
      insights.push({
        type: 'info',
        message: `${underutilized.length} chủ sở hữu có thể tăng mức sử dụng xe`
      });
    }

    // Check for balanced usage
    const balanced = coOwners.filter(co => Math.abs(co.usageVsOwnershipDelta) <= 5);
    if (balanced.length === coOwners.length) {
      insights.push({
        type: 'success',
        message: 'Mức sử dụng xe cân bằng giữa tất cả chủ sở hữu'
      });
    }

    return insights;
  },

  /**
   * Export analytics data for download
   */
  prepareExportData: (analyticsData, type = 'usage-vs-ownership') => {
    switch (type) {
      case 'usage-vs-ownership':
        return usageAnalyticsApi.exportUsageVsOwnership(analyticsData);
      case 'usage-history':
        return usageAnalyticsApi.exportUsageHistory(analyticsData);
      case 'comparison':
        return usageAnalyticsApi.exportComparison(analyticsData);
      default:
        return [];
    }
  },

  /**
   * Export usage vs ownership data
   */
  exportUsageVsOwnership: (data) => {
    if (!data?.coOwnersData) return [];

    return data.coOwnersData.map(coOwner => ({
      'Tên chủ sở hữu': coOwner.coOwnerName,
      'Email': coOwner.email,
      'Tỷ lệ sở hữu (%)': coOwner.ownershipPercentage?.toFixed(2),
      'Tỷ lệ sử dụng (%)': coOwner.usagePercentage?.toFixed(2),
      'Chênh lệch (%)': `${coOwner.usageVsOwnershipDelta > 0 ? '+' : ''}${coOwner.usageVsOwnershipDelta?.toFixed(2)}`,
      'Tổng số lần đặt': coOwner.totalBookings,
      'Hoàn thành': coOwner.completedBookings,
      'Mức sử dụng': usageAnalyticsApi.getUsagePatternLabel(coOwner.usagePattern)
    }));
  },

  /**
   * Export usage history data
   */
  exportUsageHistory: (data) => {
    if (!data?.usageHistory) return [];

    return data.usageHistory.map(record => ({
      'Mã đặt xe': record.bookingId,
      'Tên xe': record.vehicleName,
      'Biển số': record.licensePlate,
      'Thời gian bắt đầu': new Date(record.startTime).toLocaleString('vi-VN'),
      'Thời gian kết thúc': new Date(record.endTime).toLocaleString('vi-VN'),
      'Thời lượng (giờ)': record.durationHours,
      'Quãng đường (km)': record.distanceTraveled,
      'Mục đích': record.purpose,
      'Chi phí': usageAnalyticsApi.formatCurrency(record.cost),
      'Trạng thái': record.status
    }));
  },

  /**
   * Export comparison data
   */
  exportComparison: (data) => {
    if (!data?.coOwnersComparison && !data?.vehiclesComparison) return [];

    if (data.coOwnersComparison) {
      return data.coOwnersComparison.map(coOwner => ({
        'Tên': coOwner.userName,
        'Tỷ lệ sở hữu (%)': coOwner.ownershipPercentage?.toFixed(2),
        'Sử dụng thực tế': coOwner.actualUsage,
        'Tỷ lệ sử dụng (%)': coOwner.usagePercentage?.toFixed(2),
        'Chênh lệch so với dự kiến': `${coOwner.varianceFromExpected > 0 ? '+' : ''}${coOwner.varianceFromExpected?.toFixed(2)}`,
        'Hiệu suất': coOwner.efficiency,
        'Xếp hạng': coOwner.rank
      }));
    }

    return [];
  }
};

export default usageAnalyticsApi;