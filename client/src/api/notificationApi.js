import axiosClient from "./axiosClient";

const notificationApi = {
  // Sửa /notification -> /notifications
  send: (data) => axiosClient.post("/notifications/send", data),
  list: () => axiosClient.get("/notifications"),
  mine: () => axiosClient.get("/notifications"),
  markRead: (id) => axiosClient.put(`/notifications/${id}/read`),
};
export default notificationApi;
