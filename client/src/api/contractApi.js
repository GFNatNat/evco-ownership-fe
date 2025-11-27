import axios from "../utils/axiosInstance";
const contractApi = {
  all: () => axios.get("/contracts"),
  create: (data) => axios.post("/contracts", data),
  sign: (id) => axios.post(`/contracts/sign/${id}`),
  detail: (id) => axios.get(`/contracts/${id}`),
};
export default contractApi;
