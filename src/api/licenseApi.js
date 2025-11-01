import axiosClient from './axiosClient';

const licenseApi = {
    // Submit License for Verification
    verifyLicense: (formData) => {
        // FormData should already be created with all fields and license image
        return axiosClient.post('/shared/license/verify', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Check if License Exists
    checkLicenseExists: (licenseNumber) =>
        axiosClient.get(`/shared/license/check-exists?licenseNumber=${licenseNumber}`),

    // Get License Info
    getLicenseInfo: (licenseNumber) =>
        axiosClient.get(`/shared/license/info?licenseNumber=${licenseNumber}`),

    // Check Verification Status
    getLicenseStatus: (verificationId) =>
        axiosClient.get(`/shared/license/status/${verificationId}`),

    // Get My Licenses
    getMyLicenses: () =>
        axiosClient.get('/shared/license/my-licenses')
};

export default licenseApi;