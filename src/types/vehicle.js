// Vehicle Types - Enhanced with Database Schema Fields
// Based on vehicles table from database schema

/**
 * Enhanced Vehicle interface matching database schema
 * 
 * @typedef {Object} Vehicle
 * @property {number} id - Database: id SERIAL PRIMARY KEY
 * @property {string} name - Database: name VARCHAR(200) NOT NULL
 * @property {string} description - Database: description TEXT
 * @property {string} brand - Database: brand VARCHAR(100) NOT NULL
 * @property {string} model - Database: model VARCHAR(100) NOT NULL
 * @property {number} year - Database: year INTEGER NOT NULL
 * @property {string} vin - Database: vin VARCHAR(17) UNIQUE NOT NULL
 * @property {string} license_plate - Database: license_plate VARCHAR(20) UNIQUE NOT NULL
 * @property {string} color - Database: color VARCHAR(50)
 * @property {number} battery_capacity - Database: battery_capacity DECIMAL(6,2) - NEW FIELD
 * @property {number} range_km - Database: range_km INTEGER - NEW FIELD
 * @property {string} purchase_date - Database: purchase_date DATE NOT NULL
 * @property {number} purchase_price - Database: purchase_price DECIMAL(15,2) NOT NULL
 * @property {string} warranty_until - Database: warranty_until DATE - NEW FIELD
 * @property {number} distance_travelled - Database: distance_travelled INTEGER DEFAULT 0
 * @property {0|1|2|3} status_enum - Database: status_enum INTEGER (0=Available, 1=InUse, 2=Maintenance, 3=Unavailable)
 * @property {0|1|2|3|4} verification_status_enum - Database: verification_status_enum INTEGER
 * @property {number} location_latitude - Database: location_latitude DECIMAL(10,8) - NEW FIELD
 * @property {number} location_longitude - Database: location_longitude DECIMAL(11,8) - NEW FIELD
 * @property {number} created_by - Database: created_by INTEGER REFERENCES users(id)
 * @property {number} fund_id - Database: fund_id INTEGER REFERENCES funds(id)
 * @property {string} created_at - Database: created_at TIMESTAMP DEFAULT NOW()
 * @property {string} updated_at - Database: updated_at TIMESTAMP DEFAULT NOW()
 */

// Vehicle Status Enums - Matching Database
export const VEHICLE_STATUS = Object.freeze({
    AVAILABLE: 0,
    IN_USE: 1,
    MAINTENANCE: 2,
    UNAVAILABLE: 3
});

export const VEHICLE_STATUS_LABELS = {
    [VEHICLE_STATUS.AVAILABLE]: 'Sẵn sàng',
    [VEHICLE_STATUS.IN_USE]: 'Đang sử dụng',
    [VEHICLE_STATUS.MAINTENANCE]: 'Bảo trì',
    [VEHICLE_STATUS.UNAVAILABLE]: 'Không khả dụng'
};

export const VEHICLE_STATUS_COLORS = {
    [VEHICLE_STATUS.AVAILABLE]: '#10b981',    // green
    [VEHICLE_STATUS.IN_USE]: '#3b82f6',       // blue
    [VEHICLE_STATUS.MAINTENANCE]: '#f59e0b',  // yellow
    [VEHICLE_STATUS.UNAVAILABLE]: '#ef4444'  // red
};

// Vehicle Verification Status Enums - Matching Database
export const VEHICLE_VERIFICATION_STATUS = Object.freeze({
    PENDING: 0,
    VERIFICATION_REQUESTED: 1,
    REQUIRES_RECHECK: 2,
    VERIFIED: 3,
    REJECTED: 4
});

export const VEHICLE_VERIFICATION_LABELS = {
    [VEHICLE_VERIFICATION_STATUS.PENDING]: 'Chờ xử lý',
    [VEHICLE_VERIFICATION_STATUS.VERIFICATION_REQUESTED]: 'Yêu cầu xác minh',
    [VEHICLE_VERIFICATION_STATUS.REQUIRES_RECHECK]: 'Cần kiểm tra lại',
    [VEHICLE_VERIFICATION_STATUS.VERIFIED]: 'Đã xác minh',
    [VEHICLE_VERIFICATION_STATUS.REJECTED]: 'Bị từ chối'
};

export const VEHICLE_VERIFICATION_COLORS = {
    [VEHICLE_VERIFICATION_STATUS.PENDING]: '#6b7280',          // gray
    [VEHICLE_VERIFICATION_STATUS.VERIFICATION_REQUESTED]: '#3b82f6', // blue
    [VEHICLE_VERIFICATION_STATUS.REQUIRES_RECHECK]: '#f59e0b',  // yellow
    [VEHICLE_VERIFICATION_STATUS.VERIFIED]: '#10b981',         // green
    [VEHICLE_VERIFICATION_STATUS.REJECTED]: '#ef4444'          // red
};

// Helper functions
export const getVehicleStatusLabel = (status) => {
    return VEHICLE_STATUS_LABELS[status] || 'Không xác định';
};

export const getVehicleStatusColor = (status) => {
    return VEHICLE_STATUS_COLORS[status] || '#6b7280';
};

export const getVerificationStatusLabel = (status) => {
    return VEHICLE_VERIFICATION_LABELS[status] || 'Không xác định';
};

export const getVerificationStatusColor = (status) => {
    return VEHICLE_VERIFICATION_COLORS[status] || '#6b7280';
};

// Vehicle data helpers
export const formatVehicleName = (vehicle) => {
    return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
};

export const formatBatteryCapacity = (capacity) => {
    return capacity ? `${capacity} kWh` : 'N/A';
};

export const formatRange = (range) => {
    return range ? `${range} km` : 'N/A';
};

export const formatDistance = (distance) => {
    if (!distance) return '0 km';
    return distance >= 1000
        ? `${(distance / 1000).toFixed(1)}k km`
        : `${distance} km`;
};

export const formatWarranty = (warrantyUntil) => {
    if (!warrantyUntil) return 'Không có';
    const date = new Date(warrantyUntil);
    const now = new Date();

    if (date < now) return 'Đã hết hạn';

    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 30) return `Còn ${diffDays} ngày`;
    if (diffDays <= 365) return `Còn ${Math.ceil(diffDays / 30)} tháng`;
    return `Còn ${Math.ceil(diffDays / 365)} năm`;
};

// Location helpers
export const hasLocation = (vehicle) => {
    return vehicle.location_latitude && vehicle.location_longitude;
};

export const formatLocation = (vehicle) => {
    if (!hasLocation(vehicle)) return 'Chưa có vị trí';
    return `${vehicle.location_latitude.toFixed(6)}, ${vehicle.location_longitude.toFixed(6)}`;
};

// Validation helpers
export const validateVehicle = (vehicle) => {
    const errors = [];

    if (!vehicle.name || vehicle.name.trim().length === 0) {
        errors.push('Tên xe là bắt buộc');
    }

    if (!vehicle.brand || vehicle.brand.trim().length === 0) {
        errors.push('Hãng xe là bắt buộc');
    }

    if (!vehicle.model || vehicle.model.trim().length === 0) {
        errors.push('Model xe là bắt buộc');
    }

    if (!vehicle.year || vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
        errors.push('Năm sản xuất không hợp lệ');
    }

    if (!vehicle.vin || vehicle.vin.length !== 17) {
        errors.push('VIN phải có 17 ký tự');
    }

    if (!vehicle.license_plate || vehicle.license_plate.trim().length === 0) {
        errors.push('Biển số xe là bắt buộc');
    }

    if (vehicle.battery_capacity && (vehicle.battery_capacity <= 0 || vehicle.battery_capacity > 200)) {
        errors.push('Dung lượng pin phải từ 0-200 kWh');
    }

    if (vehicle.range_km && (vehicle.range_km <= 0 || vehicle.range_km > 1000)) {
        errors.push('Quãng đường di chuyển phải từ 0-1000 km');
    }

    return errors;
};