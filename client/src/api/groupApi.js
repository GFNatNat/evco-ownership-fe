import axios from "../utils/axiosInstance";

const groupApi = {
  get: (id) => axios.get(`/groups/${id}`),
  vote: (id) => axios.get(`/groups/${id}/vote`),
  createVote: (id, data) => axios.post(`/groups/${id}/vote`, data),
  castVote: (id, voteId, data) =>
    axios.post(`/groups/${id}/vote/${voteId}`, data),
};

export default groupApi;
