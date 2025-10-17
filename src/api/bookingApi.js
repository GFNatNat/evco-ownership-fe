import axiosClient from './axiosClient';
const p = '/api/Booking';
const bookingApi = {
  checkIn: (data) => axiosClient.post(`${p}/check-in`, data),
  checkOut: (data) => axiosClient.post(`${p}/check-out`, data),
  listToday: () => axiosClient.get(`${p}/today`),
};
export default bookingApi;