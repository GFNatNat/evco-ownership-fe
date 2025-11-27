import axiosClient from "./axiosClient";

const scheduleApi = {
  availability: (vehicleId) =>
    axiosClient.get(`/schedule/vehicle/${vehicleId}/availability`),
  book: (data) => axiosClient.post("/schedule/book", data),
  modify: (data) => axiosClient.put("/schedule/modify", data),
  cancel: (id) => axiosClient.delete(`/schedule/cancel/${id}`),
  mySchedule: () => axiosClient.get("/schedule/user"),
  groupCalendar: (groupId) => axiosClient.get(`/schedule/group/${groupId}`),
};
export default scheduleApi;
