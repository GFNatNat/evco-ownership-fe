import axiosClient from "./axiosClient";

const checkinApi = {
  generateQR: (vehicleId) => axiosClient.get(`/checkin/qr/${vehicleId}`),
  checkIn: (data) => axiosClient.post(`/checkin/in`, data),
  checkOut: (data) => axiosClient.post(`/checkin/out`, data),
  getHistory: (vehicleId) => axiosClient.get(`/checkin/history/${vehicleId}`),
};

export default checkinApi;
