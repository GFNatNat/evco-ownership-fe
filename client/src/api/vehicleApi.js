import axios from "../utils/axiosInstance";
const vehicleApi = {
  all: () => axios.get("/vehicles"),
  detail: (id) => axios.get(`/vehicles/${id}`),
};
export default vehicleApi;
