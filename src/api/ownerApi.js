import axiosClient from './axiosClient';

const ownerApi = {
  uploadFile: (formData) => axiosClient.post('/api/FileUpload/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  verifyLicenseAuth: (data) => axiosClient.post('/api/Auth/verify-license', data),
  verifyLicense: (data) => axiosClient.post('/api/License/verify', data),
  checkExist: (data) => axiosClient.post('/api/Auth/check-exist', data),
  eligibility: (data) => axiosClient.post('/api/CoOwner/eligibility', data),
};
export default ownerApi;