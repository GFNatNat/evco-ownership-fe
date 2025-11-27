import axios from "../utils/axiosInstance";

const adminApi = {
  // ---- GROUP ----
  createGroup: (data) => axios.post("/admin/groups", data),
  updateGroup: (id, data) => axios.put(`/admin/groups/${id}`, data),
  deleteGroup: (id) => axios.delete(`/admin/groups/${id}`),
  addMember: (id, data) => axios.post(`/admin/groups/${id}/add-member`, data),
  removeMember: (id, userId) =>
    axios.delete(`/admin/groups/${id}/remove-member/${userId}`),
  getGroup: (id) => axios.get(`/admin/groups/${id}`),
  getGroupFund: (id) => axios.get(`/admin/groups/${id}/fund`),
  updateGroupFund: (id, data) => axios.put(`/admin/groups/${id}/fund`, data),

  // ---- CONTRACT ----
  createContract: (data) => axios.post("/admin/contracts", data),
  signContract: (id) => axios.post(`/admin/contracts/sign/${id}`),
  getContract: (id) => axios.get(`/admin/contracts/${id}`),

  // ---- VEHICLE ----
  createVehicle: (data) => axios.post("/admin/vehicles", data),
  updateVehicle: (id, data) => axios.put(`/admin/vehicles/${id}`, data),
  deleteVehicle: (id) => axios.delete(`/admin/vehicles/${id}`),
  allVehicles: () => axios.get("/admin/vehicles"),
  getVehicle: (id) => axios.get(`/admin/vehicles/${id}`),

  // ---- DISPUTE ----
  createDispute: (data) => axios.post("/admin/disputes", data),
  updateDispute: (id, data) => axios.put(`/admin/disputes/${id}`, data),
  resolveDispute: (id) => axios.put(`/admin/disputes/${id}/resolve`),
  allDisputes: () => axios.get("/admin/disputes"),
  getDispute: (id) => axios.get(`/admin/disputes/${id}`),

  // ---- REPORT ----
  financial: () => axios.get("/admin/reports/financial"),
  usage: () => axios.get("/admin/reports/usage"),
};

export default adminApi;
