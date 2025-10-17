import axiosClient from './axiosClient';
const p = '/api/Group';
const groupApi = {
  list: (params) => axiosClient.get(p, { params }),
  get: (id) => axiosClient.get(`${p}/${id}`),
  create: (data) => axiosClient.post(p, data),
  update: (id, data) => axiosClient.put(`${p}/${id}`, data),
  remove: (id) => axiosClient.delete(`${p}/${id}`),

  // members & roles
  listMembers: (groupId) => axiosClient.get(`${p}/${groupId}/members`),
  addMember: (groupId, data) => axiosClient.post(`${p}/${groupId}/members`, data),
  removeMember: (groupId, memberId) => axiosClient.delete(`${p}/${groupId}/members/${memberId}`),
  updateMemberRole: (groupId, memberId, data) => axiosClient.put(`${p}/${groupId}/members/${memberId}/role`, data),

  // votes
  listVotes: (groupId) => axiosClient.get(`${p}/${groupId}/votes`),
  createVote: (groupId, data) => axiosClient.post(`${p}/${groupId}/votes`, data),
  vote: (groupId, voteId, data) => axiosClient.post(`${p}/${groupId}/votes/${voteId}/vote`, data),

  // fund
  getFund: (groupId) => axiosClient.get(`${p}/${groupId}/fund`),
  contributeFund: (groupId, data) => axiosClient.post(`${p}/${groupId}/fund/contribute`, data),
  fundHistory: (groupId) => axiosClient.get(`${p}/${groupId}/fund/history`),
};
export default groupApi;