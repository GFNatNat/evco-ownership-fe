import axiosClient from "./axiosClient";

const notificationApi = {
  send: (data) => axiosClient.post("/notification/send", data),
  list: () => axiosClient.get("/notification"),
  markRead: (id) => axiosClient.put(`/notification/${id}/read`),
};

export default notificationApi;
