// API Health Check Utility
import axiosClient from '../api/axiosClient';

export const checkApiHealth = async () => {
    try {
        console.log('🔍 Checking API health...');
        console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

        // Try a simple GET request first (no auth required)
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('✅ API Health Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Health Response:', data);
            return { success: true, data };
        } else {
            console.log('⚠️ API Health Check Failed:', response.status, response.statusText);
            return { success: false, status: response.status, error: response.statusText };
        }
    } catch (error) {
        console.error('❌ API Health Check Error:', error);
        return { success: false, error: error.message };
    }
};

export const testAuthRegister = async (testData = {
    email: 'test@example.com',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    address: 'Test Address'
}) => {
    try {
        console.log('🧪 Testing Auth Register...');
        console.log('Test Data:', testData);

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('📝 Register Response Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Register Success:', data);
            return { success: true, data };
        } else {
            const errorData = await response.text();
            console.log('❌ Register Failed:', response.status, errorData);
            return { success: false, status: response.status, error: errorData };
        }
    } catch (error) {
        console.error('❌ Register Test Error:', error);
        return { success: false, error: error.message };
    }
};

export const diagnoseApiConnection = async () => {
    console.log('🔧 Starting API Diagnosis...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL from .env:', process.env.REACT_APP_API_BASE_URL);

    // Check if API server is reachable
    const healthCheck = await checkApiHealth();

    if (!healthCheck.success) {
        console.log('🔧 API health check failed, testing basic connectivity...');

        // Test basic connectivity to the server
        try {
            const baseUrl = process.env.REACT_APP_API_BASE_URL.replace('/api', '');
            const response = await fetch(baseUrl, { method: 'GET' });
            console.log('🌐 Base server connectivity:', response.status);
        } catch (error) {
            console.log('❌ Base server not reachable:', error.message);
        }
    }

    // Test the problematic register endpoint
    console.log('🧪 Testing register endpoint that caused 500 error...');
    const registerTest = await testAuthRegister();

    return {
        health: healthCheck,
        register: registerTest
    };
};

// Debug helper for manual testing
window.debugApi = {
    checkHealth: checkApiHealth,
    testRegister: testAuthRegister,
    diagnose: diagnoseApiConnection
};

export default {
    checkApiHealth,
    testAuthRegister,
    diagnoseApiConnection
};