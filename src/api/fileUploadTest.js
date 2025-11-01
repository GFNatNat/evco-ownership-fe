// Test utility for File Upload API endpoint verification
// This file tests both endpoint case sensitivity and response parsing

import axiosClient from './axiosClient';

const fileUploadTest = {
    // Test endpoint case sensitivity
    async testEndpointCases() {
        console.log('🔍 Testing File Upload endpoint case sensitivity...');

        const testCases = [
            { name: 'Current Implementation', path: '/FileUpload/test' },
            { name: 'Documentation Style', path: '/fileupload/test' },
            { name: 'All Lowercase', path: '/fileupload/test' },
            { name: 'Pascal Case', path: '/FileUpload/test' }
        ];

        const results = [];

        for (const testCase of testCases) {
            try {
                console.log(`Testing: ${testCase.name} - ${testCase.path}`);

                // Test with HEAD request to avoid creating actual uploads
                const response = await axiosClient.head(testCase.path);

                results.push({
                    name: testCase.name,
                    path: testCase.path,
                    status: 'SUCCESS',
                    statusCode: response.status || response.statusCode,
                    message: 'Endpoint accessible'
                });

            } catch (error) {
                results.push({
                    name: testCase.name,
                    path: testCase.path,
                    status: 'ERROR',
                    statusCode: error.response?.status,
                    message: error.response?.data?.message || error.message
                });
            }
        }

        console.log('📊 Endpoint Test Results:', results);
        return results;
    },

    // Test response format parsing
    async testResponseParsing() {
        console.log('🔍 Testing response format parsing...');

        try {
            // Test with a small file upload to see actual response structure
            const testFile = new Blob(['test content'], { type: 'text/plain' });
            const formData = new FormData();
            formData.append('file', testFile, 'test.txt');

            const response = await axiosClient.post('/FileUpload/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('📦 Raw Response:', response);

            // Analyze response structure
            const analysis = {
                hasStatusCode: 'statusCode' in response,
                hasMessage: 'message' in response,
                hasData: 'data' in response,
                responseStructure: Object.keys(response),
                statusCodeValue: response.statusCode,
                messageValue: response.message,
                dataKeys: response.data ? Object.keys(response.data) : null
            };

            console.log('📋 Response Analysis:', analysis);
            return analysis;

        } catch (error) {
            console.log('❌ Response Test Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            return {
                error: true,
                status: error.response?.status,
                response: error.response?.data,
                message: error.message
            };
        }
    },

    // Enhanced response parser
    parseResponse(response, operation = 'unknown') {
        try {
            // Handle different response formats
            let parsedData = response;

            // If response has statusCode field (backend format)
            if (response && typeof response === 'object' && 'statusCode' in response) {
                return {
                    success: response.statusCode >= 200 && response.statusCode < 300,
                    statusCode: response.statusCode,
                    message: response.message || `${operation} completed`,
                    data: response.data,
                    raw: response
                };
            }

            // If response is direct data (axios interceptor already parsed)
            if (response && typeof response === 'object') {
                return {
                    success: true,
                    statusCode: 200,
                    message: `${operation} completed successfully`,
                    data: response,
                    raw: response
                };
            }

            // Fallback for other formats
            return {
                success: true,
                statusCode: 200,
                message: `${operation} completed`,
                data: response,
                raw: response
            };

        } catch (error) {
            return {
                success: false,
                statusCode: 500,
                message: `${operation} failed: ${error.message}`,
                data: null,
                error: error.message,
                raw: response
            };
        }
    },

    // Enhanced error handler
    handleError(error, operation = 'unknown') {
        const errorResponse = {
            success: false,
            statusCode: error.response?.status || 500,
            message: this.getErrorMessage(error, operation),
            data: null,
            error: error.message,
            raw: error.response?.data
        };

        console.error(`❌ ${operation} Error:`, errorResponse);
        return errorResponse;
    },

    // Get user-friendly error message
    getErrorMessage(error, operation) {
        const statusCode = error.response?.status;
        const backendMessage = error.response?.data?.message;

        // Use backend message if available
        if (backendMessage) {
            return this.translateErrorMessage(backendMessage);
        }

        // Fallback based on status code
        switch (statusCode) {
            case 400:
                return `${operation} failed: Invalid request data`;
            case 401:
                return `${operation} failed: Authentication required`;
            case 403:
                return `${operation} failed: Permission denied`;
            case 404:
                return `${operation} failed: File not found`;
            case 413:
                return `${operation} failed: File size too large`;
            case 415:
                return `${operation} failed: File type not supported`;
            case 500:
                return `${operation} failed: Server error`;
            default:
                return `${operation} failed: ${error.message}`;
        }
    },

    // Translate backend error messages to user-friendly Vietnamese
    translateErrorMessage(message) {
        const translations = {
            'FILE_REQUIRED': 'Vui lòng chọn file để tải lên',
            'INVALID_FILE_TYPE': 'Loại file không được hỗ trợ',
            'FILE_SIZE_EXCEEDS_LIMIT': 'Kích thước file vượt quá giới hạn cho phép',
            'FILE_NOT_FOUND': 'Không tìm thấy file',
            'FILE_UPLOAD_FAILED': 'Tải file lên thất bại',
            'FILE_DELETE_FAILED': 'Xóa file thất bại',
            'FILE_INFO_RETRIEVAL_FAILED': 'Lấy thông tin file thất bại',
            'FILE_RETRIEVAL_FAILED': 'Tải file xuống thất bại',
            'MALWARE_DETECTED': 'File chứa mã độc, không thể tải lên',
            'INVALID_FILE_CONTENT': 'Nội dung file không hợp lệ'
        };

        return translations[message] || message || 'Đã xảy ra lỗi';
    }
};

export default fileUploadTest;