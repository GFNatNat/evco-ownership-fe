import axiosClient from "./axiosClient";

const groupApi = {
  // [THÊM]: Để trang Groups.jsx gọi được
  myGroups: () => axiosClient.get("/groups"),
  create: (data) => axiosClient.post("/groups", data),
  details: (id) => axiosClient.get(`/groups/${id}`),

  // Các hàm khác (sửa đường dẫn thành số nhiều /groups)
  vote: (id) => axiosClient.get(`/groups/${id}/vote`),
  createVote: (id, data) => axiosClient.post(`/groups/${id}/vote`, data),
  castVote: (id, voteId, data) =>
    axiosClient.post(`/groups/${id}/vote/${voteId}`, data),
  addMember: (id, data) => axiosClient.post(`/groups/${id}/add-member`, data),
  removeMember: (id, userId) =>
    axiosClient.delete(`/groups/${id}/remove-member/${userId}`),
  updateFund: (id, data) => axiosClient.put(`/groups/${id}/fund`, data),
};

export default groupApi;
