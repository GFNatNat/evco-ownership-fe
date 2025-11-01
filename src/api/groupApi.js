import axiosClient from './axiosClient';

const groupApi = {
  // Group CRUD Operations (Primary methods)
  getGroups: (query) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.pageSize) params.append('pageSize', query.pageSize.toString());
    if (query?.search) params.append('search', query.search);
    if (query?.status) params.append('status', query.status);

    return axiosClient.get(`/Group?${params.toString()}`);
  },

  getGroup: (id) => axiosClient.get(`/Group/${id}`),

  createGroup: (data) => axiosClient.post('/Group', data),

  updateGroup: (id, data) => axiosClient.put(`/Group/${id}`, data),

  deleteGroup: (id) => axiosClient.delete(`/Group/${id}`),

  // Aliases for Admin compatibility
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.pageIndex) queryParams.append('page', params.pageIndex.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    return axiosClient.get(`/Group?${queryParams.toString()}`);
  },

  get: (id) => axiosClient.get(`/Group/${id}`),

  create: (data) => axiosClient.post('/Group', data),

  update: (id, data) => axiosClient.put(`/Group/${id}`, data),

  delete: (id) => axiosClient.delete(`/Group/${id}`),

  // Member Management
  getGroupMembers: (groupId) => axiosClient.get(`/Group/${groupId}/members`),

  addMember: (groupId, memberData) => axiosClient.post(`/Group/${groupId}/members`, memberData),

  removeMember: (groupId, memberId) => axiosClient.delete(`/Group/${groupId}/members/${memberId}`),

  updateMemberRole: (groupId, memberId, roleData) => axiosClient.put(`/Group/${groupId}/members/${memberId}/role`, roleData),

  // Group Vehicles
  getGroupVehicles: (groupId) => axiosClient.get(`/Group/${groupId}/vehicles`),

  getVehicleDetails: (groupId, vehicleId) => axiosClient.get(`/Group/${groupId}/vehicles/${vehicleId}`),

  createVehicle: (groupId, vehicleData) => axiosClient.post(`/Group/${groupId}/vehicles`, vehicleData),

  getVehicleSchedule: (groupId, vehicleId, startDate, endDate) =>
    axiosClient.get(`/Group/${groupId}/vehicles/${vehicleId}/schedule?startDate=${startDate}&endDate=${endDate}`),

  // Group Voting
  getGroupVotes: (groupId) => axiosClient.get(`/Group/${groupId}/votes`),

  createVote: (groupId, voteData) => axiosClient.post(`/Group/${groupId}/votes`, voteData),

  submitVote: (groupId, voteId, voteData) => axiosClient.post(`/Group/${groupId}/votes/${voteId}/vote`, voteData),

  // Group Fund Management
  getGroupFund: (groupId) => axiosClient.get(`/Group/${groupId}/fund`),

  contributeFund: (groupId, contribution) => axiosClient.post(`/Group/${groupId}/fund/contribute`, contribution),

  getFundHistory: (groupId) => axiosClient.get(`/Group/${groupId}/fund/history`)
};

export default groupApi;