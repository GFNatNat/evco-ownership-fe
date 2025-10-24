import axiosClient from './axiosClient';

const votingApi = {
    // ===== README 12 COMPLIANCE - UPGRADE VOTING SYSTEM =====

    // 1. Propose a vehicle upgrade - POST /api/upgrade-vote/propose (README 12 compliant)
    proposeUpgrade: (data) => axiosClient.post('/api/upgrade-vote/propose', {
        vehicleId: data.vehicleId,
        upgradeType: data.upgradeType,
        title: data.title || 'Vehicle Upgrade Proposal',
        description: data.description,
        estimatedCost: data.estimatedCost,
        justification: data.justification || data.benefits,
        imageUrl: data.imageUrl,
        vendorName: data.vendorName,
        vendorContact: data.vendorContact,
        proposedInstallationDate: data.proposedDate || data.proposedInstallationDate,
        estimatedDurationDays: data.estimatedDurationDays || 1
    }),

    // 2. Vote on an upgrade proposal - POST /api/upgrade-vote/{proposalId}/vote (README 12 compliant)
    voteOnProposal: (data) => axiosClient.post(`/api/upgrade-vote/${data.proposalId}/vote`, {
        isApprove: data.vote === 'Approve' || data.isApprove,
        comments: data.comment || data.comments
    }),

    // 3. Get proposal details - GET /api/upgrade-vote/{proposalId} (README 12 compliant)
    getProposalDetails: (proposalId) => axiosClient.get(`/api/upgrade-vote/${proposalId}`),

    // 4. Get pending proposals - GET /api/upgrade-vote/vehicle/{vehicleId}/pending (README 12 compliant)
    getPendingProposals: (vehicleId, params) => axiosClient.get(`/api/upgrade-vote/vehicle/${vehicleId}/pending`, {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10,
            upgradeType: params?.upgradeType,
            sortBy: params?.sortBy || 'ProposedDate',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // 5. Get my voting history - GET /api/upgrade-vote/my-history (README 12 compliant)
    getMyVotingHistory: (params) => axiosClient.get('/api/upgrade-vote/my-history', {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10,
            vehicleId: params?.vehicleId,
            voteStatus: params?.voteStatus, // 'Approve', 'Reject', 'Abstain'
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            sortBy: params?.sortBy || 'VotedAt',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // ===== EXTENDED VOTING MANAGEMENT METHODS =====

    // Get all proposals (Admin/Owner view)
    getAllProposals: (params) => axiosClient.get('/api/upgrade-vote/all-proposals', {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 20,
            status: params?.status, // 'Pending', 'Approved', 'Rejected', 'Cancelled'
            vehicleId: params?.vehicleId,
            proposerId: params?.proposerId,
            upgradeType: params?.upgradeType,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            sortBy: params?.sortBy || 'CreatedAt',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // Get proposal voting summary
    getProposalVotingSummary: (proposalId) => axiosClient.get(`/api/upgrade-vote/proposal/${proposalId}/voting-summary`),

    // Update proposal status (Admin/Proposer only)
    updateProposalStatus: (proposalId, status, comment) => axiosClient.put(`/api/upgrade-vote/proposal/${proposalId}/status`, {
        status: status, // 'Cancelled', 'Modified'
        comment: comment
    }),

    // Withdraw my vote
    withdrawVote: (proposalId) => axiosClient.delete(`/api/upgrade-vote/proposal/${proposalId}/my-vote`),

    // Get proposals by vehicle
    getProposalsByVehicle: (vehicleId, params) => axiosClient.get(`/api/upgrade-vote/vehicle/${vehicleId}/proposals`, {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10,
            status: params?.status,
            includeHistory: params?.includeHistory !== undefined ? params.includeHistory : true,
            sortBy: params?.sortBy || 'CreatedAt',
            sortDirection: params?.sortDirection || 'desc'
        }
    }),

    // ===== HELPER METHODS =====

    // Get upgrade types
    getUpgradeTypes: () => axiosClient.get('/api/upgrade-vote/upgrade-types'),

    // Validate proposal data
    validateProposalData: (data) => {
        const errors = [];

        if (!data.vehicleId) {
            errors.push('Vehicle ID is required');
        }
        if (!data.upgradeType || data.upgradeType.trim() === '') {
            errors.push('Upgrade type is required');
        }
        if (!data.description || data.description.trim() === '') {
            errors.push('Description is required');
        }
        if (!data.estimatedCost || data.estimatedCost <= 0) {
            errors.push('Valid estimated cost is required');
        }
        if (!data.proposedDate) {
            errors.push('Proposed date is required');
        } else {
            const proposedDate = new Date(data.proposedDate);
            const now = new Date();
            if (proposedDate <= now) {
                errors.push('Proposed date must be in the future');
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Format proposal for display
    formatProposal: (proposal) => {
        return {
            ...proposal,
            formattedCost: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(proposal.estimatedCost),
            formattedProposedDate: new Date(proposal.proposedDate).toLocaleDateString('vi-VN'),
            formattedCreatedAt: new Date(proposal.createdAt).toLocaleString('vi-VN'),
            statusText: {
                'Pending': 'Đang chờ bình chọn',
                'Approved': 'Đã được phê duyệt',
                'Rejected': 'Bị từ chối',
                'Cancelled': 'Đã hủy',
                'Modified': 'Đã chỉnh sửa'
            }[proposal.status] || proposal.status
        };
    },

    // Get voting statistics
    getVotingStatistics: (params) => axiosClient.get('/api/upgrade-vote/statistics', {
        params: {
            vehicleId: params?.vehicleId,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            groupBy: params?.groupBy || 'month'
        }
    }),

    // Export voting report
    exportVotingReport: (params) => axiosClient.get('/api/upgrade-vote/export-report', {
        params: {
            vehicleId: params?.vehicleId,
            fromDate: params?.fromDate,
            toDate: params?.toDate,
            format: params?.format || 'excel',
            includeVoteDetails: params?.includeVoteDetails !== undefined ? params.includeVoteDetails : true
        },
        responseType: 'blob'
    })
};

export default votingApi;