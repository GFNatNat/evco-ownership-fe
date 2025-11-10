/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '@/lib/axiosClient';
export const groupApi = {
  getAll: (params?: any) => axiosClient.get('groups', { params }),
  getById: (id: string) => axiosClient.get(`groups/${id}`),
  create: (payload: any) => axiosClient.post('groups', payload),
  update: (id: string, payload: any) => axiosClient.put(`groups/${id}`, payload),
  removeMember: (groupId: string, userId: string) => axiosClient.delete(`groups/${groupId}/members/${userId}`),
  addMember: (groupId: string, payload: any) => axiosClient.post(`groups/${groupId}/members`, payload),
  disputes: (groupId: string) => axiosClient.get(`groups/${groupId}/disputes`),
  votes: (groupId: string) => axiosClient.get(`groups/${groupId}/votes`),
  createVote: (groupId: string, payload: any) => axiosClient.post(`groups/${groupId}/votes`, payload),
  vote: (groupId: string, voteId: string, option: string) => axiosClient.post(`groups/${groupId}/votes/${voteId}`, { option }),
  treasury: (groupId: string) => axiosClient.get(`groups/${groupId}/treasury`),
};
