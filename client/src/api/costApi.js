import axiosClient from "./axiosClient";

const costApi = {
  add: (data) => axiosClient.post("/cost/add", data),
  settle: (id) => axiosClient.post(`/cost/settle/${id}`),
  history: () => axiosClient.get("/cost/history"),
  outstanding: () => axiosClient.get("/cost/outstanding"),
};

export default costApi;
