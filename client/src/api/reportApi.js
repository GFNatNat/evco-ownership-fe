import axios from "../utils/axiosInstance";
const reportApi = {
  finance: () => axios.get("/reports/financial"),
  usage: () => axios.get("/reports/usage"),
  // Admin overrides
  adminStats: () => axios.get("/admin/reports/usage"),
};
export default reportApi;
