import axiosClient from './axiosClient';
const p = '/api/Vehicle';
const vehicleApi = {
  list: (params) => axiosClient.get(p, { params }),
  create: (data) => axiosClient.post(p, data),
  update: (id, data) => axiosClient.put(`${p}/${id}`, data),
  remove: (id) => axiosClient.delete(`${p}/${id}`),
};
export default vehicleApi;