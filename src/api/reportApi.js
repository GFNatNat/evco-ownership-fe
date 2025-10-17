import axiosClient from './axiosClient';
const p = '/api/Report';
const reportApi = {
  financial: (params) => axiosClient.get(`${p}/financial`, { params }),
};
export default reportApi;