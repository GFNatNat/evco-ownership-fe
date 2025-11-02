import axiosClient from './axiosClient';

const fileUploadApi = {
  // Enhanced response parser
  parseResponse: (response, operation = 'unknown') => {
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
  handleError: (error, operation = 'unknown') => {
    const errorResponse = {
      success: false,
      statusCode: error.response?.status || 500,
      message: fileUploadApi.getErrorMessage(error, operation),
      data: null,
      error: error.message,
      raw: error.response?.data
    };

    console.error(`❌ ${operation} Error:`, errorResponse);
    return errorResponse;
  },

  // Get user-friendly error message
  getErrorMessage: (error, operation) => {
    const statusCode = error.response?.status;
    const backendMessage = error.response?.data?.message;

    // Use backend message if available
    if (backendMessage) {
      return fileUploadApi.translateErrorMessage(backendMessage);
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
  translateErrorMessage: (message) => {
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
  },

  // Basic File Upload with enhanced response handling
  uploadFile: async (file, category) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (category) {
        formData.append('category', category);
      }

      const response = await axiosClient.post('/api/FileUpload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          // Handle upload progress
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return fileUploadApi.parseResponse(response, 'Upload');
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Upload');
    }
  },

  // Get File Info with enhanced response handling
  getFileInfo: async (fileId) => {
    try {
      const response = await axiosClient.get(`/FileUpload/${fileId}/info`);
      return fileUploadApi.parseResponse(response, 'Get File Info');
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Get File Info');
    }
  },

  // Download File with enhanced error handling
  downloadFile: async (fileId) => {
    try {
      const response = await axiosClient.get(`/FileUpload/${fileId}/download`, {
        responseType: 'blob',
      });
      return response; // Return blob directly for downloads
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Download');
    }
  },

  // Delete File with enhanced response handling
  deleteFile: async (fileId) => {
    try {
      const response = await axiosClient.delete(`/FileUpload/${fileId}`);
      return fileUploadApi.parseResponse(response, 'Delete');
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Delete');
    }
  },

  // Get File URL for direct access
  getFileUrl: (fileId) => {
    const baseURL = axiosClient.defaults.baseURL || '';
    return `${baseURL}/FileUpload/${fileId}`;
  },

  // Upload with Progress Tracking
  uploadWithProgress: async (file, category, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (category) {
        formData.append('category', category);
      }

      const response = await axiosClient.post('/api/FileUpload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            onProgress(percentCompleted, progressEvent.loaded, progressEvent.total);
          }
        },
      });

      return fileUploadApi.parseResponse(response, 'Upload with Progress');
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Upload with Progress');
    }
  },

  // MISSING METHODS - Adding for component compatibility

  // Create FormData with metadata
  createFormData: (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata fields
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    });

    return formData;
  },

  // Simple upload method (wrapper for uploadFile) with enhanced response
  upload: async (formData) => {
    try {
      const response = await axiosClient.post('/api/FileUpload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return fileUploadApi.parseResponse(response, 'Upload');
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Upload');
    }
  },

  // Validate multiple files
  validateMultipleFiles: (files, maxSize = 10 * 1024 * 1024, acceptedTypes = ['image/*', '.pdf', '.doc', '.docx']) => {
    const results = {
      valid: true,
      errors: [],
      validFiles: [],
      invalidFiles: []
    };

    Array.from(files).forEach((file, index) => {
      const validation = fileUploadApi.validateFile(file, maxSize, acceptedTypes);

      if (validation.valid) {
        results.validFiles.push(file);
      } else {
        results.valid = false;
        results.invalidFiles.push({ file, error: validation.error, index });
        results.errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
      }
    });

    return results;
  },

  // Download file with specific filename
  downloadFileWithName: async (fileId, filename) => {
    try {
      const response = await axiosClient.get(`/FileUpload/${fileId}/download`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: `Downloaded ${filename} successfully` };
    } catch (error) {
      throw fileUploadApi.handleError(error, 'Download');
    }
  },

  // Format file info for display
  formatFileInfoForDisplay: (fileData) => {
    return {
      id: fileData.fileId || fileData.id,
      name: fileData.fileName || fileData.name,
      size: fileData.fileSize || fileData.size,
      type: fileData.fileType || fileData.mimeType || fileData.type,
      uploadDate: fileData.uploadDate,
      downloadUrl: fileData.downloadUrl,
      formattedSize: fileUploadApi.formatFileSize(fileData.fileSize || fileData.size || 0),
      formattedDate: fileData.uploadDate ? new Date(fileData.uploadDate).toLocaleString() : 'Unknown'
    };
  },

  // Get file type category and icon
  getFileTypeCategory: (mimeType) => {
    if (!mimeType) return { icon: '📎', color: '#9E9E9E', category: 'unknown' };

    const type = mimeType.toLowerCase();

    // Images
    if (type.startsWith('image/')) {
      return { icon: '🖼️', color: '#4CAF50', category: 'image' };
    }

    // Documents
    if (type.includes('pdf')) {
      return { icon: '📄', color: '#F44336', category: 'pdf' };
    }

    if (type.includes('word') || type.includes('document')) {
      return { icon: '📝', color: '#2196F3', category: 'document' };
    }

    if (type.includes('spreadsheet') || type.includes('excel')) {
      return { icon: '📊', color: '#4CAF50', category: 'spreadsheet' };
    }

    if (type.includes('presentation') || type.includes('powerpoint')) {
      return { icon: '📊', color: '#FF9800', category: 'presentation' };
    }

    // Text files
    if (type.includes('text')) {
      return { icon: '📃', color: '#607D8B', category: 'text' };
    }

    // Archives
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) {
      return { icon: '🗜️', color: '#795548', category: 'archive' };
    }

    // Audio
    if (type.startsWith('audio/')) {
      return { icon: '🎵', color: '#9C27B0', category: 'audio' };
    }

    // Video
    if (type.startsWith('video/')) {
      return { icon: '🎬', color: '#E91E63', category: 'video' };
    }

    // Default
    return { icon: '📎', color: '#9E9E9E', category: 'unknown' };
  },

  // METHOD ALIASES for component compatibility

  // Alias for getFileInfo
  getInfo: (fileId) => fileUploadApi.getFileInfo(fileId),

  // Alias for deleteFile  
  delete: (fileId) => fileUploadApi.deleteFile(fileId),

  // File Validation
  validateFile: (file, maxSize = 10 * 1024 * 1024, acceptedTypes = ['image/*', '.pdf', '.doc', '.docx']) => {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit. Maximum size is ${formatFileSize(maxSize)}.`
      };
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();

    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type;
      } else if (type.includes('/*')) {
        return mimeType.startsWith(type.replace('/*', '/'));
      } else {
        return mimeType === type;
      }
    });

    if (!isValidType) {
      return {
        valid: false,
        error: `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`
      };
    }

    return { valid: true };
  },

  // Utility function to format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// Helper function for formatting file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default fileUploadApi;
