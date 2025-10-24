import axiosClient from './axiosClient';

/**
 * CheckInCheckOut API - README 14 Compliant Implementation
 * Handles vehicle check-in/check-out operations with QR codes and manual processes
 * All endpoints follow exact README 14 specifications
 */

const checkInCheckOutApi = {
    // ===== README 14 COMPLIANCE - 8 ENDPOINTS =====

    // 1. QR Code Check-In - POST /api/checkincheckout/qr-checkin (README 14 compliant)
    qrCheckIn: (data) => axiosClient.post('/api/checkincheckout/qr-checkin', {
        qrCodeData: data.qrCodeData,
        conditionReport: {
            conditionType: data.conditionReport?.conditionType || 1,
            cleanlinessLevel: data.conditionReport?.cleanlinessLevel || 4,
            hasDamages: data.conditionReport?.hasDamages || false,
            notes: data.conditionReport?.notes || ''
        },
        notes: data.notes || '',
        locationLatitude: data.locationLatitude,
        locationLongitude: data.locationLongitude
    }),

    // 2. QR Code Check-Out - POST /api/checkincheckout/qr-checkout (README 14 compliant)
    qrCheckOut: (data) => axiosClient.post('/api/checkincheckout/qr-checkout', {
        qrCodeData: data.qrCodeData,
        conditionReport: {
            conditionType: data.conditionReport?.conditionType || 2,
            cleanlinessLevel: data.conditionReport?.cleanlinessLevel || 3,
            hasDamages: data.conditionReport?.hasDamages || false,
            damages: data.conditionReport?.damages || [],
            notes: data.conditionReport?.notes || ''
        },
        odometerReading: data.odometerReading,
        batteryLevel: data.batteryLevel,
        notes: data.notes || ''
    }),

    // 3. Generate QR Code - GET /api/checkincheckout/generate-qr/{bookingId} (README 14 compliant)
    generateQRCode: (bookingId) => axiosClient.get(`/api/checkincheckout/generate-qr/${bookingId}`),

    // 4. Manual Check-In - POST /api/checkincheckout/manual-checkin (README 14 compliant)
    manualCheckIn: (data) => axiosClient.post('/api/checkincheckout/manual-checkin', {
        bookingId: data.bookingId,
        vehicleStationId: data.vehicleStationId,
        conditionReport: {
            conditionType: data.conditionReport?.conditionType || 1,
            cleanlinessLevel: data.conditionReport?.cleanlinessLevel || 5,
            hasDamages: data.conditionReport?.hasDamages || false,
            notes: data.conditionReport?.notes || ''
        },
        odometerReading: data.odometerReading,
        batteryLevel: data.batteryLevel,
        staffNotes: data.staffNotes || '',
        conditionPhotoIds: data.conditionPhotoIds || []
    }),

    // 5. Manual Check-Out - POST /api/checkincheckout/manual-checkout (README 14 compliant)
    manualCheckOut: (data) => axiosClient.post('/api/checkincheckout/manual-checkout', {
        bookingId: data.bookingId,
        vehicleStationId: data.vehicleStationId,
        conditionReport: {
            conditionType: data.conditionReport?.conditionType || 3,
            cleanlinessLevel: data.conditionReport?.cleanlinessLevel || 2,
            hasDamages: data.conditionReport?.hasDamages || false,
            damages: data.conditionReport?.damages || [],
            notes: data.conditionReport?.notes || ''
        },
        odometerReading: data.odometerReading,
        batteryLevel: data.batteryLevel,
        staffNotes: data.staffNotes || ''
    }),

    // 6. Validate Check-In Eligibility - GET /api/checkincheckout/validate-checkin/{bookingId} (README 14 compliant)
    validateCheckInEligibility: (bookingId) => axiosClient.get(`/api/checkincheckout/validate-checkin/${bookingId}`),

    // 7. Validate Check-Out Eligibility - GET /api/checkincheckout/validate-checkout/{bookingId} (README 14 compliant)
    validateCheckOutEligibility: (bookingId) => axiosClient.get(`/api/checkincheckout/validate-checkout/${bookingId}`),

    // 8. Get Check-In/Check-Out History - GET /api/checkincheckout/history/{bookingId} (README 14 compliant)
    getHistory: (bookingId) => axiosClient.get(`/api/checkincheckout/history/${bookingId}`),

    // ===== UTILITY METHODS FOR FRONTEND INTEGRATION =====

    // Parse QR code data
    parseQRCodeData: (qrCodeString) => {
        try {
            return JSON.parse(qrCodeString);
        } catch (error) {
            console.error('Invalid QR code data:', error);
            return null;
        }
    },

    // Validate condition report data
    validateConditionReport: (conditionReport, isCheckOut = false) => {
        const errors = [];

        if (!conditionReport.conditionType || conditionReport.conditionType < 1 || conditionReport.conditionType > 5) {
            errors.push('Condition type must be between 1 and 5');
        }

        if (!conditionReport.cleanlinessLevel || conditionReport.cleanlinessLevel < 1 || conditionReport.cleanlinessLevel > 5) {
            errors.push('Cleanliness level must be between 1 and 5');
        }

        if (conditionReport.hasDamages && (!conditionReport.damages || conditionReport.damages.length === 0)) {
            errors.push('Damages list is required when hasDamages is true');
        }

        if (conditionReport.damages && conditionReport.damages.length > 0) {
            conditionReport.damages.forEach((damage, index) => {
                if (!damage.damageType || damage.damageType.trim() === '') {
                    errors.push(`Damage ${index + 1}: Damage type is required`);
                }
                if (damage.severity === undefined || damage.severity < 0 || damage.severity > 2) {
                    errors.push(`Damage ${index + 1}: Severity must be between 0 and 2`);
                }
                if (!damage.location || damage.location.trim() === '') {
                    errors.push(`Damage ${index + 1}: Location is required`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Get vehicle stations
    getVehicleStations: () => axiosClient.get('/api/checkincheckout/stations'),

    // Get station by ID
    getStationById: (stationId) => axiosClient.get(`/api/checkincheckout/stations/${stationId}`),

    // Create damage report
    createDamageReport: (data) => axiosClient.post('/api/checkincheckout/damage-report', {
        bookingId: data.bookingId,
        damages: data.damages,
        reportedBy: data.reportedBy,
        reportedAt: data.reportedAt || new Date().toISOString(),
        photoIds: data.photoIds || [],
        estimatedCost: data.estimatedCost,
        notes: data.notes
    }),

    // Upload condition photos
    uploadConditionPhotos: (files, bookingId) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('photos', file);
        });
        formData.append('bookingId', bookingId);

        return axiosClient.post('/api/checkincheckout/upload-photos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Get check-in/check-out status
    getBookingStatus: (bookingId) => axiosClient.get(`/api/checkincheckout/booking/${bookingId}/status`),

    // Cancel check-in (if allowed)
    cancelCheckIn: (bookingId, reason) => axiosClient.post(`/api/checkincheckout/cancel-checkin/${bookingId}`, {
        reason: reason
    }),

    // Get damage types for dropdown
    getDamageTypes: () => axiosClient.get('/api/checkincheckout/damage-types'),

    // Format condition report for display
    formatConditionReport: (report) => ({
        conditionType: {
            1: 'Excellent',
            2: 'Good',
            3: 'Fair',
            4: 'Poor',
            5: 'Critical'
        }[report.conditionType] || 'Unknown',
        cleanlinessLevel: {
            1: 'Very Dirty',
            2: 'Dirty',
            3: 'Average',
            4: 'Clean',
            5: 'Very Clean'
        }[report.cleanlinessLevel] || 'Unknown',
        hasDamages: report.hasDamages,
        damageCount: report.damages ? report.damages.length : 0,
        totalEstimatedCost: report.damages ?
            report.damages.reduce((total, damage) => total + (damage.estimatedCost || 0), 0) : 0,
        notes: report.notes
    }),

    // Format damage for display
    formatDamage: (damage) => ({
        type: damage.damageType,
        severity: {
            0: 'Minor',
            1: 'Moderate',
            2: 'Severe'
        }[damage.severity] || 'Unknown',
        location: damage.location,
        description: damage.description,
        estimatedCost: damage.estimatedCost ?
            new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(damage.estimatedCost) : 'N/A',
        photoCount: damage.photoIds ? damage.photoIds.length : 0
    }),

    // Get location from GPS coordinates
    getLocationFromCoordinates: async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`);
            const data = await response.json();
            return data.results[0]?.formatted || `${latitude}, ${longitude}`;
        } catch (error) {
            console.error('Error getting location:', error);
            return `${latitude}, ${longitude}`;
        }
    },

    // Generate check-in summary
    generateCheckInSummary: (checkInData) => ({
        bookingId: checkInData.bookingId,
        vehicleName: checkInData.vehicleName,
        checkInTime: new Date(checkInData.checkInTime).toLocaleString('vi-VN'),
        location: checkInData.location,
        condition: checkInData.conditionReport,
        odometerReading: checkInData.odometerReading,
        batteryLevel: `${checkInData.batteryLevel}%`,
        notes: checkInData.notes
    }),

    // Generate check-out summary  
    generateCheckOutSummary: (checkOutData) => ({
        bookingId: checkOutData.bookingId,
        vehicleName: checkOutData.vehicleName,
        checkOutTime: new Date(checkOutData.checkOutTime).toLocaleString('vi-VN'),
        duration: checkOutData.duration, // in minutes
        formattedDuration: `${Math.floor(checkOutData.duration / 60)}h ${checkOutData.duration % 60}m`,
        startOdometer: checkOutData.startOdometer,
        endOdometer: checkOutData.endOdometer,
        distanceTraveled: checkOutData.endOdometer - checkOutData.startOdometer,
        startBattery: `${checkOutData.startBattery}%`,
        endBattery: `${checkOutData.endBattery}%`,
        batteryUsed: `${checkOutData.startBattery - checkOutData.endBattery}%`,
        condition: checkOutData.conditionReport,
        damages: checkOutData.conditionReport?.damages || [],
        totalDamageCost: checkOutData.conditionReport?.damages ?
            checkOutData.conditionReport.damages.reduce((total, damage) => total + (damage.estimatedCost || 0), 0) : 0,
        additionalFees: checkOutData.additionalFees || 0,
        notes: checkOutData.notes
    })
};

export default checkInCheckOutApi;