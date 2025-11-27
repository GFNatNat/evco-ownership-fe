import axios from "../utils/axiosInstance";
const disputeApi = {
  mine: () => axios.get("/disputes/mine"),
  create: (data) => axios.post("/disputes", data),
  detail: (id) => axios.get(`/disputes/${id}`),
};
export default disputeApi;
