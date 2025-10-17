import axiosClient from './axiosClient';
const p = '/api/Contract';
const contractApi = {
  list: (params) => axiosClient.get(p, { params }),
  create: (data) => axiosClient.post(p, data),
  sign: (id, data) => axiosClient.post(`${p}/${id}/sign`, data),
};
export default contractApi;