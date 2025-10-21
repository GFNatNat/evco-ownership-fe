import axiosClient from './axiosClient';

const fileUploadApi = {
    // File upload functionality
    upload: (formData) => axiosClient.post('/api/FileUpload/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // Multiple file upload
    uploadMultiple: (formData) => axiosClient.post('/api/FileUpload/upload-multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // File management
    getFile: (fileId) => axiosClient.get(`/api/FileUpload/${fileId}`),
    deleteFile: (fileId) => axiosClient.delete(`/api/FileUpload/${fileId}`),

    // Document specific uploads
    uploadVehicleDocument: (vehicleId, formData) => axiosClient.post(`/api/FileUpload/vehicle/${vehicleId}/document`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    uploadUserDocument: (formData) => axiosClient.post('/api/FileUpload/user/document', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    uploadProfileImage: (formData) => axiosClient.post('/api/FileUpload/profile-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // File validation
    validateFile: (fileType, fileSize) => axiosClient.post('/api/FileUpload/validate', {
        fileType,
        fileSize
    }),

    // Get file URL
    getFileUrl: (fileId) => axiosClient.get(`/api/FileUpload/${fileId}/url`),

    // Download file
    downloadFile: (fileId, filename) => axiosClient.get(`/api/FileUpload/${fileId}/download`, {
        responseType: 'blob',
        params: { filename }
    })
};

export default fileUploadApi;