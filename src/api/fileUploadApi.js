import axiosClient from './axiosClient';

/**
 * File Upload API - README 19 Compliant Implementation
 * Manages file upload, download, info, and deletion operations
 * All endpoints follow exact README 19 specifications
 */

const fileUploadApi = {
  // ===== README 19 COMPLIANCE - 4 ENDPOINTS =====

  // 1. Upload file - POST /api/fileupload/upload (README 19 compliant)
  upload: (formData) => axiosClient.post('/api/fileupload/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  // 2. Download file - GET /api/fileupload/{id}/download (README 19 compliant)
  download: (fileId) => axiosClient.get(`/api/fileupload/${fileId}/download`, {
    responseType: 'blob'
  }),

  // 3. Get file info - GET /api/fileupload/{id}/info (README 19 compliant)
  getInfo: (fileId) => axiosClient.get(`/api/fileupload/${fileId}/info`),

  // 4. Delete file - DELETE /api/fileupload/{id} (README 19 compliant)
  delete: (fileId) => axiosClient.delete(`/api/fileupload/${fileId}`),

  // ===== LEGACY SUPPORT & UTILITY METHODS =====

  // Legacy method names for backward compatibility
  uploadMultiple: (formData) => fileUploadApi.upload(formData), // Redirect to main upload
  getFile: (fileId) => fileUploadApi.getInfo(fileId), // Redirect to getInfo
  deleteFile: (fileId) => fileUploadApi.delete(fileId), // Redirect to delete
  downloadFile: (fileId) => fileUploadApi.download(fileId), // Redirect to download

  // Specialized upload methods
  uploadVehicleDocument: (vehicleId, formData) => {
    // Add vehicle ID to form data
    formData.append('vehicleId', vehicleId);
    formData.append('fileType', 'VehicleDocument');
    return fileUploadApi.upload(formData);
  },

  uploadUserDocument: (formData) => {
    formData.append('fileType', 'UserDocument');
    return fileUploadApi.upload(formData);
  },

  uploadProfileImage: (formData) => {
    formData.append('fileType', 'ProfileImage');
    return fileUploadApi.upload(formData);
  },

  uploadMaintenanceEvidence: (maintenanceId, formData) => {
    formData.append('maintenanceId', maintenanceId);
    formData.append('fileType', 'MaintenanceEvidence');
    return fileUploadApi.upload(formData);
  },

  uploadExpenseReceipt: (expenseId, formData) => {
    formData.append('expenseId', expenseId);
    formData.append('fileType', 'ExpenseReceipt');
    return fileUploadApi.upload(formData);
  },

  // ===== VALIDATION & UTILITY METHODS =====

  // Validate file before upload
  validateFile: (file) => {
    const errors = [];
    const maxSize = 10 * 1024 * 1024; // 10MB as per README 19
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Documents
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (!file) {
      errors.push('File is required');
      return { isValid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push(`File size cannot exceed ${fileUploadApi.formatFileSize(maxSize)}`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please upload images (JPEG, PNG, GIF, WebP) or documents (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV)');
    }

    if (file.name.length > 255) {
      errors.push('File name cannot exceed 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        formattedSize: fileUploadApi.formatFileSize(file.size)
      }
    };
  },

  // Create FormData from file and metadata
  createFormData: (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    });

    return formData;
  },

  // Format file size for display
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file type category
  getFileTypeCategory: (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return { category: 'image', icon: '🖼️', color: '#4CAF50' };
    } else if (mimeType === 'application/pdf') {
      return { category: 'pdf', icon: '📄', color: '#F44336' };
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return { category: 'document', icon: '📝', color: '#2196F3' };
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || mimeType.includes('csv')) {
      return { category: 'spreadsheet', icon: '📊', color: '#4CAF50' };
    } else if (mimeType.includes('text')) {
      return { category: 'text', icon: '📋', color: '#FF9800' };
    } else {
      return { category: 'unknown', icon: '📎', color: '#9E9E9E' };
    }
  },

  // Format file info for display
  formatFileInfoForDisplay: (fileInfo) => {
    if (!fileInfo) return null;

    const typeInfo = fileUploadApi.getFileTypeCategory(fileInfo.mimeType || fileInfo.fileType);
    
    return {
      ...fileInfo,
      typeInfo,
      formattedSize: fileUploadApi.formatFileSize(fileInfo.fileSize || fileInfo.size),
      formattedCreatedAt: fileInfo.createdAt ? new Date(fileInfo.createdAt).toLocaleString('vi-VN') : null,
      formattedUpdatedAt: fileInfo.updatedAt ? new Date(fileInfo.updatedAt).toLocaleString('vi-VN') : null,
      isImage: typeInfo.category === 'image',
      isPdf: typeInfo.category === 'pdf',
      isDocument: ['document', 'spreadsheet', 'text'].includes(typeInfo.category)
    };
  },

  // Download file with proper filename
  downloadFileWithName: async (fileId, filename) => {
    try {
      const response = await fileUploadApi.download(fileId);
      
      // Create blob URL
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `file_${fileId}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload with progress tracking
  uploadWithProgress: (file, metadata = {}, onProgress) => {
    const formData = fileUploadApi.createFormData(file, metadata);
    
    return axiosClient.post('/api/fileupload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted, progressEvent.loaded, progressEvent.total);
        }
      }
    });
  },

  // Batch upload multiple files
  uploadMultipleFiles: async (files, metadata = {}) => {
    const uploadPromises = files.map(file => {
      const validation = fileUploadApi.validateFile(file);
      if (!validation.isValid) {
        return Promise.resolve({ 
          file: file.name, 
          success: false, 
          errors: validation.errors 
        });
      }

      const formData = fileUploadApi.createFormData(file, metadata);
      return fileUploadApi.upload(formData)
        .then(response => ({ 
          file: file.name, 
          success: true, 
          data: response.data 
        }))
        .catch(error => ({ 
          file: file.name, 
          success: false, 
          error: error.message 
        }));
    });

    return Promise.all(uploadPromises);
  },

  // Get file types for form dropdown
  getFileTypes: () => [
    { value: 'VehicleDocument', label: 'Tài liệu xe', icon: '🚗' },
    { value: 'UserDocument', label: 'Tài liệu người dùng', icon: '👤' },
    { value: 'ProfileImage', label: 'Ảnh đại diện', icon: '📷' },
    { value: 'MaintenanceEvidence', label: 'Bằng chứng bảo trì', icon: '🔧' },
    { value: 'ExpenseReceipt', label: 'Biên lai chi phí', icon: '🧾' },
    { value: 'ContractDocument', label: 'Tài liệu hợp đồng', icon: '📋' },
    { value: 'LicenseDocument', label: 'Giấy phép', icon: '📜' },
    { value: 'InsuranceDocument', label: 'Bảo hiểm', icon: '🛡️' },
    { value: 'Other', label: 'Khác', icon: '📎' }
  ],

  // Validate multiple files
  validateMultipleFiles: (files) => {
    if (!files || !files.length) {
      return { isValid: false, errors: ['No files selected'] };
    }

    const results = Array.from(files).map(file => ({
      file: file.name,
      validation: fileUploadApi.validateFile(file)
    }));

    const invalidFiles = results.filter(result => !result.validation.isValid);
    
    return {
      isValid: invalidFiles.length === 0,
      results,
      invalidFiles,
      validFiles: results.filter(result => result.validation.isValid),
      summary: {
        total: files.length,
        valid: results.length - invalidFiles.length,
        invalid: invalidFiles.length
      }
    };
  }
};

export default fileUploadApi;