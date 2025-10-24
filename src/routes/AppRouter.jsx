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

// Admin pages
import AdminUsers from '../pages/Admin/Users';
import AdminGroups from '../pages/Admin/Groups';
import AdminReports from '../pages/Admin/Reports';
import AdminSettings from '../pages/Admin/Settings';
import LicenseManagement from '../pages/Admin/LicenseManagement';
import CheckInCheckOutOversight from '../pages/Admin/CheckInCheckOutOversight';
import BookingReminderManagementAdmin from '../pages/Admin/BookingReminderManagement';
import VehicleReportsManagementAdmin from '../pages/Admin/VehicleReportsManagement';
import VehicleUpgradeOversight from '../pages/Admin/VehicleUpgradeOversight';
import FairnessOptimizationMonitoring from '../pages/Admin/FairnessOptimizationMonitoring';

// Staff pages
import Fleet from '../pages/Staff/Fleet';
import StaffContracts from '../pages/Staff/Contracts';
import CheckInOut from '../pages/Staff/CheckInOut';
import StaffServices from '../pages/Staff/Services';
import StaffDisputes from '../pages/Staff/Disputes';
import VehicleVerification from '../pages/Staff/VehicleVerification';
import BookingReminderManagementStaff from '../pages/Staff/BookingReminderManagement';
import VehicleReportGeneration from '../pages/Staff/VehicleReportGeneration';
import VehicleUpgradeApproval from '../pages/Staff/VehicleUpgradeApproval';
import FairnessMonitoring from '../pages/Staff/FairnessMonitoring';

// CoOwner pages
import AccountOwnership from '../pages/CoOwner/AccountOwnership';
import CreateVehicle from '../pages/CoOwner/CreateVehicle';
import VehicleManagement from '../pages/CoOwner/VehicleManagement';
import Invitations from '../pages/CoOwner/Invitations';
import VehicleAvailability from '../pages/CoOwner/VehicleAvailability';
import VehicleAnalytics from '../pages/CoOwner/VehicleAnalytics';
import Schedule from '../pages/CoOwner/Schedule';
import BookingManagement from '../pages/CoOwner/BookingManagement';
import Payments from '../pages/CoOwner/Payments';
import PaymentManagement from '../pages/CoOwner/PaymentManagement';
import FundManagement from '../pages/CoOwner/FundManagement';
import MaintenanceManagement from '../pages/CoOwner/MaintenanceManagement';
import MaintenanceVoteManagement from '../pages/CoOwner/MaintenanceVoteManagement';
import ReportsManagement from '../pages/CoOwner/ReportsManagement';
import NotificationManagement from '../pages/CoOwner/NotificationManagement';
import VotingManagement from '../pages/CoOwner/VotingManagement';
import DepositManagement from '../pages/CoOwner/DepositManagement';
import DisputeManagement from '../pages/CoOwner/DisputeManagement';
import FairnessOptimizationManagement from '../pages/CoOwner/FairnessOptimizationManagement';
import OwnershipChangeManagement from '../pages/CoOwner/OwnershipChangeManagement';
import OwnershipHistoryManagement from '../pages/CoOwner/OwnershipHistoryManagement';
import UsageAnalyticsManagement from '../pages/CoOwner/UsageAnalyticsManagement';
import VehicleReportManagement from '../pages/CoOwner/VehicleReportManagement';
import VehicleUpgradeManagement from '../pages/CoOwner/VehicleUpgradeManagement';
import BookingReminderManagementCoOwner from '../pages/CoOwner/BookingReminderManagement';
import CheckInCheckOutManagement from '../pages/CoOwner/CheckInCheckOutManagement';

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

      {/* Admin Routes - Protected with Role Check */}
      <Route element={<PrivateRoute roles={['Admin']} />}>
        <Route element={<AdminDashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/licenses" element={<LicenseManagement />} />
          <Route path="/admin/groups" element={<AdminGroups />} />
          <Route path="/admin/checkin-oversight" element={<CheckInCheckOutOversight />} />
          <Route path="/admin/booking-reminder-management" element={<BookingReminderManagementAdmin />} />
          <Route path="/admin/vehicle-upgrade-oversight" element={<VehicleUpgradeOversight />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/vehicle-reports-management" element={<VehicleReportsManagementAdmin />} />
          <Route path="/admin/fairness-optimization-monitoring" element={<FairnessOptimizationMonitoring />} />
          <Route path="/admin/analytics" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Staff Routes - Protected with Role Check */}
      <Route element={<PrivateRoute roles={['Staff']} />}>
        <Route element={<StaffDashboardLayout />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/fleet" element={<Fleet />} />
          <Route path="/staff/vehicle-verification" element={<VehicleVerification />} />
          <Route path="/staff/contracts" element={<StaffContracts />} />
          <Route path="/staff/checkin" element={<CheckInOut />} />
          <Route path="/staff/booking-reminder" element={<BookingReminderManagementStaff />} />
          <Route path="/staff/services" element={<StaffServices />} />
          <Route path="/staff/disputes" element={<StaffDisputes />} />
          <Route path="/staff/vehicle-reports" element={<VehicleReportGeneration />} />
          <Route path="/staff/vehicle-upgrade-approval" element={<VehicleUpgradeApproval />} />
          <Route path="/staff/fairness-monitoring" element={<FairnessMonitoring />} />
        </Route>
      </Route>

      {/* CoOwner Routes - Protected with Role Check */}
      <Route element={<PrivateRoute roles={['CoOwner']} />}>
        <Route element={<CoOwnerDashboardLayout />}>
          <Route path="/coowner" element={<CoOwnerDashboard />} />
          <Route path="/coowner/account" element={<AccountOwnership />} />
          <Route path="/coowner/vehicles" element={<VehicleManagement />} />
          <Route path="/coowner/create-vehicle" element={<CreateVehicle />} />
          <Route path="/coowner/invitations" element={<Invitations />} />
          <Route path="/coowner/availability" element={<VehicleAvailability />} />
          <Route path="/coowner/analytics" element={<VehicleAnalytics />} />
          <Route path="/coowner/schedule" element={<Schedule />} />
          <Route path="/coowner/booking-management" element={<BookingManagement />} />
          <Route path="/coowner/booking-reminder" element={<BookingReminderManagementCoOwner />} />
          <Route path="/coowner/checkin-checkout" element={<CheckInCheckOutManagement />} />
          <Route path="/coowner/payments" element={<Payments />} />
          <Route path="/coowner/payment-management" element={<PaymentManagement />} />
          <Route path="/coowner/fund-management" element={<FundManagement />} />
          <Route path="/coowner/maintenance-management" element={<MaintenanceManagement />} />
          <Route path="/coowner/maintenance-vote-management" element={<MaintenanceVoteManagement />} />
          <Route path="/coowner/vehicle-upgrade" element={<VehicleUpgradeManagement />} />
          <Route path="/coowner/reports-management" element={<ReportsManagement />} />
          <Route path="/coowner/vehicle-reports" element={<VehicleReportManagement />} />
          <Route path="/coowner/notification-management" element={<NotificationManagement />} />
          <Route path="/coowner/voting-management" element={<VotingManagement />} />
          <Route path="/coowner/deposit-management" element={<DepositManagement />} />
          <Route path="/coowner/dispute-management" element={<DisputeManagement />} />
          <Route path="/coowner/fairness-optimization" element={<FairnessOptimizationManagement />} />
          <Route path="/coowner/ownership-change-management" element={<OwnershipChangeManagement />} />
          <Route path="/coowner/ownership-history-management" element={<OwnershipHistoryManagement />} />
          <Route path="/coowner/usage-analytics-management" element={<UsageAnalyticsManagement />} />
          <Route path="/coowner/vehicle-report-management" element={<VehicleReportManagement />} />
          <Route path="/coowner/vehicle-upgrade-management" element={<VehicleUpgradeManagement />} />
          <Route path="/coowner/history" element={<OwnershipHistoryManagement />} />
          <Route path="/coowner/group" element={<AccountOwnership />} />
        </Route>
      </Route>

      {/* Profile Routes - Available for all authenticated users */}
      <Route element={<PrivateRoute roles={['Admin', 'Staff', 'CoOwner']} />}>
        <Route element={<ProfileDashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<Profile />} />
          <Route path="/profile/settings" element={<Profile />} />
          <Route path="/profile/security" element={<Profile />} />
          <Route path="/profile/notifications" element={<Profile />} />
          <Route path="/profile/activity" element={<Profile />} />
        </Route>
      </Route>

      {/* Legacy Dashboard Redirects */}
      <Route element={<PrivateRoute roles={['Admin', 'Staff', 'CoOwner']} />}>
        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/dashboard/role" element={<RoleRedirect />} />
        <Route path="/dashboard/admin" element={<Navigate to="/admin" replace />} />
        <Route path="/dashboard/staff" element={<Navigate to="/staff" replace />} />
        <Route path="/dashboard/coowner" element={<Navigate to="/coowner" replace />} />
      </Route>

      {/* Legacy Route Redirects - Co-Owner */}
      <Route path="/co-owner/*" element={<Navigate to="/coowner" replace />} />

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
  if (user?.role === 'Admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'Staff') return <Navigate to="/staff" replace />;
  return <Navigate to="/coowner" replace />;
}