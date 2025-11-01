// Maintenance Types - Enhanced with Database Schema Fields
// Based on maintenance_costs table and related maintenance system from database schema

/**
 * Maintenance Task interface matching database schema expectations
 * 
 * @typedef {Object} MaintenanceTask
 * @property {number} id - Database: id SERIAL PRIMARY KEY
 * @property {string} title - Task title/name
 * @property {string} description - Detailed description of maintenance task
 * @property {number} vehicle_id - Database: vehicle_id INTEGER REFERENCES vehicles(id)
 * @property {0|1|2|3|4} status_enum - Database: status enumeration (0=Pending, 1=InProgress, 2=Completed, 3=Cancelled, 4=OnHold)
 * @property {0|1|2|3} priority_enum - Database: priority level (0=Low, 1=Medium, 2=High, 3=Urgent)
 * @property {0|1|2|3|4} type_enum - Database: maintenance type (0=Preventive, 1=Corrective, 2=Emergency, 3=Upgrade, 4=Inspection)
 * @property {number} assigned_staff_id - Database: assigned_staff_id INTEGER REFERENCES users(id)
 * @property {string} scheduled_date - Database: scheduled_date TIMESTAMP
 * @property {string} completed_date - Database: completed_date TIMESTAMP
 * @property {number} estimated_cost - Database: estimated_cost DECIMAL(10,2)
 * @property {number} actual_cost - Database: actual_cost DECIMAL(10,2)
 * @property {string} notes - Database: notes TEXT
 * @property {string} created_at - Database: created_at TIMESTAMP DEFAULT NOW()
 * @property {string} updated_at - Database: updated_at TIMESTAMP DEFAULT NOW()
 */

/**
 * Maintenance Cost interface matching database schema
 * 
 * @typedef {Object} MaintenanceCost
 * @property {number} id - Database: id SERIAL PRIMARY KEY
 * @property {number} maintenance_task_id - Database: maintenance_task_id INTEGER REFERENCES maintenance_tasks(id)
 * @property {0|1|2|3|4} category_enum - Database: category enumeration (0=Labor, 1=Parts, 2=Materials, 3=External, 4=Other)
 * @property {string} description - Cost item description
 * @property {number} amount - Database: amount DECIMAL(10,2) NOT NULL
 * @property {0|1|2} provider_type_enum - Database: provider type (0=Internal, 1=External, 2=Warranty)
 * @property {string} provider_name - Name of service provider
 * @property {string} receipt_url - Database: receipt_url VARCHAR(500) - URL to receipt/invoice
 * @property {string} date_incurred - Database: date_incurred DATE NOT NULL
 * @property {string} created_at - Database: created_at TIMESTAMP DEFAULT NOW()
 */

/**
 * Maintenance Schedule interface
 * 
 * @typedef {Object} MaintenanceSchedule
 * @property {number} id - Database: id SERIAL PRIMARY KEY
 * @property {number} vehicle_id - Database: vehicle_id INTEGER REFERENCES vehicles(id)
 * @property {0|1|2|3|4} maintenance_type_enum - Scheduled maintenance type
 * @property {number} interval_km - Database: interval_km INTEGER - Maintenance interval in kilometers
 * @property {number} interval_months - Database: interval_months INTEGER - Maintenance interval in months
 * @property {number} last_performed_km - Database: last_performed_km INTEGER - Last maintenance odometer reading
 * @property {string} last_performed_date - Database: last_performed_date DATE
 * @property {string} next_due_date - Database: next_due_date DATE
 * @property {number} next_due_km - Database: next_due_km INTEGER - Next maintenance due at this odometer reading
 * @property {boolean} is_active - Database: is_active BOOLEAN DEFAULT TRUE
 * @property {string} created_at - Database: created_at TIMESTAMP DEFAULT NOW()
 * @property {string} updated_at - Database: updated_at TIMESTAMP DEFAULT NOW()
 */

/**
 * Maintenance History interface for reporting
 * 
 * @typedef {Object} MaintenanceHistory
 * @property {number} vehicle_id - Vehicle ID
 * @property {Array<MaintenanceTask>} tasks - All maintenance tasks for vehicle
 * @property {Array<MaintenanceCost>} costs - All maintenance costs for vehicle
 * @property {number} total_cost - Total maintenance cost
 * @property {number} total_tasks - Total number of maintenance tasks
 * @property {string} last_maintenance_date - Date of last maintenance
 * @property {string} next_scheduled_date - Date of next scheduled maintenance
 */

// Validation functions for maintenance data
export const validateMaintenanceTask = (task) => {
    const errors = [];

    if (!task.title || task.title.trim().length === 0) {
        errors.push('Tiêu đề công việc là bắt buộc');
    }

    if (!task.vehicle_id || task.vehicle_id <= 0) {
        errors.push('ID xe không hợp lệ');
    }

    if (task.status_enum === undefined || task.status_enum < 0 || task.status_enum > 4) {
        errors.push('Trạng thái không hợp lệ');
    }

    if (task.priority_enum === undefined || task.priority_enum < 0 || task.priority_enum > 3) {
        errors.push('Mức độ ưu tiên không hợp lệ');
    }

    if (task.type_enum === undefined || task.type_enum < 0 || task.type_enum > 4) {
        errors.push('Loại bảo trì không hợp lệ');
    }

    if (task.estimated_cost && task.estimated_cost < 0) {
        errors.push('Chi phí ước tính không thể âm');
    }

    if (task.actual_cost && task.actual_cost < 0) {
        errors.push('Chi phí thực tế không thể âm');
    }

    return errors;
};

export const validateMaintenanceCost = (cost) => {
    const errors = [];

    if (!cost.maintenance_task_id || cost.maintenance_task_id <= 0) {
        errors.push('ID công việc bảo trì không hợp lệ');
    }

    if (cost.category_enum === undefined || cost.category_enum < 0 || cost.category_enum > 4) {
        errors.push('Danh mục chi phí không hợp lệ');
    }

    if (!cost.amount || cost.amount <= 0) {
        errors.push('Số tiền phải lớn hơn 0');
    }

    if (cost.provider_type_enum === undefined || cost.provider_type_enum < 0 || cost.provider_type_enum > 2) {
        errors.push('Loại nhà cung cấp không hợp lệ');
    }

    if (!cost.date_incurred) {
        errors.push('Ngày phát sinh chi phí là bắt buộc');
    }

    return errors;
};

// Helper functions for maintenance calculations
export const calculateMaintenanceDue = (schedule, currentKm, currentDate) => {
    const kmDue = schedule.last_performed_km + schedule.interval_km;
    const dateDue = new Date(schedule.last_performed_date);
    dateDue.setMonth(dateDue.getMonth() + schedule.interval_months);

    const kmOverdue = currentKm >= kmDue;
    const dateOverdue = new Date(currentDate) >= dateDue;

    return {
        isDue: kmOverdue || dateOverdue,
        kmRemaining: Math.max(0, kmDue - currentKm),
        daysRemaining: Math.max(0, Math.ceil((dateDue - new Date(currentDate)) / (1000 * 60 * 60 * 24))),
        dueDate: dateDue,
        dueKm: kmDue
    };
};

export const formatMaintenanceCost = (amount) => {
    if (!amount) return '0 VND';
    return `${amount.toLocaleString('vi-VN')} VND`;
};

export const formatMaintenanceInterval = (intervalKm, intervalMonths) => {
    const parts = [];
    if (intervalKm > 0) parts.push(`${intervalKm.toLocaleString()} km`);
    if (intervalMonths > 0) parts.push(`${intervalMonths} tháng`);
    return parts.join(' hoặc ');
};

export const getMaintenanceUrgency = (dueInfo) => {
    if (!dueInfo.isDue) return 'normal';
    if (dueInfo.kmRemaining <= 0 || dueInfo.daysRemaining <= 0) return 'urgent';
    if (dueInfo.kmRemaining <= 1000 || dueInfo.daysRemaining <= 7) return 'warning';
    return 'normal';
};