import axiosClient from "./axiosClient";

const costApi = {
  // Sửa /cost -> /costs
  add: (data) => axiosClient.post("/costs/add", data),
  settle: (id) => axiosClient.post(`/costs/settle/${id}`),
  history: () => axiosClient.get("/costs/history"),
  outstanding: () => axiosClient.get("/costs/outstanding"),
};
export default costApi;
