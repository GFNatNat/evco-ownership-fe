// Staff-specific API endpoints
import axiosClient from '../axiosClient';

const staffApi = {
  // Fleet Management
  fleet: {
    getAll: () => axiosClient.get('/api/staff/fleet'),
    getById: (id) => axiosClient.get(`/api/staff/fleet/${id}`),
    updateStatus: (id, status) => axiosClient.patch(`/api/staff/fleet/${id}/status`, { status }),
    scheduleInspection: (id, date) => axiosClient.post(`/api/staff/fleet/${id}/inspection`, { date }),
    getMaintenanceHistory: (id) => axiosClient.get(`/api/staff/fleet/${id}/maintenance`)
  },

  // Vehicle Verification
  verification: {
    getPendingVerifications: () => axiosClient.get('/api/staff/verification/pending'),
    getVerificationById: (id) => axiosClient.get(`/api/staff/verification/${id}`),
    approveVehicle: (id, notes) => axiosClient.patch(`/api/staff/verification/${id}/approve`, { notes }),
    rejectVehicle: (id, reason) => axiosClient.patch(`/api/staff/verification/${id}/reject`, { reason }),
    requestAdditionalDocs: (id, documents) => axiosClient.patch(`/api/staff/verification/${id}/request-docs`, { documents })
  },

  // Contracts Management
  contracts: {
    getAll: () => axiosClient.get('/api/staff/contracts'),
    getById: (id) => axiosClient.get(`/api/staff/contracts/${id}`),
    create: (contractData) => axiosClient.post('/api/staff/contracts', contractData),
    update: (id, contractData) => axiosClient.put(`/api/staff/contracts/${id}`, contractData),
    getTemplate: (type) => axiosClient.get(`/api/staff/contracts/templates/${type}`),
    sendForSigning: (id) => axiosClient.post(`/api/staff/contracts/${id}/send-for-signing`)
  },

  // Check-in/Check-out Management
  checkin: {
    getActiveRentals: () => axiosClient.get('/api/staff/checkin/active'),
    processCheckin: (rentalId, checkinData) => axiosClient.post(`/api/staff/checkin/${rentalId}/checkin`, checkinData),
    processCheckout: (rentalId, checkoutData) => axiosClient.post(`/api/staff/checkin/${rentalId}/checkout`, checkoutData),
    getVehicleCondition: (vehicleId) => axiosClient.get(`/api/staff/checkin/vehicle/${vehicleId}/condition`),
    reportDamage: (vehicleId, damageReport) => axiosClient.post(`/api/staff/checkin/vehicle/${vehicleId}/damage`, damageReport)
  },

  // Services Management
  services: {
    getAll: () => axiosClient.get('/api/staff/services'),
    getById: (id) => axiosClient.get(`/api/staff/services/${id}`),
    scheduleService: (serviceData) => axiosClient.post('/api/staff/services/schedule', serviceData),
    updateServiceStatus: (id, status) => axiosClient.patch(`/api/staff/services/${id}/status`, { status }),
    getServiceProviders: () => axiosClient.get('/api/staff/services/providers'),
    assignTechnician: (serviceId, technicianId) => axiosClient.patch(`/api/staff/services/${serviceId}/assign`, { technicianId })
  },

  // Disputes Handling
  disputes: {
    getAssignedDisputes: () => axiosClient.get('/api/staff/disputes/assigned'),
    getDisputeById: (id) => axiosClient.get(`/api/staff/disputes/${id}`),
    updateDisputeStatus: (id, status, notes) => axiosClient.patch(`/api/staff/disputes/${id}/status`, { status, notes }),
    addResolutionNote: (id, note) => axiosClient.post(`/api/staff/disputes/${id}/notes`, { note }),
    escalateDispute: (id, reason) => axiosClient.post(`/api/staff/disputes/${id}/escalate`, { reason }),
    closeDispute: (id, resolution) => axiosClient.patch(`/api/staff/disputes/${id}/close`, { resolution })
  },

  // Dashboard Data
  dashboard: {
    getStats: () => axiosClient.get('/api/staff/dashboard/stats'),
    getRecentActivities: () => axiosClient.get('/api/staff/dashboard/activities'),
    getPendingTasks: () => axiosClient.get('/api/staff/dashboard/tasks'),
    getWorkload: () => axiosClient.get('/api/staff/dashboard/workload')
  }
};

export default staffApi;