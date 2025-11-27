import axiosClient from "./axiosClient";

const scheduleApi = {
  // Sửa /schedule -> /schedules
  availability: (vehicleId) =>
    axiosClient.get(`/schedules/vehicle/${vehicleId}/availability`),
  book: (data) => axiosClient.post("/schedules/book", data),
  modify: (data) => axiosClient.put("/schedules/modify", data),
  cancel: (id) => axiosClient.delete(`/schedules/cancel/${id}`),
  mySchedule: () => axiosClient.get("/schedules/user"),
  groupCalendar: (groupId) => axiosClient.get(`/schedules/group/${groupId}`),
};
export default scheduleApi;
