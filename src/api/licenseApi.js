import axiosClient from './axiosClient';

const licenseApi = {
    // Submit License for Verification
    verifyLicense: (formData) => {
        // FormData should already be created with all fields and license image
        return axiosClient.post('/api/shared/license/verify', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Check if License Exists
    checkLicenseExists: (licenseNumber) =>
        axiosClient.get(`/api/shared/license/check-exists?licenseNumber=${licenseNumber}`),

    // Get License Info
    getLicenseInfo: (licenseNumber) =>
        axiosClient.get(`/api/shared/license/info?licenseNumber=${licenseNumber}`),

    // Check Verification Status
    getLicenseStatus: (verificationId) =>
        axiosClient.get(`/api/shared/license/status/${verificationId}`),

    // Get My Licenses
    getMyLicenses: () =>
        axiosClient.get('/api/shared/license/my-licenses')
};

export default licenseApi;