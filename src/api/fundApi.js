import axiosClient from './axiosClient';

/**
 * Fund API - README 20 Compliant Implementation
 * Manages vehicle fund operations including balance, additions, usages, and budget analysis
 * All endpoints follow exact README 20 specifications
 */

const fundApi = {
  // ===== README 20 COMPLIANCE - 9 ENDPOINTS =====

  // 1. Get fund balance - GET /api/fund/balance/{vehicleId} (README 20 compliant)
  getBalance: (vehicleId) => axiosClient.get(`/api/fund/balance/${vehicleId}`),

  // 2. Get fund additions - GET /api/fund/additions/{vehicleId} (README 20 compliant)
  getAdditions: (vehicleId, params) => axiosClient.get(`/api/fund/additions/${vehicleId}`, {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 20
    }
  }),

  // 3. Get fund usages - GET /api/fund/usages/{vehicleId} (README 20 compliant)
  getUsages: (vehicleId, params) => axiosClient.get(`/api/fund/usages/${vehicleId}`, {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 20
    }
  }),

  // 4. Get fund summary - GET /api/fund/summary/{vehicleId} (README 20 compliant)
  getSummary: (vehicleId, params) => axiosClient.get(`/api/fund/summary/${vehicleId}`, {
    params: {
      monthsToAnalyze: params?.monthsToAnalyze || 6
    }
  }),

  // 5. Create fund usage - POST /api/fund/usage (README 20 compliant)
  createUsage: (data) => axiosClient.post('/api/fund/usage', {
    vehicleId: data.vehicleId,
    usageType: data.usageType, // 0: Maintenance, 1: Insurance, 2: Fuel, 3: Parking, 4: Other
    amount: data.amount,
    description: data.description,
    imageUrl: data.imageUrl,
    maintenanceCostId: data.maintenanceCostId
  }),

  // 6. Update fund usage - PUT /api/fund/usage/{usageId} (README 20 compliant)
  updateUsage: (usageId, data) => axiosClient.put(`/api/fund/usage/${usageId}`, {
    usageType: data.usageType,
    amount: data.amount,
    description: data.description,
    imageUrl: data.imageUrl,
    maintenanceCostId: data.maintenanceCostId
  }),

  // 7. Delete fund usage (refund) - DELETE /api/fund/usage/{usageId} (README 20 compliant)
  deleteUsage: (usageId) => axiosClient.delete(`/api/fund/usage/${usageId}`),

  // 8. Get category usages - GET /api/fund/category/{vehicleId}/usages/{category} (README 20 compliant)
  getCategoryUsages: (vehicleId, category, params) => axiosClient.get(`/api/fund/category/${vehicleId}/usages/${category}`, {
    params: {
      startDate: params?.startDate,
      endDate: params?.endDate
    }
  }),

  // 9. Get category budget analysis - GET /api/fund/category/{vehicleId}/analysis (README 20 compliant)
  getCategoryAnalysis: (vehicleId) => axiosClient.get(`/api/fund/category/${vehicleId}/analysis`),

  // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

  // Validate usage data
  validateUsageData: (data) => {
    const errors = [];

    if (!data.vehicleId || data.vehicleId <= 0) {
      errors.push('Vehicle ID is required');
    }

    if (data.usageType === undefined || data.usageType === null || ![0, 1, 2, 3, 4].includes(data.usageType)) {
      errors.push('Valid usage type is required (0-4)');
    }

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.description || data.description.trim().length < 5) {
      errors.push('Description must be at least 5 characters');
    }

    if (data.description && data.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get usage type display name
  getUsageTypeDisplayName: (type) => {
    const types = {
      0: 'Bảo trì',
      1: 'Bảo hiểm',
      2: 'Nhiên liệu',
      3: 'Đỗ xe',
      4: 'Khác'
    };
    return types[type] || 'Không xác định';
  },

  // Get balance status color and info
  getBalanceStatusInfo: (status) => {
    const statuses = {
      'Healthy': { name: 'Tốt', color: '#4CAF50', bgColor: '#E8F5E8', icon: '✅' },
      'Warning': { name: 'Cảnh báo', color: '#FF9800', bgColor: '#FFF3E0', icon: '⚠️' },
      'Low': { name: 'Thấp', color: '#F44336', bgColor: '#FFEBEE', icon: '🔴' }
    };
    return statuses[status] || { name: status, color: '#757575', bgColor: '#F5F5F5', icon: '❓' };
  },

  // Get budget status info
  getBudgetStatusInfo: (status) => {
    const statuses = {
      'OnTrack': { name: 'Đúng kế hoạch', color: '#4CAF50', bgColor: '#E8F5E8' },
      'Warning': { name: 'Cảnh báo', color: '#FF9800', bgColor: '#FFF3E0' },
      'Exceeded': { name: 'Vượt ngân sách', color: '#F44336', bgColor: '#FFEBEE' }
    };
    return statuses[status] || { name: status, color: '#757575', bgColor: '#F5F5F5' };
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  },

  // Format percentage
  formatPercentage: (value, decimalPlaces = 1) => {
    return `${(value || 0).toFixed(decimalPlaces)}%`;
  },

  // Format fund balance for display
  formatBalanceForDisplay: (balance) => {
    if (!balance) return null;

    const statusInfo = fundApi.getBalanceStatusInfo(balance.balanceStatus);

    return {
      ...balance,
      formattedCurrentBalance: fundApi.formatCurrency(balance.currentBalance),
      formattedTotalAddedAmount: fundApi.formatCurrency(balance.totalAddedAmount),
      formattedTotalUsedAmount: fundApi.formatCurrency(balance.totalUsedAmount),
      formattedRecommendedMinBalance: fundApi.formatCurrency(balance.recommendedMinBalance),
      balanceStatusInfo: statusInfo,
      formattedCreatedAt: balance.createdAt ? new Date(balance.createdAt).toLocaleString('vi-VN') : null,
      formattedUpdatedAt: balance.updatedAt ? new Date(balance.updatedAt).toLocaleString('vi-VN') : null
    };
  },

  // Format fund usage for display
  formatUsageForDisplay: (usage) => {
    if (!usage) return null;

    return {
      ...usage,
      usageTypeName: fundApi.getUsageTypeDisplayName(usage.usageType),
      formattedAmount: fundApi.formatCurrency(usage.amount),
      formattedCreatedAt: usage.createdAt ? new Date(usage.createdAt).toLocaleString('vi-VN') : null
    };
  },

  // Format fund addition for display
  formatAdditionForDisplay: (addition) => {
    if (!addition) return null;

    return {
      ...addition,
      formattedAmount: fundApi.formatCurrency(addition.amount),
      formattedCreatedAt: addition.createdAt ? new Date(addition.createdAt).toLocaleString('vi-VN') : null,
      paymentMethodName: fundApi.getPaymentMethodDisplayName(addition.paymentMethod)
    };
  },

  // Get payment method display name
  getPaymentMethodDisplayName: (method) => {
    const methods = {
      'Cash': 'Tiền mặt',
      'BankTransfer': 'Chuyển khoản ngân hàng',
      'CreditCard': 'Thẻ tín dụng',
      'DebitCard': 'Thẻ ghi nợ',
      'DigitalWallet': 'Ví điện tử'
    };
    return methods[method] || method;
  },

  // Format category analysis for display
  formatCategoryAnalysisForDisplay: (analysis) => {
    if (!analysis) return null;

    return {
      ...analysis,
      formattedTotalBudget: fundApi.formatCurrency(analysis.totalBudget),
      formattedTotalSpending: fundApi.formatCurrency(analysis.totalSpending),
      categoryBudgets: (analysis.categoryBudgets || []).map(budget => ({
        ...budget,
        categoryName: fundApi.getUsageTypeDisplayName(budget.categoryCode),
        formattedMonthlyBudgetLimit: fundApi.formatCurrency(budget.monthlyBudgetLimit),
        formattedCurrentMonthSpending: fundApi.formatCurrency(budget.currentMonthSpending),
        formattedRemainingBudget: fundApi.formatCurrency(budget.remainingBudget),
        formattedBudgetUtilizationPercent: fundApi.formatPercentage(budget.budgetUtilizationPercent),
        budgetStatusInfo: fundApi.getBudgetStatusInfo(budget.budgetStatus),
        formattedAverageTransactionAmount: fundApi.formatCurrency(budget.averageTransactionAmount)
      }))
    };
  },

  // Get usage types for dropdown
  getUsageTypes: () => [
    { value: 0, label: 'Bảo trì', color: '#FF5722', icon: '🔧' },
    { value: 1, label: 'Bảo hiểm', color: '#2196F3', icon: '🛡️' },
    { value: 2, label: 'Nhiên liệu', color: '#4CAF50', icon: '⛽' },
    { value: 3, label: 'Đỗ xe', color: '#FF9800', icon: '🅿️' },
    { value: 4, label: 'Khác', color: '#9C27B0', icon: '📋' }
  ],

  // Calculate statistics from data
  calculateStatistics: (data) => {
    if (!data || !data.length) {
      return {
        totalAmount: 0,
        totalCount: 0,
        averageAmount: 0,
        maxAmount: 0,
        minAmount: 0
      };
    }

    const amounts = data.map(item => item.amount || 0);
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    return {
      totalAmount,
      totalCount: data.length,
      averageAmount: totalAmount / data.length,
      maxAmount: Math.max(...amounts),
      minAmount: Math.min(...amounts),
      formattedTotalAmount: fundApi.formatCurrency(totalAmount),
      formattedAverageAmount: fundApi.formatCurrency(totalAmount / data.length),
      formattedMaxAmount: fundApi.formatCurrency(Math.max(...amounts)),
      formattedMinAmount: fundApi.formatCurrency(Math.min(...amounts))
    };
  },

  // Auto-suggest category based on description
  suggestCategory: (description) => {
    if (!description) return { category: 4, confidence: 0 };

    const keywords = {
      0: ['bảo dưỡng', 'sửa chữa', 'thay', 'kiểm tra', 'maintenance', 'repair', 'replace', 'fix'],
      1: ['bảo hiểm', 'insurance', 'premium', 'coverage'],
      2: ['xăng', 'điện', 'sạc', 'fuel', 'charge', 'gas', 'electric', 'battery'],
      3: ['đỗ xe', 'parking', 'garage', 'bãi đỗ', 'park']
    };

    const desc = description.toLowerCase();

    for (const [category, words] of Object.entries(keywords)) {
      const matches = words.filter(word => desc.includes(word));
      if (matches.length > 0) {
        return {
          category: parseInt(category),
          confidence: matches.length / words.length,
          matchedWords: matches
        };
      }
    }

    return { category: 4, confidence: 0.3 }; // Default to "Other"
  }
};

export default fundApi;