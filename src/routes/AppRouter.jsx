// ========================= ROUTING FOR 7-CONTROLLER STRUCTURE =========================
// - Clean routes aligned with new 7-controller backend structure
// - Role-based access: Admin (role=2), Staff (role=1), CoOwner (role=0)
// - Simplified navigation without redundant or obsolete pages
// - Routes match API endpoints structure
// ==================================================================================
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout components
import PublicLayout from '../components/layout/PublicLayout';
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import StaffDashboardLayout from '../components/layout/StaffDashboardLayout';
import CoOwnerDashboardLayout from '../components/layout/CoOwnerDashboardLayout';
import ProfileDashboardLayout from '../components/layout/ProfileDashboardLayout';

// Public pages
import Index from '../pages/Landing/Index';
import Login from '../pages/Landing/Login';
import Register from '../pages/Landing/Register';
import ForgotPassword from '../pages/Landing/ForgotPassword';
import ResetPassword from '../pages/Landing/ResetPassword';

// Dashboard pages
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import StaffDashboard from '../pages/Dashboard/StaffDashboard';
import CoOwnerDashboard from '../pages/Dashboard/CoOwnerDashboard';

// Admin pages - AdminController endpoints only
import AdminUsers from '../pages/Admin/Users';
import AdminGroups from '../pages/Admin/Groups';
import AdminReports from '../pages/Admin/Reports';
import AdminSettings from '../pages/Admin/Settings';
import LicenseManagement from '../pages/Admin/LicenseManagement';
import NotificationManagement from '../pages/Admin/NotificationManagement';
import AuditLogs from '../pages/Admin/AuditLogs';

// Staff pages - StaffController endpoints only
import Fleet from '../pages/Staff/Fleet';
import StaffContracts from '../pages/Staff/Contracts';
import CheckInOut from '../pages/Staff/CheckInOut';
import StaffDisputes from '../pages/Staff/Disputes';
import Services from '../pages/Staff/Services';

// CoOwner pages - CoOwnerController endpoints only
import AccountOwnership from '../pages/CoOwner/AccountOwnership';
import BookingManagement from '../pages/CoOwner/BookingManagement';
import FundManagement from '../pages/CoOwner/FundManagement';
import PaymentManagement from '../pages/CoOwner/PaymentManagement';
import VehicleAvailability from '../pages/CoOwner/VehicleAvailability';
import UsageAnalytics from '../pages/CoOwner/UsageAnalytics';

// Group pages - GroupController endpoints
import GroupManagement from '../pages/Group/GroupManagement';
import MemberManagement from '../pages/Group/MemberManagement';

// License pages - LicenseController endpoints  
import LicenseVerification from '../pages/License/LicenseVerification';
import LicenseStatus from '../pages/License/LicenseStatus';
import MyLicenses from '../pages/License/MyLicenses';

// Profile pages
import Profile from '../pages/Profile/Profile';

// Error pages
import AccessDenied from '../pages/Error/AccessDenied';
import NotFound from '../pages/Error/NotFound';

// Route protection
import PrivateRoute from './PrivateRoute';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Routes - Protected with Role Check (role = 2) */}
      <Route element={<PrivateRoute roles={[2]} />}>
        <Route element={<AdminDashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/licenses" element={<LicenseManagement />} />
          <Route path="/admin/groups" element={<AdminGroups />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>

      {/* Staff Routes - Protected with Role Check (role = 1) */}
      <Route element={<PrivateRoute roles={[1]} />}>
        <Route element={<StaffDashboardLayout />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/fleet" element={<Fleet />} />
          <Route path="/staff/contracts" element={<StaffContracts />} />
          <Route path="/staff/checkin" element={<CheckInOut />} />
          <Route path="/staff/disputes" element={<StaffDisputes />} />
          <Route path="/staff/services" element={<Services />} />
        </Route>
      </Route>

      {/* CoOwner Routes - Protected with Role Check (role = 0) */}
      <Route element={<PrivateRoute roles={[0]} />}>
        <Route element={<CoOwnerDashboardLayout />}>
          <Route path="/coowner" element={<CoOwnerDashboard />} />
          <Route path="/coowner/profile" element={<AccountOwnership />} />
          <Route path="/coowner/vehicles" element={<VehicleAvailability />} />
          <Route path="/coowner/bookings" element={<BookingManagement />} />
          <Route path="/coowner/analytics" element={<UsageAnalytics />} />
          <Route path="/coowner/funds" element={<FundManagement />} />
          <Route path="/coowner/payments" element={<PaymentManagement />} />
        </Route>
      </Route>

      {/* Group Routes - Available for relevant roles */}
      <Route element={<PrivateRoute roles={[0, 1, 2]} />}>
        <Route path="/groups" element={<GroupManagement />} />
        <Route path="/groups/:groupId/members" element={<MemberManagement />} />
      </Route>

      {/* License Routes - Available for all authenticated users */}
      <Route element={<PrivateRoute roles={[0, 1, 2]} />}>
        <Route path="/license/verify" element={<LicenseVerification />} />
        <Route path="/license/status/:verificationId" element={<LicenseStatus />} />
        <Route path="/license/my-licenses" element={<MyLicenses />} />
      </Route>

      {/* Profile Routes - Available for all authenticated users */}
      <Route element={<PrivateRoute roles={[0, 1, 2]} />}>
        <Route element={<ProfileDashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Role-based Dashboard Redirects */}
      <Route element={<PrivateRoute roles={[0, 1, 2]} />}>
        <Route path="/dashboard" element={<RoleRedirect />} />
      </Route>

      {/* Legacy Route Redirects */}
      <Route path="/co-owner/*" element={<Navigate to="/coowner" replace />} />
      <Route path="/admin/analytics" element={<Navigate to="/admin/reports" replace />} />

      {/* Error Routes */}
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Helper component for role-based redirects
import { useAuth } from '../context/AuthContext';

function RoleRedirect() {
  const { user } = useAuth();

  // Use numeric role values (as per 7-controller structure)
  switch (user?.role) {
    case 2: // Admin
      return <Navigate to="/admin" replace />;
    case 1: // Staff
      return <Navigate to="/staff" replace />;
    case 0: // CoOwner
    default:
      return <Navigate to="/coowner" replace />;
  }
}