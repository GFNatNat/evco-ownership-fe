// All endpoints updated to use capitalized controller names (e.g., /api/Vehicle) to match Swagger
import axiosClient from './axiosClient';

const vehicleApi = {
  // Core Vehicle API endpoints as per 06-VEHICLE-API-COMPLETE.md

  // 1. POST /api/vehicle - Create new vehicle (Co-owner)
  create: (data) => axiosClient.post('/api/Vehicle', {
    name: data.name,
    brand: data.brand,
    model: data.model,
    year: data.year,
    vin: data.vin,
    licensePlate: data.licensePlate,
    color: data.color,
    batteryCapacity: data.batteryCapacity,
    range: data.range,
    purchaseDate: data.purchaseDate,
    purchasePrice: data.purchasePrice,
    warrantyExpiryDate: data.warrantyExpiryDate,
    latitude: data.latitude,
    longitude: data.longitude
  }),

  // 2. POST /api/vehicle/{vehicleId}/co-owners - Add co-owner
  addCoOwner: (vehicleId, data) => axiosClient.post(`/api/Vehicle/${vehicleId}/co-owners`, {
    userId: data.userId,
    ownershipPercentage: data.ownershipPercentage,
    investmentAmount: data.investmentAmount
  }),

  // 3. PUT /api/vehicle/{vehicleId}/invitations/respond - Respond to invitation
  respondToInvitation: (vehicleId, data) => axiosClient.put(`/api/Vehicle/${vehicleId}/invitations/respond`, {
    response: data.response
  }),

  // 4. GET /api/vehicle/{vehicleId}/details - Get vehicle details (legacy)
  getDetails: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/details`),

  // 5. GET /api/vehicle/my-vehicles - Get my vehicles
  getMyVehicles: () => axiosClient.get('/api/Vehicle/my-vehicles'),

  // 6. GET /api/vehicle/invitations/pending - Get pending invitations
  getPendingInvitations: () => axiosClient.get('/api/Vehicle/invitations/pending'),

  // 7. DELETE /api/vehicle/{vehicleId}/co-owners/{coOwnerUserId} - Remove co-owner
  removeCoOwner: (vehicleId, coOwnerUserId) => axiosClient.delete(`/api/Vehicle/${vehicleId}/co-owners/${coOwnerUserId}`),

  // 8. PUT /api/vehicle/{vehicleId} - Update vehicle info
  update: (vehicleId, data) => axiosClient.put(`/api/Vehicle/${vehicleId}`, data),

  // 9. GET /api/vehicle/available - Get available vehicles with filters
  getAvailable: (params) => axiosClient.get('/api/Vehicle/available', { params }),

  // 10. GET /api/vehicle/{vehicleId} - Get full vehicle details
  getById: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}`),

  // 11. GET /api/vehicle/validate-creation-eligibility - Check creation eligibility
  validateCreationEligibility: () => axiosClient.get('/api/Vehicle/validate-creation-eligibility'),

  // 12. GET /api/vehicle/{vehicleId}/availability/schedule - Get availability schedule  
  getAvailabilitySchedule: (vehicleId, params) => axiosClient.get(`/api/Vehicle/${vehicleId}/availability/schedule`, { params }),

  // 13. GET /api/vehicle/{vehicleId}/availability/find-slots - Find available slots
  findAvailableSlots: (vehicleId, params) => axiosClient.get(`/api/Vehicle/${vehicleId}/availability/find-slots`, { params }),

  // 14. GET /api/vehicle/utilization/compare - Compare utilization
  compareUtilization: (params) => axiosClient.get('/api/Vehicle/utilization/compare', { params }),

  // Vehicle verification (Staff only)
  verify: (id, data) => axiosClient.post(`/api/Vehicle/${id}/verify`, {
    verificationStatus: data.verificationStatus,
    verificationNotes: data.verificationNotes,
    verifiedBy: data.verifiedBy
  }),

  updateVerificationStatus: (id, status) => axiosClient.put(`/api/Vehicle/${id}/verification-status`, {
    status: status
  }),


  // Legacy/Extended methods for backward compatibility
  getAll: (params) => vehicleApi.getAvailable(params),
  delete: (id) => axiosClient.delete(`/api/Vehicle/${id}`),

  // Maintenance management (legacy)
  addMaintenance: (vehicleId, data) => axiosClient.post(`/api/Vehicle/${vehicleId}/maintenance`, data),
  getMaintenanceHistory: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/maintenance`),
  updateMaintenance: (vehicleId, maintenanceId, data) => axiosClient.put(`/api/Vehicle/${vehicleId}/maintenance/${maintenanceId}`, data),
  deleteMaintenance: (vehicleId, maintenanceId) => axiosClient.delete(`/api/Vehicle/${vehicleId}/maintenance/${maintenanceId}`),

  // Insurance management (legacy)
  addInsurance: (vehicleId, data) => axiosClient.post(`/api/Vehicle/${vehicleId}/insurance`, data),
  getInsuranceHistory: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/insurance`),
  updateInsurance: (vehicleId, insuranceId, data) => axiosClient.put(`/api/Vehicle/${vehicleId}/insurance/${insuranceId}`, data),

  // Document management (legacy)
  uploadDocument: (vehicleId, data) => axiosClient.post(`/api/Vehicle/${vehicleId}/documents`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDocuments: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/documents`),
  deleteDocument: (vehicleId, documentId) => axiosClient.delete(`/api/Vehicle/${vehicleId}/documents/${documentId}`),

  // Co-ownership management (legacy - use core endpoints instead)
  getCoOwners: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/co-owners`),
  inviteCoOwner: (vehicleId, data) => vehicleApi.addCoOwner(vehicleId, data),
  updateOwnershipShare: (vehicleId, coOwnerId, data) => axiosClient.put(`/api/Vehicle/${vehicleId}/co-owners/${coOwnerId}/share`, data),
  getOwnershipHistory: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/ownership-history`),

  // Booking management (legacy)
  getVehicleBookings: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/bookings`),
  getAvailableSlots: (vehicleId, startDate, endDate) => vehicleApi.findAvailableSlots(vehicleId, { startDate, endDate }),
  setAvailability: (vehicleId, data) => axiosClient.post(`/api/Vehicle/${vehicleId}/availability`, data),
  updateBookingStatus: (vehicleId, bookingId, status) => axiosClient.put(`/api/Vehicle/${vehicleId}/bookings/${bookingId}/status`, { status }),

  // Vehicle stats and analytics (legacy)
  getStatistics: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/statistics`),
  getUsageAnalytics: (vehicleId, params) => vehicleApi.compareUtilization({ vehicleIds: [vehicleId], ...params }),
  getRevenueAnalytics: (vehicleId, params) => axiosClient.get(`/api/Vehicle/${vehicleId}/revenue`, { params }),

  // Search and filtering (legacy)
  search: (query, filters) => vehicleApi.getAvailable({ query, ...filters }),
  getByLocation: (latitude, longitude, radius) => vehicleApi.getAvailable({ latitude, longitude, radius }),
  getByCategory: (category, params) => vehicleApi.getAvailable({ category, ...params }),

  // Status management (legacy)
  updateStatus: (vehicleId, status) => axiosClient.put(`/api/Vehicle/${vehicleId}/status`, { status }),
  getStatusHistory: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/status-history`),

  // Verification (legacy)
  requestVerification: (vehicleId) => axiosClient.post(`/api/Vehicle/${vehicleId}/verification/request`),
  getVerificationStatus: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/verification/status`),
  getVerificationHistory: (id) => axiosClient.get(`/api/Vehicle/${id}/verification-history`),

  // Vehicle condition management (legacy)
  updateCondition: (id, data) => axiosClient.post(`/api/Vehicle/${id}/condition`, {
    conditionType: data.conditionType,
    description: data.description,
    reportedBy: data.reportedBy,
    maintenanceRequired: data.maintenanceRequired
  }),
  getConditionHistory: (id) => axiosClient.get(`/api/Vehicle/${id}/conditions`),

  // Vehicle statistics and reports (legacy)
  getUsageStats: (id) => axiosClient.get(`/api/Vehicle/${id}/usage-stats`),
  getMaintenanceCosts: (id) => axiosClient.get(`/api/Vehicle/${id}/maintenance-costs`),

  // User's vehicles (legacy - use getMyVehicles core endpoint)
  getVehiclesByOwner: (ownerId) => axiosClient.get(`/api/Vehicle/owner/${ownerId}`)
};

export default vehicleApi;