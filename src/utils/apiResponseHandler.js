/**
 * Utility functions to handle different API response formats
 * Helps normalize response format inconsistencies between documentation and frontend
 */

/**
 * Parse API response data consistently
 * @param {Object} response - API response object
 * @returns {Object} Normalized response with data, statusCode, message
 */
export const parseApiResponse = (response) => {
    // Handle documented format: { statusCode, message, data }
    if (response && typeof response === 'object' && response.statusCode !== undefined) {
        return {
            statusCode: response.statusCode,
            message: response.message || '',
            data: response.data
        };
    }

    // Handle direct data format: { data }
    if (response && typeof response === 'object' && response.data !== undefined) {
        return {
            statusCode: 200, // Assume success if no status code
            message: 'SUCCESS',
            data: response.data
        };
    }

    // Handle direct array/object data
    if (response) {
        return {
            statusCode: 200,
            message: 'SUCCESS',
            data: response
        };
    }

    // Handle null/undefined responses
    return {
        statusCode: 404,
        message: 'NO_DATA',
        data: null
    };
};

/**
 * Extract data from API response safely
 * @param {Object} response - API response object
 * @param {*} fallback - Fallback value if data is not found
 * @returns {*} Extracted data or fallback
 */
export const extractResponseData = (response, fallback = null) => {
    const parsed = parseApiResponse(response);
    return parsed.data !== null ? parsed.data : fallback;
};

/**
 * Check if API response indicates success
 * @param {Object} response - API response object
 * @returns {boolean} True if successful
 */
export const isApiResponseSuccess = (response) => {
    const parsed = parseApiResponse(response);
    return parsed.statusCode >= 200 && parsed.statusCode < 300;
};

/**
 * Get error message from API response
 * @param {Object} response - API response object
 * @param {string} defaultMessage - Default error message
 * @returns {string} Error message
 */
export const getApiErrorMessage = (response, defaultMessage = 'Đã xảy ra lỗi') => {
    const parsed = parseApiResponse(response);

    if (parsed.statusCode >= 400) {
        return parsed.message || defaultMessage;
    }

    return defaultMessage;
};

/**
 * Handle API call with consistent response format
 * @param {Function} apiCall - API function to call
 * @param {*} fallbackData - Fallback data on error
 * @returns {Promise<Object>} Normalized response
 */
export const handleApiCall = async (apiCall, fallbackData = null) => {
    try {
        const response = await apiCall();
        return parseApiResponse(response);
    } catch (error) {
        console.error('API call failed:', error);
        return {
            statusCode: error.response?.status || 500,
            message: error.message || 'API call failed',
            data: fallbackData
        };
    }
};

/**
 * Handle multiple API calls with Promise.allSettled pattern
 * @param {Array<Function>} apiCalls - Array of API functions
 * @param {Array} fallbackData - Array of fallback data for each call
 * @returns {Promise<Array>} Array of normalized responses
 */
export const handleMultipleApiCalls = async (apiCalls, fallbackData = []) => {
    const results = await Promise.allSettled(
        apiCalls.map((call, index) => handleApiCall(call, fallbackData[index] || null))
    );

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            return {
                statusCode: 500,
                message: 'Promise rejected',
                data: fallbackData[index] || null
            };
        }
    });
};

export default {
    parseApiResponse,
    extractResponseData,
    isApiResponseSuccess,
    getApiErrorMessage,
    handleApiCall,
    handleMultipleApiCalls
};