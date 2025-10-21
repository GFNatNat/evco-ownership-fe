import axiosClient from './axiosClient';

const vehicleApi = {
  // Basic CRUD operations
  getAll: (params) => axiosClient.get('/api/Vehicle', { params }),
  getById: (id) => axiosClient.get(`/api/Vehicle/${id}`),
  create: (data) => axiosClient.post('/api/Vehicle', {
    make: data.make,
    model: data.model,
    year: data.year,
    color: data.color,
    licensePlate: data.licensePlate,
    vinNumber: data.vinNumber,
    engineNumber: data.engineNumber,
    registrationNumber: data.registrationNumber,
    description: data.description,
    purchasePrice: data.purchasePrice,
    estimatedValue: data.estimatedValue,
    vehicleCondition: data.vehicleCondition || 'Good'
  }),
  update: (id, data) => axiosClient.put(`/api/Vehicle/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/Vehicle/${id}`),

  // Vehicle verification (Staff only)
  verify: (id, data) => axiosClient.post(`/api/Vehicle/${id}/verify`, {
    verificationStatus: data.verificationStatus,
    verificationNotes: data.verificationNotes,
    verifiedBy: data.verifiedBy
  }),

  updateVerificationStatus: (id, status) => axiosClient.put(`/api/Vehicle/${id}/verification-status`, {
    status: status
  }),

  getVerificationHistory: (id) => axiosClient.get(`/api/Vehicle/${id}/verification-history`),

  // Vehicle condition management
  updateCondition: (id, data) => axiosClient.post(`/api/Vehicle/${id}/condition`, {
    conditionType: data.conditionType,
    description: data.description,
    reportedBy: data.reportedBy,
    maintenanceRequired: data.maintenanceRequired
  }),

  getConditionHistory: (id) => axiosClient.get(`/api/Vehicle/${id}/conditions`),

  // Vehicle statistics and reports
  getUsageStats: (id) => axiosClient.get(`/api/Vehicle/${id}/usage-stats`),
  getMaintenanceCosts: (id) => axiosClient.get(`/api/Vehicle/${id}/maintenance-costs`),

  // User's vehicles
  getMyVehicles: () => axiosClient.get('/api/Vehicle/my-vehicles'),
  getVehiclesByOwner: (ownerId) => axiosClient.get(`/api/Vehicle/owner/${ownerId}`)
};

export default vehicleApi;