import axiosClient from './axiosClient';

const vehicleReportApi = {
  // 1. Tạo Báo Cáo Tháng
  generateMonthlyReport: (data) => {
    return axiosClient.post('/reports/monthly', data);
  },

  // 2. Tạo Báo Cáo Quý
  generateQuarterlyReport: (data) => {
    return axiosClient.post('/reports/quarterly', data);
  },

  // 3. Tạo Báo Cáo Năm
  generateYearlyReport: (data) => {
    return axiosClient.post('/reports/yearly', data);
  },

  // 4. Xuất Báo Cáo (PDF/Excel)
  exportReport: (data) => {
    return axiosClient.post('/reports/export', data, {
      responseType: 'blob', // Important for file downloads
      headers: {
        'Accept': 'application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  },

  // 5. Lấy Danh Sách Kỳ Báo Cáo Khả Dụng
  getAvailablePeriods: (vehicleId) => {
    return axiosClient.get(`/reports/vehicle/${vehicleId}/available-periods`);
  },

  // 6. Lấy Báo Cáo Tháng Hiện Tại
  getCurrentMonthReport: (vehicleId) => {
    return axiosClient.get(`/reports/vehicle/${vehicleId}/current-month`);
  },

  // 7. Lấy Báo Cáo Quý Hiện Tại
  getCurrentQuarterReport: (vehicleId) => {
    return axiosClient.get(`/reports/vehicle/${vehicleId}/current-quarter`);
  },

  // 8. Lấy Báo Cáo Năm Hiện Tại
  getCurrentYearReport: (vehicleId) => {
    return axiosClient.get(`/reports/vehicle/${vehicleId}/current-year`);
  },

  // Helper functions for UI
  formatReportType: (month, quarter) => {
    if (month) return 'Báo cáo tháng';
    if (quarter) return 'Báo cáo quý';
    return 'Báo cáo năm';
  },

  formatFileName: (vehicleId, year, month, quarter, format) => {
    let reportType = 'yearly';
    let period = year;
    
    if (month) {
      reportType = 'monthly';
      period = `${year}_${month.toString().padStart(2, '0')}`;
    } else if (quarter) {
      reportType = 'quarterly';
      period = `${year}_Q${quarter}`;
    }
    
    const extension = format.toLowerCase() === 'pdf' ? 'pdf' : 'xlsx';
    return `report_${reportType}_vehicle_${vehicleId}_${period}.${extension}`;
  },

  downloadReport: async (vehicleId, year, month, quarter, format) => {
    try {
      const exportData = {
        vehicleId: parseInt(vehicleId),
        year,
        exportFormat: format
      };

      if (month) exportData.month = month;
      if (quarter) exportData.quarter = quarter;

      const response = await vehicleReportApi.exportReport(exportData);
      
      // Create blob and download
      const blob = new Blob([response.data], {
        type: format.toLowerCase() === 'pdf' 
          ? 'application/pdf' 
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const fileName = vehicleReportApi.formatFileName(vehicleId, year, month, quarter, format);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Lỗi tải báo cáo:', error);
      throw error;
    }
  },

  // Validation helpers
  validateReportParams: (vehicleId, year, month, quarter) => {
    const errors = [];
    
    if (!vehicleId || vehicleId <= 0) {
      errors.push('ID xe không hợp lệ');
    }
    
    if (!year || year < 2020 || year > new Date().getFullYear() + 1) {
      errors.push('Năm không hợp lệ');
    }
    
    if (month && (month < 1 || month > 12)) {
      errors.push('Tháng phải từ 1-12');
    }
    
    if (quarter && (quarter < 1 || quarter > 4)) {
      errors.push('Quý phải từ 1-4');
    }
    
    if (month && quarter) {
      errors.push('Không thể có cả tháng và quý cùng lúc');
    }
    
    return errors;
  },

  // Format currency for display
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  // Format date for display
  formatReportDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get quarter name in Vietnamese
  getQuarterName: (quarter) => {
    const quarters = {
      1: 'Quý 1 (T1-T3)',
      2: 'Quý 2 (T4-T6)', 
      3: 'Quý 3 (T7-T9)',
      4: 'Quý 4 (T10-T12)'
    };
    return quarters[quarter] || `Quý ${quarter}`;
  },

  // Get month name in Vietnamese  
  getMonthName: (month) => {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month - 1] || `Tháng ${month}`;
  },

  // Prepare chart data for reports
  prepareChartData: (reportData) => {
    if (!reportData) return null;

    // For quarterly/yearly reports with monthly breakdown
    if (reportData.monthlyBreakdown) {
      return {
        months: reportData.monthlyBreakdown.map(item => 
          vehicleReportApi.getMonthName(item.month)
        ),
        bookings: reportData.monthlyBreakdown.map(item => item.bookings),
        income: reportData.monthlyBreakdown.map(item => item.income),
        expenses: reportData.monthlyBreakdown.map(item => item.expenses),
        profit: reportData.monthlyBreakdown.map(item => item.profit)
      };
    }

    // For expense breakdown pie chart
    if (reportData.costBreakdown && reportData.costBreakdown.expenses) {
      return {
        expenseLabels: reportData.costBreakdown.expenses.map(item => item.category),
        expenseData: reportData.costBreakdown.expenses.map(item => item.amount),
        expensePercentages: reportData.costBreakdown.expenses.map(item => item.percentage)
      };
    }

    return null;
  },

  // Export data to CSV format
  exportToCSV: (data, filename) => {
    try {
      const csvContent = vehicleReportApi.convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Lỗi xuất CSV:', error);
      throw error;
    }
  },

  // Convert data to CSV format
  convertToCSV: (data) => {
    if (!data || !Array.isArray(data)) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
};

export default vehicleReportApi;