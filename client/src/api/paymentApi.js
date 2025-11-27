import axiosClient from "./axiosClient";

const paymentApi = {
  create: (data) => axiosClient.post("/payment/create", data),
  webhook: (data) => axiosClient.post("/payment/webhook", data), // usually handled server-side
};

export default paymentApi;
