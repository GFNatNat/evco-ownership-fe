import axiosClient from './axiosClient';

import fileUploadApi from './fileUploadApi';

const ownerApi = {
  // Use new fileUploadApi for file upload
  uploadFile: (formData) => fileUploadApi.upload(formData),
  verifyLicenseAuth: (data) => axiosClient.post('/api/Auth/verify-license', data),
  verifyLicense: (data) => axiosClient.post('/api/License/verify', data),
  checkExist: (data) => axiosClient.post('/api/Auth/check-exist', data),
  eligibility: (data) => axiosClient.post('/api/CoOwner/eligibility', data),
};
export default ownerApi;