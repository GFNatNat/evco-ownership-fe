// API Test Helper for debugging
import axiosClient from '../api/axiosClient';

export const testApiConnection = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: axiosClient.defaults.baseURL,
    tests: []
  };

  // Test 1: Basic connection to backend
  try {
    const response = await fetch(`${axiosClient.defaults.baseURL}/api/Health`);
    results.tests.push({
      name: 'Backend Health Check',
      status: response.ok ? 'SUCCESS' : 'FAILED',
      statusCode: response.status,
      url: `${axiosClient.defaults.baseURL}/api/Health`
    });
  } catch (error) {
    results.tests.push({
      name: 'Backend Health Check',
      status: 'ERROR',
      error: error.message,
      url: `${axiosClient.defaults.baseURL}/api/Health`
    });
  }

  // Test 2: Vehicle API (without auth)
  try {
    const response = await fetch(`${axiosClient.defaults.baseURL}/api/Vehicle`);
    results.tests.push({
      name: 'Vehicle API (No Auth)',
      status: response.status === 401 ? 'EXPECTED_401' : response.ok ? 'SUCCESS' : 'FAILED',
      statusCode: response.status,
      url: `${axiosClient.defaults.baseURL}/api/Vehicle`
    });
  } catch (error) {
    results.tests.push({
      name: 'Vehicle API (No Auth)',
      status: 'ERROR',
      error: error.message,
      url: `${axiosClient.defaults.baseURL}/api/Vehicle`
    });
  }

  // Test 3: Check if authentication is working
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const response = await axiosClient.get('/api/Vehicle');
      results.tests.push({
        name: 'Vehicle API (With Auth)',
        status: 'SUCCESS',
        dataType: typeof response,
        hasData: !!response,
        url: `${axiosClient.defaults.baseURL}/api/Vehicle`
      });
    } catch (error) {
      results.tests.push({
        name: 'Vehicle API (With Auth)',
        status: 'FAILED',
        error: error.message,
        statusCode: error.response?.status,
        url: `${axiosClient.defaults.baseURL}/api/Vehicle`
      });
    }
  } else {
    results.tests.push({
      name: 'Vehicle API (With Auth)',
      status: 'SKIPPED',
      reason: 'No access token found'
    });
  }

  // Test 4: Auth endpoints
  try {
    const response = await fetch(`${axiosClient.defaults.baseURL}/api/Auth/login`, {
      method: 'OPTIONS'
    });
    results.tests.push({
      name: 'Auth API (OPTIONS)',
      status: response.ok ? 'SUCCESS' : 'FAILED',
      statusCode: response.status,
      url: `${axiosClient.defaults.baseURL}/api/Auth/login`
    });
  } catch (error) {
    results.tests.push({
      name: 'Auth API (OPTIONS)',
      status: 'ERROR',
      error: error.message,
      url: `${axiosClient.defaults.baseURL}/api/Auth/login`
    });
  }

  return results;
};

export const testSpecificEndpoint = async (endpoint, method = 'GET', data = null) => {
  try {
    let response;
    const url = `${axiosClient.defaults.baseURL}${endpoint}`;
    
    switch (method.toUpperCase()) {
      case 'GET':
        response = await axiosClient.get(endpoint);
        break;
      case 'POST':
        response = await axiosClient.post(endpoint, data);
        break;
      case 'PUT':
        response = await axiosClient.put(endpoint, data);
        break;
      case 'DELETE':
        response = await axiosClient.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return {
      success: true,
      status: 'SUCCESS',
      data: response,
      url,
      method
    };
  } catch (error) {
    return {
      success: false,
      status: 'FAILED',
      error: error.message,
      statusCode: error.response?.status,
      responseData: error.response?.data,
      url: `${axiosClient.defaults.baseURL}${endpoint}`,
      method
    };
  }
};

// Quick debug function for console
export const debugAPI = async () => {
  console.group('🔍 API Debug Results');
  const results = await testApiConnection();
  
  console.log('🌐 Base URL:', results.baseUrl);
  console.log('⏰ Test Time:', results.timestamp);
  console.log('🔑 Access Token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
  
  results.tests.forEach((test, index) => {
    const icon = test.status === 'SUCCESS' || test.status === 'EXPECTED_401' ? '✅' : 
                 test.status === 'SKIPPED' ? '⏭️' : '❌';
    console.log(`${icon} ${test.name}: ${test.status}`, test);
  });
  
  console.groupEnd();
  return results;
};