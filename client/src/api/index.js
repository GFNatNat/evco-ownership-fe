import api from "./axiosClient";

export const AuthService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (form) =>
    api.post("/auth/register", form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/users/me"),
};

export const VehicleService = {
  list: () => api.get("/vehicles"),
  get: (id) => api.get(`/vehicles/${id}`),
  availability: (id, from, to) =>
    api.get(`/vehicles/${id}/availability?from=${from}&to=${to}`),
};

export const ScheduleService = {
  myBookings: () => api.get("/schedules/my"),
  book: (payload) => api.post("/schedules/book", payload),
  cancel: (id) => api.delete(`/schedules/${id}`),
  priorityCheck: (payload) => api.post("/schedules/priority-check", payload),
};

export const GroupService = {
  myGroups: () => api.get("/groups/my"),
  get: (id) => api.get(`/groups/${id}`),
  create: (payload) => api.post("/groups", payload),
  invite: (id, payload) => api.post(`/groups/${id}/invites`, payload),
};

export const CostService = {
  list: (groupId) => api.get(`/groups/${groupId}/costs`),
  add: (groupId, form) =>
    api.post(`/groups/${groupId}/costs`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const PaymentService = {
  list: (groupId) => api.get(`/groups/${groupId}/payments`),
  create: (groupId, payload) =>
    api.post(`/groups/${groupId}/payments`, payload),
};
