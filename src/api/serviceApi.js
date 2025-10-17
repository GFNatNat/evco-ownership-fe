import axiosClient from './axiosClient';
const p = '/api/Service';
const serviceApi = {
  list: (params) => axiosClient.get(p, { params }),
  start: (id) => axiosClient.post(`${p}/${id}/start`),
  complete: (id) => axiosClient.post(`${p}/${id}/complete`),
};
export default serviceApi;