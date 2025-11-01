// Vehicle Condition Types - Aligned with vehicle_conditions table schema
// Database table: vehicle_conditions

/**
 * Vehicle condition object matching database schema
 * Based on vehicle_conditions table:
 * - condition_type_enum: integer (0=Excellent, 1=Good, 2=Fair, 3=Poor, 4=Damaged)
 * - odometer_reading: integer
 * - fuel_level: decimal(5,2)
 * - damage_reported: boolean
 * - photo_urls: text
 * - description: text
 * 
 * @typedef {Object} VehicleCondition
 * @property {0|1|2|3|4} condition_type_enum - Database enum: 0=Excellent, 1=Good, 2=Fair, 3=Poor, 4=Damaged
 * @property {string} description - Database: description TEXT
 * @property {number} odometer_reading - Database: odometer_reading INTEGER (changed from 'mileage')
 * @property {number} fuel_level - Database: fuel_level DECIMAL(5,2) (battery level for EVs)
 * @property {boolean} damage_reported - Database: damage_reported BOOLEAN (changed from 'damage' string)
 * @property {string} [photo_urls] - Database: photo_urls TEXT (optional, comma-separated URLs)
 * @property {string} [notes] - Extra notes from staff
 */

/**
 * Check-in request matching database schema
 * Based on check_ins table structure
 * 
 * @typedef {Object} CheckInRequest
 * @property {number} booking_id - Database: booking_id INTEGER REFERENCES bookings(id)
 * @property {number} staff_id - Database: staff_id INTEGER REFERENCES users(id)
 * @property {number} vehicle_station_id - Database: vehicle_station_id INTEGER REFERENCES vehicle_stations(id)
 * @property {VehicleCondition} vehicle_condition - Will create record in vehicle_conditions table
 * @property {string} check_time - Database: check_time TIMESTAMP
 */

/**
 * Check-out request matching database schema
 * Based on check_outs table structure
 * 
 * @typedef {Object} CheckOutRequest
 * @property {number} booking_id - Database: booking_id INTEGER REFERENCES bookings(id)
 * @property {number} staff_id - Database: staff_id INTEGER REFERENCES users(id)
 * @property {number} vehicle_station_id - Database: vehicle_station_id INTEGER REFERENCES vehicle_stations(id)
 * @property {VehicleCondition} vehicle_condition - Will create record in vehicle_conditions table
 * @property {string} check_time - Database: check_time TIMESTAMP
 * @property {Array<{type: string, amount: number, description: string}>} [additional_charges] - For any extra fees
 */

/**
 * Check-in response from backend
 * 
 * @typedef {Object} CheckInResponse
 * @property {number} id - Database: check_ins.id
 * @property {number} booking_id
 * @property {number} vehicle_id
 * @property {number} staff_id
 * @property {number} vehicle_station_id
 * @property {number} vehicle_condition_id - References vehicle_conditions.id
 * @property {string} check_time
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Pending check-in item for staff dashboard
 * 
 * @typedef {Object} PendingCheckIn
 * @property {number} booking_id
 * @property {string} customer_name
 * @property {string} customer_phone
 * @property {string} vehicle_name
 * @property {number} vehicle_id
 * @property {string} license_plate
 * @property {string} start_time
 * @property {string} end_time
 * @property {number} station_id
 * @property {string} station_name
 * @property {string} status
 */

/**
 * Vehicle condition form state for UI
 * 
 * @typedef {Object} VehicleConditionFormState
 * @property {0|1|2|3|4} condition_type_enum
 * @property {string} description
 * @property {number} odometer_reading
 * @property {number} fuel_level
 * @property {boolean} damage_reported
 * @property {string} photo_urls
 * @property {string} notes
 */

// Default vehicle condition state
export const createDefaultVehicleCondition = () => ({
    condition_type_enum: 1, // Good by default
    description: '',
    odometer_reading: 0,
    fuel_level: 100,
    damage_reported: false,
    photo_urls: '',
    notes: ''
});

// Validation helpers
export const validateVehicleCondition = (condition) => {
    const errors = [];

    if (typeof condition.condition_type_enum !== 'number' || condition.condition_type_enum < 0 || condition.condition_type_enum > 4) {
        errors.push('Condition type must be between 0-4');
    }

    if (!condition.description || condition.description.trim().length === 0) {
        errors.push('Description is required');
    }

    if (typeof condition.odometer_reading !== 'number' || condition.odometer_reading < 0) {
        errors.push('Odometer reading must be a positive number');
    }

    if (typeof condition.fuel_level !== 'number' || condition.fuel_level < 0 || condition.fuel_level > 100) {
        errors.push('Fuel level must be between 0-100');
    }

    return errors;
};