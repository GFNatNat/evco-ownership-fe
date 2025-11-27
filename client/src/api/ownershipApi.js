import axiosClient from "./axiosClient";

const ownershipApi = {
  assign: (data) => axiosClient.post("/ownership/assign", data),
  update: (data) => axiosClient.put("/ownership/update", data),
  ofVehicle: (vehicleId) => axiosClient.get(`/ownership/vehicle/${vehicleId}`),
  remove: (groupId, userId) =>
    axiosClient.delete(`/ownership/remove/${groupId}/${userId}`),
  history: (vehicleId) => axiosClient.get(`/ownership/history/${vehicleId}`),
};

export default ownershipApi;
