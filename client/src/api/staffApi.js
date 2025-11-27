import axios from "../utils/axiosInstance";

const staffApi = {
  // ---- GROUP ----
  createGroup: (data) => axios.post("/staff/groups", data),
  updateGroup: (id, data) => axios.put(`/staff/groups/${id}`, data),
  addMember: (id, data) => axios.post(`/staff/groups/${id}/add-member`, data),
  removeMember: (id, userId) =>
    axios.delete(`/staff/groups/${id}/remove-member/${userId}`),
  getGroup: (id) => axios.get(`/staff/groups/${id}`),

  // ---- CONTRACT ----
  createContract: (data) => axios.post("/staff/contracts", data),
  signContract: (id) => axios.post(`/staff/contracts/sign/${id}`),
  getContract: (id) => axios.get(`/staff/contracts/${id}`),

  // ---- VEHICLE ----
  createVehicle: (data) => axios.post("/staff/vehicles", data),
  updateVehicle: (id, data) => axios.put(`/staff/vehicles/${id}`, data),
  allVehicles: () => axios.get("/staff/vehicles"),
  getVehicle: (id) => axios.get(`/staff/vehicles/${id}`),

  // ---- CHECKIN ----
  qrCode: (vehicleId) => axios.get(`/staff/checkin/qr/${vehicleId}`),
  checkin: (data) => axios.post("/staff/checkin/in", data),
  checkout: (data) => axios.post("/staff/checkin/out", data),
  checkinHistory: (vehicleId) =>
    axios.get(`/staff/checkin/history/${vehicleId}`),

  // ---- DISPUTE ----
  createDispute: (data) => axios.post("/staff/disputes", data),
  updateDispute: (id, data) => axios.put(`/staff/disputes/${id}`, data),
  allDisputes: () => axios.get("/staff/disputes"),
  getDispute: (id) => axios.get(`/staff/disputes/${id}`),

  // ---- REPORT ----
  financial: () => axios.get("/staff/reports/financial"),
  usage: () => axios.get("/staff/reports/usage"),
};

export default staffApi;
