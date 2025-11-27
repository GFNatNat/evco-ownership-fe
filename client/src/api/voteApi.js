import axiosClient from "./axiosClient";

const voteApi = {
  create: (data) => axiosClient.post("/vote", data),
  cast: (id, data) => axiosClient.post(`/vote/${id}/cast`, data),
  close: (id) => axiosClient.put(`/vote/${id}/close`),
};
export default voteApi;
