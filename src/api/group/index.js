import axiosClient from '../axiosClient';

const groupApi = {
    // Group CRUD Operations
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        return axiosClient.get(`/Group?${queryParams}`);
    },

    getById: (id) => axiosClient.get(`/Group/${id}`),

    create: (groupData) => axiosClient.post('/Group', groupData),

    update: (id, groupData) => axiosClient.put(`/Group/${id}`, groupData),

    delete: (id) => axiosClient.delete(`/Group/${id}`),

    // Member Management
    getMembers: (groupId) => axiosClient.get(`/Group/${groupId}/members`),

    addMember: (groupId, memberData) => axiosClient.post(`/Group/${groupId}/members`, memberData),

    removeMember: (groupId, memberId) => axiosClient.delete(`/Group/${groupId}/members/${memberId}`),

    updateMemberRole: (groupId, memberId, roleData) =>
        axiosClient.put(`/Group/${groupId}/members/${memberId}/role`, roleData),

    // Convenience methods
    getMyGroups: () => groupApi.getAll({ status: 'active' }),

    leaveGroup: (groupId) => {
        // This would need the current user's member ID
        // Implementation depends on how user context is handled
        return axiosClient.delete(`/Group/${groupId}/members/me`);
    },

    inviteMember: (groupId, inviteData) =>
        groupApi.addMember(groupId, inviteData),

    acceptInvitation: (groupId, invitationId) =>
        axiosClient.post(`/Group/${groupId}/invitations/${invitationId}/accept`),

    rejectInvitation: (groupId, invitationId) =>
        axiosClient.post(`/Group/${groupId}/invitations/${invitationId}/reject`),

    // Voting System
    getVotes: (groupId) => axiosClient.get(`/Group/${groupId}/votes`),

    createVote: (groupId, voteData) => axiosClient.post(`/Group/${groupId}/votes`, voteData),

    submitVote: (groupId, voteId, voteData) =>
        axiosClient.post(`/Group/${groupId}/votes/${voteId}/vote`, voteData),

    getVoteResults: (groupId, voteId) =>
        axiosClient.get(`/Group/${groupId}/votes/${voteId}/results`)
}; export default groupApi;