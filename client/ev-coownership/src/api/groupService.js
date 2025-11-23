import api from './api'

export const groupService = {
  getGroups: () => api.get('/groups').then(r => r.data),
  getGroupById: (id) => api.get(`/groups/${id}`).then(r => r.data),
  createBooking: (groupId, payload) => api.post(`/groups/${groupId}/bookings`, payload).then(r => r.data),
  getBookings: (groupId, from, to) => api.get(`/groups/${groupId}/bookings`, { params: { from, to } }).then(r => r.data)
}