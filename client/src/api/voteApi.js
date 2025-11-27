import axiosClient from "./axiosClient";

const voteApi = {
  // Sửa /vote -> /votes
  list: () => axiosClient.get("/votes"),
  get: (id) => axiosClient.get(`/votes/${id}`),
  create: (data) => axiosClient.post("/votes", data),
  cast: (id, data) => axiosClient.post(`/votes/${id}/cast`, data),
  close: (id) => axiosClient.put(`/votes/${id}/close`),
};
export default voteApi;
