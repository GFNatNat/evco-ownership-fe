import axiosClient from './axiosClient';

const reportApi = {
  // ===== README 10 COMPLIANCE - CORE METHODS =====

  // 1. Create monthly report - POST /api/report/monthly (README 10 compliant)
  createMonthlyReport: (data) => axiosClient.post('/api/reports/monthly', {
    vehicleId: data.vehicleId,
    year: data.year,
    month: data.month
  }),

  // 2. Create quarterly report - POST /api/report/quarterly (README 10 compliant)
  createQuarterlyReport: (data) => axiosClient.post('/api/reports/quarterly', {
    vehicleId: data.vehicleId,
    year: data.year,
    quarter: data.quarter
  }),

  // 3. Create yearly report - POST /api/report/yearly (README 10 compliant)
  createYearlyReport: (data) => axiosClient.post('/api/reports/yearly', {
    vehicleId: data.vehicleId,
    year: data.year
  }),

  // 4. Export report (PDF/Excel) - POST /api/report/export (README 10 compliant)
  exportReport: (data) => axiosClient.post('/api/reports/export', {
    vehicleId: data.vehicleId,
    year: data.year,
    month: data.month,
    exportFormat: data.exportFormat // "PDF" or "Excel"
  }, {
    responseType: 'blob'
  }),

  // 5. Get available periods - GET /api/report/vehicle/{vehicleId}/available-periods (README 10 compliant)
  getAvailablePeriods: (vehicleId) => axiosClient.get(`/api/reports/vehicle/${vehicleId}/available-periods`),

  // 6. Get current month report - GET /api/report/vehicle/{vehicleId}/current-month (README 10 compliant)
  getCurrentMonthReport: (vehicleId) => axiosClient.get(`/api/reports/vehicle/${vehicleId}/current-month`),

  // 7. Get current quarter report - GET /api/report/vehicle/{vehicleId}/current-quarter (README 10 compliant)
  getCurrentQuarterReport: (vehicleId) => axiosClient.get(`/api/reports/vehicle/${vehicleId}/current-quarter`),

  // 8. Get current year report - GET /api/report/vehicle/{vehicleId}/current-year (README 10 compliant)
  getCurrentYearReport: (vehicleId) => axiosClient.get(`/api/reports/vehicle/${vehicleId}/current-year`),

  // ===== LEGACY METHODS FOR BACKWARD COMPATIBILITY =====
  financial: (params) => axiosClient.get('/api/Report/financial', { params }),
  getDashboardStats: () => axiosClient.get('/api/Report/admin/dashboard-stats'),
  getUserStats: () => axiosClient.get('/api/Report/admin/user-stats'),
  getVehicleStats: () => axiosClient.get('/api/Report/admin/vehicle-stats'),
  getRevenueStats: (params) => axiosClient.get('/api/Report/admin/revenue-stats', { params }),
  getActivityLog: (params) => axiosClient.get('/api/Report/admin/activity-log', { params }),
  getUsageStatistics: () => axiosClient.get('/api/Report/admin/usage-statistics'),

  // ===== HELPER METHODS =====

  // ===== ADDITIONAL README 10 COMPLIANCE METHODS =====

  // Get available periods without vehicleId parameter for general use
  getAvailablePeriods: () => axiosClient.get('/api/report/available-periods'),

  // Get current reports without vehicleId for current user's vehicles
  getCurrentMonthReport: () => axiosClient.get('/api/report/current-month'),
  getCurrentQuarterReport: () => axiosClient.get('/api/report/current-quarter'),
  getCurrentYearReport: () => axiosClient.get('/api/report/current-year'),

  // Generate comprehensive report with all data types
  generateComprehensiveReport: (vehicleId, reportType, period) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const quarter = Math.ceil(month / 3);

    switch (reportType) {
      case 'monthly':
        return reportApi.createMonthlyReport({ vehicleId, year, month: period || month });
      case 'quarterly':
        return reportApi.createQuarterlyReport({ vehicleId, year, quarter: period || quarter });
      case 'yearly':
        return reportApi.createYearlyReport({ vehicleId, year: period || year });
      default:
        throw new Error('Invalid report type. Use: monthly, quarterly, yearly');
    }
  },

  // Export report with format validation
  exportReportWithValidation: (vehicleId, year, month, format) => {
    const validFormats = ['PDF', 'Excel'];
    if (!validFormats.includes(format)) {
      throw new Error('Invalid export format. Use: PDF or Excel');
    }

    return reportApi.exportReport({
      vehicleId,
      year,
      month,
      exportFormat: format
    });
  }
};

export default reportApi;