import axiosClient from './axiosClient';

const paymentApi = {
  // Payment CRUD operations
  getAll: (params) => axiosClient.get('/api/Payment', { params }),
  getById: (id) => axiosClient.get(`/api/Payment/${id}`),
  create: (data) => axiosClient.post('/api/Payment', {
    amount: data.amount,
    description: data.description,
    paymentMethod: data.paymentMethod,
    ownershipId: data.ownershipId,
    dueDate: data.dueDate,
    paymentType: data.paymentType // 'Ownership', 'Maintenance', 'Insurance', 'Other'
  }),

  update: (id, data) => axiosClient.put(`/api/Payment/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/Payment/${id}`),

  // Payment processing
  processPayment: (id, data) => axiosClient.post(`/api/Payment/${id}/process`, {
    paymentMethod: data.paymentMethod,
    amount: data.amount,
    paymentDetails: data.paymentDetails
  }),

  payInvoice: (invoiceId, data) => axiosClient.post(`/api/Payment/pay/${invoiceId}`, {
    paymentMethod: data.paymentMethod,
    amount: data.amount
  }),

  // Payment status management
  confirmPayment: (id) => axiosClient.post(`/api/Payment/${id}/confirm`),
  cancelPayment: (id, reason) => axiosClient.post(`/api/Payment/${id}/cancel`, { reason }),
  refundPayment: (id, data) => axiosClient.post(`/api/Payment/${id}/refund`, {
    amount: data.amount,
    reason: data.reason
  }),

  // Invoice management
  getInvoices: (params) => axiosClient.get('/api/Payment/invoices', { params }),
  getInvoiceById: (id) => axiosClient.get(`/api/Payment/invoices/${id}`),
  createInvoice: (data) => axiosClient.post('/api/Payment/invoices', data),
  generateInvoice: (paymentId) => axiosClient.post(`/api/Payment/${paymentId}/generate-invoice`),

  downloadInvoice: (invoiceId) => axiosClient.get(`/api/Payment/invoices/${invoiceId}/download`, {
    responseType: 'blob'
  }),

  // User payment queries
  getMyPayments: (params) => axiosClient.get('/api/Payment/my-payments', { params }),
  getPaymentHistory: (params) => axiosClient.get('/api/Payment/history', { params }),
  getPendingPayments: () => axiosClient.get('/api/Payment/pending'),
  getOverduePayments: () => axiosClient.get('/api/Payment/overdue'),

  // Payment methods
  getPaymentMethods: () => axiosClient.get('/api/Payment/methods'),
  addPaymentMethod: (data) => axiosClient.post('/api/Payment/methods', data),
  updatePaymentMethod: (id, data) => axiosClient.put(`/api/Payment/methods/${id}`, data),
  deletePaymentMethod: (id) => axiosClient.delete(`/api/Payment/methods/${id}`),

  // Payment summary and reports
  getPaymentSummary: (params) => axiosClient.get('/api/Payment/summary', { params }),
  getMonthlyReport: (year, month) => axiosClient.get('/api/Payment/monthly-report', {
    params: { year, month }
  }),

  getYearlyReport: (year) => axiosClient.get('/api/Payment/yearly-report', {
    params: { year }
  }),

  // Ownership payment management
  getOwnershipPayments: (ownershipId) => axiosClient.get(`/api/Payment/ownership/${ownershipId}`),
  createOwnershipPayment: (ownershipId, data) => axiosClient.post(`/api/Payment/ownership/${ownershipId}`, data),

  // Recurring payments
  setupRecurringPayment: (data) => axiosClient.post('/api/Payment/recurring', data),
  updateRecurringPayment: (id, data) => axiosClient.put(`/api/Payment/recurring/${id}`, data),
  cancelRecurringPayment: (id) => axiosClient.delete(`/api/Payment/recurring/${id}`),

  // Payment analytics (Admin/Staff only)
  getPaymentAnalytics: (params) => axiosClient.get('/api/Payment/analytics', { params }),
  getRevenueReport: (startDate, endDate) => axiosClient.get('/api/Payment/revenue', {
    params: { startDate, endDate }
  }),

  // Payment verification
  verifyPayment: (transactionId) => axiosClient.post('/api/Payment/verify', { transactionId }),

  // Bulk operations (Admin only)
  bulkProcessPayments: (paymentIds) => axiosClient.post('/api/Payment/bulk-process', {
    paymentIds
  }),

  exportPayments: (params) => axiosClient.get('/api/Payment/export', {
    params,
    responseType: 'blob'
  })
};

export default paymentApi;