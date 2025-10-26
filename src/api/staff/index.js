// Staff-specific API endpoints
import axiosClient from '../axiosClient';

const staffApi = {
  // Fleet Management
  fleet: {
    getAll: () => axiosClient.get('/api/Vehicle'),
    getById: (id) => axiosClient.get(`/api/Vehicle/${id}`),
    updateStatus: (id, status) => axiosClient.patch(`/api/Vehicle/${id}/status`, { status }),
    scheduleInspection: (id, date) => axiosClient.post(`/api/Maintenance`, { vehicleId: id, date }),
    getMaintenanceHistory: (id) => axiosClient.get(`/api/Maintenance/vehicle/${id}/history`)
  },

  // Vehicle Verification
  verification: {
    getPendingVerifications: () => axiosClient.get('/api/License'),
    getVerificationById: (id) => axiosClient.get(`/api/License/${id}`),
    approveVehicle: (id, notes) => axiosClient.patch(`/api/License/${id}/approve`, { notes }),
    rejectVehicle: (id, reason) => axiosClient.patch(`/api/License/${id}/reject`, { reason }),
    requestAdditionalDocs: (id, documents) => axiosClient.patch(`/api/License/${id}/request-docs`, { documents })
  },

  // Contracts Management
  contracts: {
    getAll: () => axiosClient.get('/api/Contract'),
    getById: (id) => axiosClient.get(`/api/Contract/${id}`),
    create: (contractData) => axiosClient.post('/api/Contract', contractData),
    update: (id, contractData) => axiosClient.put(`/api/Contract/${id}`, contractData),
    getTemplate: (type) => axiosClient.get(`/api/Contract/templates/${type}`),
    sendForSigning: (id) => axiosClient.post(`/api/Contract/${id}/sign`)
  },

  // Check-in/Check-out Management
  checkin: {
    getActiveRentals: () => axiosClient.get('/api/CheckInCheckOut/history'),
    processCheckin: (rentalId, checkinData) => axiosClient.post(`/api/CheckInCheckOut/manual-checkin`, { rentalId, ...checkinData }),
    processCheckout: (rentalId, checkoutData) => axiosClient.post(`/api/CheckInCheckOut/manual-checkout`, { rentalId, ...checkoutData }),
    getVehicleCondition: (vehicleId) => axiosClient.get(`/api/Vehicle/${vehicleId}/condition`),
    reportDamage: (vehicleId, damageReport) => axiosClient.post(`/api/Vehicle/${vehicleId}/damage`, damageReport)
  },

  // Services Management
  services: {
    getAll: () => axiosClient.get('/api/Service'),
    getById: (id) => axiosClient.get(`/api/Service/${id}`),
    scheduleService: (serviceData) => axiosClient.post('/api/Service', serviceData),
    updateServiceStatus: (id, status) => axiosClient.patch(`/api/Service/${id}/status`, { status }),
    getServiceProviders: () => axiosClient.get('/api/Service/providers'),
    assignTechnician: (serviceId, technicianId) => axiosClient.patch(`/api/Service/${serviceId}/assign`, { technicianId })
  },

  // Disputes Handling
  disputes: {
    getAssignedDisputes: () => axiosClient.get('/api/Dispute'),
    getDisputeById: (id) => axiosClient.get(`/api/Dispute/${id}`),
    updateDisputeStatus: (id, status, notes) => axiosClient.patch(`/api/Dispute/${id}/status`, { status, notes }),
    addResolutionNote: (id, note) => axiosClient.post(`/api/Dispute/${id}/notes`, { note }),
    escalateDispute: (id, reason) => axiosClient.post(`/api/Dispute/${id}/escalate`, { reason }),
    closeDispute: (id, resolution) => axiosClient.patch(`/api/Dispute/${id}/close`, { resolution })
  },

  // Dashboard Data
  dashboard: {
    getStats: () => axiosClient.get('/api/Dashboard/stats'),
    getRecentActivities: () => axiosClient.get('/api/Dashboard/activities'),
    getPendingTasks: () => axiosClient.get('/api/Dashboard/tasks'),
    getWorkload: () => axiosClient.get('/api/Dashboard/workload')
  }
};

export default staffApi;