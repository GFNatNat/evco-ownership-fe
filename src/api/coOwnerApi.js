import axiosClient from './axiosClient';

const fileApi = {
  upload: (formData) => axiosClient.post('/api/FileUpload/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

const licenseApi = {
  verify: (data) => axiosClient.post('/api/License/verify', data),
};

const coOwnerApi = {
  eligibility: (data) => axiosClient.post('/api/CoOwner/eligibility', data),
  file: fileApi,
  license: licenseApi,
};

export default coOwnerApi;