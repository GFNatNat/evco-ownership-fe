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
  }),

  // ===== README 08 COMPLIANCE - CORE METHODS =====

  // 1. Create payment - POST /api/payment
  createPayment: (data) => axiosClient.post('/api/payment', {
    amount: data.amount,
    paymentGateway: data.paymentGateway, // 0: VNPay, 1: Momo, 2: ZaloPay
    paymentMethod: data.paymentMethod,   // 0: BankTransfer, 1: CreditCard, 2: Wallet
    paymentType: data.paymentType,       // 0: Booking, 1: Maintenance, 2: Ownership
    bookingId: data.bookingId,
    description: data.description
  }),

  // 2. Process payment callback - POST /api/payment/process
  processPaymentCallback: (data) => axiosClient.post('/api/payment/process', {
    paymentId: data.paymentId,
    transactionId: data.transactionId,
    isSuccess: data.isSuccess
  }),

  // 3. Get payment by ID - GET /api/payment/{id}
  getPaymentById: (id) => axiosClient.get(`/api/payment/${id}`),

  // 4. Get my payments - GET /api/payment/my-payments
  getMyPaymentsList: (params) => axiosClient.get('/api/payment/my-payments', {
    params: {
      pageIndex: params?.pageIndex || 1,
      pageSize: params?.pageSize || 10
    }
  }),

  // 5. Cancel payment - POST /api/payment/{id}/cancel
  cancelPaymentById: (id) => axiosClient.post(`/api/payment/${id}/cancel`),

  // 6. Get available gateways - GET /api/payment/gateways
  getAvailableGateways: () => axiosClient.get('/api/payment/gateways'),

  // 7. Get all payments (Admin/Staff) - GET /api/payment
  getAllPayments: (params) => axiosClient.get('/api/payment', {
    params: {
      pageIndex: params?.pageIndex || 1,
      pageSize: params?.pageSize || 10
    }
  }),

  // 8. Get payment statistics (Admin/Staff) - GET /api/payment/statistics
  getPaymentStatistics: () => axiosClient.get('/api/payment/statistics'),

  // 9. VNPay callback - GET /api/payment/vnpay-callback
  // Note: This is handled by backend redirect, not direct API call

  // Legacy method aliases for backward compatibility
  createPaymentLegacy: (data) => paymentApi.create(data),
  getPaymentByIdLegacy: (id) => paymentApi.getById(id),
  getAllPaymentsLegacy: (params) => paymentApi.getAll(params),
  cancelPaymentLegacy: (id, reason) => paymentApi.cancelPayment(id, reason)
};

export default paymentApi;