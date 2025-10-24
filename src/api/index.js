// Main API Index - Role-based API structure
// Import role-specific APIs
import adminApi from './admin';
import staffApi from './staff';
import coOwnerApi from './coowner';
import profileApi from './profile';
import sharedApi from './shared';

// Keep legacy API imports for backward compatibility during migration
import authApi from './authApi';
import vehicleApi from './vehicleApi';
import bookingApi from './bookingApi';
import paymentApi from './paymentApi';
import maintenanceApi from './maintenanceApi';
import reportApi from './reportApi';
import disputeApi from './disputeApi';
import notificationApi from './notificationApi';
import votingApi from './votingApi';
import fundApi from './fundApi';
import contractApi from './contractApi';
import userApi from './userApi';
import groupApi from './groupApi';

// Role-based API exports (NEW STRUCTURE)
export { adminApi, staffApi, coOwnerApi, profileApi, sharedApi };

// Legacy API exports (for backward compatibility)
export { 
  authApi, 
  vehicleApi, 
  bookingApi, 
  paymentApi, 
  maintenanceApi, 
  reportApi, 
  disputeApi, 
  notificationApi, 
  votingApi, 
  fundApi, 
  contractApi, 
  userApi, 
  groupApi 
};

// Unified API object for role-based access
const api = {
  // Role-based APIs
  admin: adminApi,
  staff: staffApi,
  coowner: coOwnerApi,
  profile: profileApi,
  shared: sharedApi,

  // Legacy APIs (for backward compatibility)
  legacy: {
    auth: authApi,
    vehicle: vehicleApi,
    booking: bookingApi,
    payment: paymentApi,
    maintenance: maintenanceApi,
    report: reportApi,
    dispute: disputeApi,
    notification: notificationApi,
    voting: votingApi,
    fund: fundApi,
    contract: contractApi,
    user: userApi,
    group: groupApi
  }
};

export default api;

// Helper function to get APIs based on user role
export const getApiForRole = (userRole) => {
  switch (userRole?.toLowerCase()) {
    case 'admin':
      return {
        ...adminApi,
        shared: sharedApi,
        profile: profileApi
      };
    case 'staff':
      return {
        ...staffApi,
        shared: sharedApi,
        profile: profileApi
      };
    case 'coowner':
    case 'co-owner':
      return {
        ...coOwnerApi,
        shared: sharedApi,
        profile: profileApi
      };
    default:
      return {
        shared: sharedApi,
        profile: profileApi
      };
  }
};

// Migration note:
// This structure allows for:
// 1. Gradual migration from legacy APIs to role-based APIs
// 2. Clear separation of concerns by role
// 3. Shared functionality through sharedApi
// 4. Backward compatibility during transition period