// Maintenance Types and Status Constants
// Based on database schema tables: maintenance_costs, vehicles, maintenance tasks

// Maintenance Task Status Enums - Based on database pattern
export const MAINTENANCE_STATUS = Object.freeze({
    PENDING: 0,        // Chờ xử lý
    IN_PROGRESS: 1,    // Đang thực hiện
    COMPLETED: 2,      // Hoàn thành
    CANCELLED: 3,      // Đã hủy
    ON_HOLD: 4         // Tạm dừng
});

// Maintenance Priority Levels
export const MAINTENANCE_PRIORITY = Object.freeze({
    LOW: 0,            // Thấp
    MEDIUM: 1,         // Trung bình
    HIGH: 2,           // Cao
    URGENT: 3          // Khẩn cấp
});

// Maintenance Types - Based on common vehicle maintenance categories
export const MAINTENANCE_TYPE = Object.freeze({
    PREVENTIVE: 0,     // Bảo dưỡng định kỳ
    CORRECTIVE: 1,     // Sửa chữa
    EMERGENCY: 2,      // Khẩn cấp
    UPGRADE: 3,        // Nâng cấp
    INSPECTION: 4      // Kiểm tra
});

// Maintenance Cost Categories - Based on database maintenance_costs table
export const MAINTENANCE_COST_CATEGORY = Object.freeze({
    LABOR: 0,          // Chi phí nhân công
    PARTS: 1,          // Chi phí phụ tùng
    MATERIALS: 2,      // Chi phí vật liệu
    EXTERNAL: 3,       // Chi phí dịch vụ bên ngoài
    OTHER: 4           // Chi phí khác
});

// Service Provider Types
export const SERVICE_PROVIDER_TYPE = Object.freeze({
    INTERNAL: 0,       // Nội bộ
    EXTERNAL: 1,       // Bên ngoài
    WARRANTY: 2        // Bảo hành
});

// Status Labels in Vietnamese
export const MAINTENANCE_STATUS_LABELS = {
    [MAINTENANCE_STATUS.PENDING]: 'Chờ xử lý',
    [MAINTENANCE_STATUS.IN_PROGRESS]: 'Đang thực hiện',
    [MAINTENANCE_STATUS.COMPLETED]: 'Hoàn thành',
    [MAINTENANCE_STATUS.CANCELLED]: 'Đã hủy',
    [MAINTENANCE_STATUS.ON_HOLD]: 'Tạm dừng'
};

export const MAINTENANCE_PRIORITY_LABELS = {
    [MAINTENANCE_PRIORITY.LOW]: 'Thấp',
    [MAINTENANCE_PRIORITY.MEDIUM]: 'Trung bình',
    [MAINTENANCE_PRIORITY.HIGH]: 'Cao',
    [MAINTENANCE_PRIORITY.URGENT]: 'Khẩn cấp'
};

export const MAINTENANCE_TYPE_LABELS = {
    [MAINTENANCE_TYPE.PREVENTIVE]: 'Bảo dưỡng định kỳ',
    [MAINTENANCE_TYPE.CORRECTIVE]: 'Sửa chữa',
    [MAINTENANCE_TYPE.EMERGENCY]: 'Khẩn cấp',
    [MAINTENANCE_TYPE.UPGRADE]: 'Nâng cấp',
    [MAINTENANCE_TYPE.INSPECTION]: 'Kiểm tra'
};

export const MAINTENANCE_COST_CATEGORY_LABELS = {
    [MAINTENANCE_COST_CATEGORY.LABOR]: 'Chi phí nhân công',
    [MAINTENANCE_COST_CATEGORY.PARTS]: 'Chi phí phụ tùng',
    [MAINTENANCE_COST_CATEGORY.MATERIALS]: 'Chi phí vật liệu',
    [MAINTENANCE_COST_CATEGORY.EXTERNAL]: 'Chi phí dịch vụ bên ngoài',
    [MAINTENANCE_COST_CATEGORY.OTHER]: 'Chi phí khác'
};

export const SERVICE_PROVIDER_TYPE_LABELS = {
    [SERVICE_PROVIDER_TYPE.INTERNAL]: 'Nội bộ',
    [SERVICE_PROVIDER_TYPE.EXTERNAL]: 'Bên ngoài',
    [SERVICE_PROVIDER_TYPE.WARRANTY]: 'Bảo hành'
};

// Status Colors for UI
export const MAINTENANCE_STATUS_COLORS = {
    [MAINTENANCE_STATUS.PENDING]: '#6b7280',        // gray
    [MAINTENANCE_STATUS.IN_PROGRESS]: '#3b82f6',    // blue
    [MAINTENANCE_STATUS.COMPLETED]: '#10b981',      // green
    [MAINTENANCE_STATUS.CANCELLED]: '#ef4444',      // red
    [MAINTENANCE_STATUS.ON_HOLD]: '#f59e0b'         // yellow
};

export const MAINTENANCE_PRIORITY_COLORS = {
    [MAINTENANCE_PRIORITY.LOW]: '#10b981',          // green
    [MAINTENANCE_PRIORITY.MEDIUM]: '#f59e0b',       // yellow
    [MAINTENANCE_PRIORITY.HIGH]: '#f97316',         // orange
    [MAINTENANCE_PRIORITY.URGENT]: '#ef4444'       // red
};

export const MAINTENANCE_TYPE_COLORS = {
    [MAINTENANCE_TYPE.PREVENTIVE]: '#3b82f6',       // blue
    [MAINTENANCE_TYPE.CORRECTIVE]: '#f59e0b',       // yellow
    [MAINTENANCE_TYPE.EMERGENCY]: '#ef4444',        // red
    [MAINTENANCE_TYPE.UPGRADE]: '#8b5cf6',          // purple
    [MAINTENANCE_TYPE.INSPECTION]: '#10b981'        // green
};

// Helper functions
export const getMaintenanceStatusLabel = (status) => {
    return MAINTENANCE_STATUS_LABELS[status] || 'Không xác định';
};

export const getMaintenanceStatusColor = (status) => {
    return MAINTENANCE_STATUS_COLORS[status] || '#6b7280';
};

export const getMaintenancePriorityLabel = (priority) => {
    return MAINTENANCE_PRIORITY_LABELS[priority] || 'Không xác định';
};

export const getMaintenancePriorityColor = (priority) => {
    return MAINTENANCE_PRIORITY_COLORS[priority] || '#6b7280';
};

export const getMaintenanceTypeLabel = (type) => {
    return MAINTENANCE_TYPE_LABELS[type] || 'Không xác định';
};

export const getMaintenanceTypeColor = (type) => {
    return MAINTENANCE_TYPE_COLORS[type] || '#6b7280';
};

export const getCostCategoryLabel = (category) => {
    return MAINTENANCE_COST_CATEGORY_LABELS[category] || 'Không xác định';
};

export const getServiceProviderTypeLabel = (type) => {
    return SERVICE_PROVIDER_TYPE_LABELS[type] || 'Không xác định';
};

// Validation helpers
export const isValidMaintenanceStatus = (status) => {
    return Object.values(MAINTENANCE_STATUS).includes(status);
};

export const isValidMaintenancePriority = (priority) => {
    return Object.values(MAINTENANCE_PRIORITY).includes(priority);
};

export const isValidMaintenanceType = (type) => {
    return Object.values(MAINTENANCE_TYPE).includes(type);
};

export const isValidCostCategory = (category) => {
    return Object.values(MAINTENANCE_COST_CATEGORY).includes(category);
};