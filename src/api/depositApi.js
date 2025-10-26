import axiosClient from './axiosClient';

/**
 * Deposit API - README 16 Compliant Implementation
 * Manages deposit transactions for vehicle co-ownership
 * All endpoints follow exact README 16 specifications
// All endpoints updated to use capitalized controller names (e.g., /api/Deposit) to match Swagger
 */

const depositApi = {
    // ===== README 16 COMPLIANCE - 9 ENDPOINTS =====

    // 1. Create a new deposit - POST /api/deposit (README 16 compliant)
    create: (data) => axiosClient.post('/api/Deposit', {
        amount: data.amount,
        depositMethod: data.depositMethod, // 0: CreditCard, 1: EWallet, 2: OnlineBanking, 3: QRCode
        description: data.description
    }),

    // 2. Get deposit by ID - GET /api/deposit/{id} (README 16 compliant)
    getById: (id) => axiosClient.get(`/api/Deposit/${id}`),

    // 3. Get user's deposit history - GET /api/deposit/my-deposits (README 16 compliant)
    getMyDeposits: (params) => axiosClient.get('/api/Deposit/my-deposits', {
        params: {
            depositMethod: params?.depositMethod,
            status: params?.status,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            minAmount: params?.minAmount,
            maxAmount: params?.maxAmount,
            pageNumber: params?.pageNumber || 1,
            pageSize: params?.pageSize || 20,
            sortBy: params?.sortBy,
            sortOrder: params?.sortOrder || 'desc'
        }
    }),

    // 4. Get all deposits (Admin/Staff) - GET /api/deposit (README 16 compliant)
    getAll: (params) => axiosClient.get('/api/Deposit', {
        params: {
            depositMethod: params?.depositMethod,
            status: params?.status,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            minAmount: params?.minAmount,
            maxAmount: params?.maxAmount,
            userId: params?.userId,
            pageNumber: params?.pageNumber || 1,
            pageSize: params?.pageSize || 20,
            sortBy: params?.sortBy,
            sortOrder: params?.sortOrder || 'desc'
        }
    }),

    // 5. Cancel a deposit - POST /api/deposit/{id}/cancel (README 16 compliant)
    cancel: (id) => axiosClient.post(`/api/Deposit/${id}/cancel`),

    // 6. Get user's deposit statistics - GET /api/deposit/my-statistics (README 16 compliant)
    getMyStatistics: () => axiosClient.get('/api/Deposit/my-statistics'),

    // 7. Get payment methods - GET /api/deposit/payment-methods (README 16 compliant)
    getPaymentMethods: () => axiosClient.get('/api/Deposit/payment-methods'),

    // 8. Payment gateway callback - GET /api/deposit/callback (README 16 compliant)
    handleCallback: (params) => axiosClient.get('/api/Deposit/callback', { params }),

    // 9. Verify callback (POST) - POST /api/deposit/verify-callback (README 16 compliant)
    verifyCallback: (data) => axiosClient.post('/api/Deposit/verify-callback', {
        depositId: data.depositId,
        gatewayTransactionId: data.gatewayTransactionId,
        isSuccess: data.isSuccess,
        responseCode: data.responseCode,
        secureHash: data.secureHash
    }),

    // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

    // Validate deposit data
    validateDepositData: (data) => {
        const errors = [];

        if (!data.amount || data.amount <= 0) {
            errors.push('Amount must be greater than 0');
        }

        if (data.amount < 10000) {
            errors.push('Minimum deposit amount is 10,000 VND');
        }

        if (data.amount > 50000000) {
            errors.push('Maximum deposit amount is 50,000,000 VND');
        }

        if (data.depositMethod === undefined || data.depositMethod === null) {
            errors.push('Deposit method is required');
        }

        if (![0, 1, 2, 3].includes(data.depositMethod)) {
            errors.push('Invalid deposit method');
        }

        if (!data.description || data.description.trim().length < 5) {
            errors.push('Description must be at least 5 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Format deposit method for display
    getDepositMethodDisplayName: (method) => {
        const methods = {
            0: 'Thẻ tín dụng',
            1: 'Ví điện tử',
            2: 'Ngân hàng trực tuyến',
            3: 'Mã QR'
        };
        return methods[method] || 'Không xác định';
    },

    // Format deposit status for display
    getDepositStatusDisplayName: (status) => {
        const statuses = {
            'Pending': 'Đang chờ',
            'Processing': 'Đang xử lý',
            'Completed': 'Hoàn thành',
            'Failed': 'Thất bại',
            'Cancelled': 'Đã hủy',
            'Expired': 'Hết hạn'
        };
        return statuses[status] || status;
    },

    // Get status color for UI
    getStatusColor: (status) => {
        const colors = {
            'Pending': '#FF9800',
            'Processing': '#2196F3',
            'Completed': '#4CAF50',
            'Failed': '#F44336',
            'Cancelled': '#9E9E9E',
            'Expired': '#FF5722'
        };
        return colors[status] || '#757575';
    },

    // Format deposit for display
    formatDepositForDisplay: (deposit) => ({
        id: deposit.id || deposit.depositId,
        amount: deposit.amount,
        formattedAmount: new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(deposit.amount),
        depositMethod: deposit.depositMethod,
        depositMethodName: depositApi.getDepositMethodDisplayName(deposit.depositMethod),
        status: deposit.status,
        statusName: depositApi.getDepositStatusDisplayName(deposit.status),
        statusColor: depositApi.getStatusColor(deposit.status),
        description: deposit.description,
        createdAt: deposit.createdAt,
        formattedCreatedAt: deposit.createdAt ?
            new Date(deposit.createdAt).toLocaleString('vi-VN') : null,
        updatedAt: deposit.updatedAt,
        formattedUpdatedAt: deposit.updatedAt ?
            new Date(deposit.updatedAt).toLocaleString('vi-VN') : null,
        paymentUrl: deposit.paymentUrl,
        gatewayTransactionId: deposit.gatewayTransactionId,
        canCancel: deposit.status === 'Pending' || deposit.status === 'Processing'
    }),

    // Calculate deposit statistics
    calculateStatistics: (deposits) => {
        if (!deposits || deposits.length === 0) {
            return {
                totalDeposits: 0,
                totalAmount: 0,
                completedDeposits: 0,
                completedAmount: 0,
                pendingDeposits: 0,
                pendingAmount: 0,
                failedDeposits: 0,
                averageAmount: 0,
                successRate: 0
            };
        }

        const completed = deposits.filter(d => d.status === 'Completed');
        const pending = deposits.filter(d => d.status === 'Pending' || d.status === 'Processing');
        const failed = deposits.filter(d => d.status === 'Failed' || d.status === 'Cancelled');

        const totalAmount = deposits.reduce((sum, d) => sum + (d.amount || 0), 0);
        const completedAmount = completed.reduce((sum, d) => sum + (d.amount || 0), 0);
        const pendingAmount = pending.reduce((sum, d) => sum + (d.amount || 0), 0);

        return {
            totalDeposits: deposits.length,
            totalAmount,
            formattedTotalAmount: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(totalAmount),
            completedDeposits: completed.length,
            completedAmount,
            formattedCompletedAmount: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(completedAmount),
            pendingDeposits: pending.length,
            pendingAmount,
            formattedPendingAmount: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(pendingAmount),
            failedDeposits: failed.length,
            averageAmount: deposits.length > 0 ? totalAmount / deposits.length : 0,
            formattedAverageAmount: deposits.length > 0 ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(totalAmount / deposits.length) : '0 ₫',
            successRate: deposits.length > 0 ? (completed.length / deposits.length) * 100 : 0
        };
    },

    // Get deposit method configuration
    getDepositMethodConfig: (method) => {
        const configs = {
            0: { // CreditCard
                name: 'Thẻ tín dụng',
                icon: '💳',
                minAmount: 10000,
                maxAmount: 50000000,
                processingTime: '1-3 phút',
                fees: '2.5% + 5,000 VND'
            },
            1: { // EWallet
                name: 'Ví điện tử',
                icon: '📱',
                minAmount: 10000,
                maxAmount: 20000000,
                processingTime: 'Tức thì',
                fees: '1.5% + 2,000 VND'
            },
            2: { // OnlineBanking
                name: 'Ngân hàng trực tuyến',
                icon: '🏦',
                minAmount: 50000,
                maxAmount: 100000000,
                processingTime: '5-15 phút',
                fees: '0.8% + 3,000 VND'
            },
            3: { // QRCode
                name: 'Mã QR',
                icon: '📲',
                minAmount: 10000,
                maxAmount: 10000000,
                processingTime: 'Tức thì',
                fees: '1.0% + 1,000 VND'
            }
        };
        return configs[method] || null;
    }
};

export default depositApi;