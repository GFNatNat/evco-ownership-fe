// Vehicle Condition Type Enums - Aligned with Database Schema
// Based on condition_type_enum: 0=Excellent, 1=Good, 2=Fair, 3=Poor, 4=Damaged

export const VEHICLE_CONDITION_TYPE = Object.freeze({
    EXCELLENT: 0,
    GOOD: 1,
    FAIR: 2,
    POOR: 3,
    DAMAGED: 4
});

export const VEHICLE_CONDITION_LABELS = {
    [VEHICLE_CONDITION_TYPE.EXCELLENT]: 'Tuyệt vời',
    [VEHICLE_CONDITION_TYPE.GOOD]: 'Tốt',
    [VEHICLE_CONDITION_TYPE.FAIR]: 'Khá',
    [VEHICLE_CONDITION_TYPE.POOR]: 'Kém',
    [VEHICLE_CONDITION_TYPE.DAMAGED]: 'Hư hỏng'
};

export const VEHICLE_CONDITION_COLORS = {
    [VEHICLE_CONDITION_TYPE.EXCELLENT]: '#10b981', // green
    [VEHICLE_CONDITION_TYPE.GOOD]: '#3b82f6',     // blue
    [VEHICLE_CONDITION_TYPE.FAIR]: '#f59e0b',     // yellow
    [VEHICLE_CONDITION_TYPE.POOR]: '#ef4444',     // red
    [VEHICLE_CONDITION_TYPE.DAMAGED]: '#dc2626'   // dark red
};

// Helper functions
export const getConditionLabel = (conditionType) => {
    return VEHICLE_CONDITION_LABELS[conditionType] || 'Không xác định';
};

export const getConditionColor = (conditionType) => {
    return VEHICLE_CONDITION_COLORS[conditionType] || '#6b7280';
};

export const isValidConditionType = (conditionType) => {
    return Object.values(VEHICLE_CONDITION_TYPE).includes(conditionType);
};