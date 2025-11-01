// Main API Index - New 7-Controller Structure
// Based on the backend refactor to 7 controllers:
// AdminController, StaffController, CoOwnerController, GroupController, AuthController, LicenseController, FileUploadController

import adminApi from './admin';
import staffApi from './staff';
import coOwnerApi from './coowner';
import authApi from './authApi';
import groupApi from './groupApi';
import licenseApi from './licenseApi';
import fileUploadApi from './fileUploadApi';

// Main API exports for the new 7-controller structure
export {
  adminApi,
  staffApi,
  coOwnerApi,
  authApi,
  groupApi,
  licenseApi,
  fileUploadApi
};

// Unified API object for easy access
const api = {
  auth: authApi,
  admin: adminApi,
  staff: staffApi,
  coowner: coOwnerApi,
  group: groupApi,
  license: licenseApi,
  fileUpload: fileUploadApi
};

export default api;

// Helper function to get APIs based on user role
export const getApiForRole = (userRole) => {
  switch (userRole) {
    case 2: // Admin
      return {
        ...adminApi,
        auth: authApi,
        group: groupApi,
        license: licenseApi,
        fileUpload: fileUploadApi
      };
    case 1: // Staff
      return {
        ...staffApi,
        auth: authApi,
        group: groupApi,
        license: licenseApi,
        fileUpload: fileUploadApi
      };
    case 0: // CoOwner
    default:
      return {
        ...coOwnerApi,
        auth: authApi,
        group: groupApi,
        license: licenseApi,
        fileUpload: fileUploadApi
      };
  }
};