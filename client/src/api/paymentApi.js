import axiosClient from "./axiosClient";

const paymentApi = {
  create: (data) => axiosClient.post("/payments/create", data),
  webhook: (data) => axiosClient.post("/payments/webhook", data),
};

export default paymentApi;
