import axiosClient from './axiosClient';

const maintenanceApi = {
    // ===== README 09 COMPLIANCE - CORE METHODS =====

    // 1. Create maintenance record - POST /api/maintenance
    create: (data) => axiosClient.post('/api/maintenance', {
        vehicleId: data.vehicleId,
        maintenanceType: data.maintenanceType,     // 0-5: RoutineMaintenance, EmergencyRepair, PreventiveMaintenance, Upgrade, Inspection, Warranty
        description: data.description,
        cost: data.cost,
        serviceProvider: data.serviceProvider,
        maintenanceDate: data.maintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate,
        odometer: data.odometer,
        severity: data.severity,                   // 0-2: Low, Medium, High
        isEmergency: data.isEmergency,
        receiptImageUrl: data.receiptImageUrl,
        notes: data.notes,
        bookingId: data.bookingId
    }),

    // 2. Get maintenance by ID - GET /api/maintenance/{id}
    getById: (id) => axiosClient.get(`/api/maintenance/${id}`),

    // 3. Get vehicle maintenances - GET /api/maintenance/vehicle/{vehicleId}
    getByVehicleId: (vehicleId, params) => axiosClient.get(`/api/maintenance/vehicle/${vehicleId}`, {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10
        }
    }),

    // 4. Get vehicle maintenance history - GET /api/maintenance/vehicle/{vehicleId}/history
    getVehicleHistory: (vehicleId) => axiosClient.get(`/api/maintenance/vehicle/${vehicleId}/history`),

    // 5. Get all maintenances (Staff/Admin) - GET /api/maintenance
    getAll: (params) => axiosClient.get('/api/maintenance', {
        params: {
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10
        }
    }),

    // 6. Update maintenance - PUT /api/maintenance/{id}
    update: (id, data) => axiosClient.put(`/api/maintenance/${id}`, {
        description: data.description,
        cost: data.cost,
        serviceProvider: data.serviceProvider,
        maintenanceDate: data.maintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate,
        odometer: data.odometer,
        severity: data.severity,
        notes: data.notes,
        status: data.status
    }),

    // 7. Mark as paid - POST /api/maintenance/{id}/mark-paid
    markAsPaid: (id) => axiosClient.post(`/api/maintenance/${id}/mark-paid`),

    // 8. Delete maintenance (Admin only) - DELETE /api/maintenance/{id}
    delete: (id) => axiosClient.delete(`/api/maintenance/${id}`),

    // 9. Get maintenance statistics (Staff/Admin) - GET /api/maintenance/statistics
    getStatistics: () => axiosClient.get('/api/maintenance/statistics'),

    // 10. Get vehicle maintenance statistics - GET /api/maintenance/vehicle/{vehicleId}/statistics
    getVehicleStatistics: (vehicleId) => axiosClient.get(`/api/maintenance/vehicle/${vehicleId}/statistics`),

    // ===== ADDITIONAL HELPER METHODS =====

    // Get maintenance by type
    getByType: (maintenanceType, params) => axiosClient.get('/api/maintenance', {
        params: {
            maintenanceType,
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10
        }
    }),

    // Get maintenance by date range
    getByDateRange: (startDate, endDate, params) => axiosClient.get('/api/maintenance', {
        params: {
            startDate,
            endDate,
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10
        }
    }),

    // Get unpaid maintenances
    getUnpaidMaintenances: (params) => axiosClient.get('/api/maintenance', {
        params: {
            isPaid: false,
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10
        }
    }),

    // Get emergency maintenances
    getEmergencyMaintenances: (params) => axiosClient.get('/api/maintenance', {
        params: {
            isEmergency: true,
            pageIndex: params?.pageIndex || 1,
            pageSize: params?.pageSize || 10
        }
    }),

    // Get maintenance summary for dashboard
    getSummary: () => axiosClient.get('/api/maintenance/summary'),

    // Get maintenance due soon
    getDueSoon: (days = 30) => axiosClient.get('/api/maintenance/due-soon', {
        params: { days }
    }),

    // Upload maintenance receipt
    uploadReceipt: (maintenanceId, file) => {
        const formData = new FormData();
        formData.append('receipt', file);
        formData.append('maintenanceId', maintenanceId);

        return axiosClient.post('/api/maintenance/upload-receipt', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Export maintenance data
    exportData: (params) => axiosClient.get('/api/maintenance/export', {
        params,
        responseType: 'blob'
    }),

    // ===== LEGACY COMPATIBILITY (Vehicle API Methods) =====

    // Backward compatibility với existing vehicleApi maintenance methods
    addMaintenanceToVehicle: (vehicleId, data) => maintenanceApi.create({ vehicleId, ...data }),
    getMaintenanceHistory: (vehicleId) => maintenanceApi.getByVehicleId(vehicleId),
    updateMaintenanceRecord: (id, data) => maintenanceApi.update(id, data),
    deleteMaintenanceRecord: (id) => maintenanceApi.delete(id)
};

// Export constants for maintenance types and severity
export const MaintenanceType = {
    ROUTINE_MAINTENANCE: 0,
    EMERGENCY_REPAIR: 1,
    PREVENTIVE_MAINTENANCE: 2,
    UPGRADE: 3,
    INSPECTION: 4,
    WARRANTY: 5
};

export const SeverityType = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2
};

export const MaintenanceStatus = {
    SCHEDULED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    CANCELLED: 3
};

export default maintenanceApi;