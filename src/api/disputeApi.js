import axiosClient from './axiosClient';
const p = '/api/Dispute';
const disputeApi = {
  list: (params) => axiosClient.get(p, { params }),
  create: (data) => axiosClient.post(p, data),
  updateStatus: (id, data) => axiosClient.put(`${p}/${id}/status`, data),
};
export default disputeApi;