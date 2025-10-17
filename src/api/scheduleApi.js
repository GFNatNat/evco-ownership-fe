import axiosClient from './axiosClient';
const base = '/api/Schedule';
const scheduleApi = {
  list: (params) => axiosClient.get(base, { params }),
  book: (data) => axiosClient.post(`${base}/book`, data),
  update: (id, data) => axiosClient.put(`${base}/${id}`, data),
  remove: (id) => axiosClient.delete(`${base}/${id}`),
};
export default scheduleApi;