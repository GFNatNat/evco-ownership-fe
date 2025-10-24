import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/Landing/Login';
import Register from '../pages/Landing/Register';
import ForgotPassword from '../pages/Landing/ForgotPassword';
import ResetPassword from '../pages/Landing/ResetPassword';
import CoOwnerDashboard from '../pages/Dashboard/CoOwnerDashboard';
import Schedule from '../pages/CoOwner/Schedule';
import Payments from '../pages/CoOwner/Payments';
import StaffDashboard from '../pages/Dashboard/StaffDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import PrivateRoute from './PrivateRoute';
import AdminSettings from '../pages/Admin/Settings';
import AdminReports from '../pages/Admin/Reports';
import AdminGroups from '../pages/Admin/Groups';
import AdminUsers from '../pages/Admin/Users';
import LicenseManagement from '../pages/Admin/LicenseManagement';
import StaffDisputes from '../pages/Staff/Disputes';
import StaffServices from '../pages/Staff/Services';
import CheckInOut from '../pages/Staff/CheckInOut';
import StaffContracts from '../pages/Staff/Contracts';
import Fleet from '../pages/Staff/Fleet';
import AccountOwnership from '../pages/CoOwner/AccountOwnership';
import CreateVehicle from '../pages/CoOwner/CreateVehicle';
import VehicleManagement from '../pages/CoOwner/VehicleManagement';
import Invitations from '../pages/CoOwner/Invitations';
import VehicleAvailability from '../pages/CoOwner/VehicleAvailability';
import VehicleAnalytics from '../pages/CoOwner/VehicleAnalytics';
import VehicleVerification from '../pages/Staff/VehicleVerification';
import Profile from '../pages/Profile/Profile';
import AccessDenied from '../pages/Error/AccessDenied';
import NotFound from '../pages/Error/NotFound';
import Index from '../pages/Landing/Index';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Index />} />

      {/* Landing */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated routes with layout */}
      <Route element={<PrivateRoute roles={['CoOwner', 'Admin', 'Staff']} />}>
        {/* Dashboard routes WITHOUT AppLayout */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/role" replace />} />
        <Route path="/dashboard/role" element={<RoleRedirect />} />
        <Route path="/dashboard/coowner" element={<CoOwnerDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* Other routes WITH AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/co-owner/account" element={<AccountOwnership />} />
          <Route path="/co-owner/schedule" element={<Schedule />} />
          <Route path="/co-owner/payments" element={<Payments />} />
          <Route path="/co-owner/vehicles" element={<VehicleManagement />} />
          <Route path="/co-owner/create-vehicle" element={<CreateVehicle />} />
          <Route path="/co-owner/invitations" element={<Invitations />} />
          <Route path="/co-owner/availability" element={<VehicleAvailability />} />
          <Route path="/co-owner/analytics" element={<VehicleAnalytics />} />

          <Route path="/staff/fleet" element={<Fleet />} />
          <Route path="/staff/contracts" element={<StaffContracts />} />
          <Route path="/staff/checkin" element={<CheckInOut />} />
          <Route path="/staff/services" element={<StaffServices />} />
          <Route path="/staff/disputes" element={<StaffDisputes />} />
          <Route path="/staff/vehicle-verification" element={<VehicleVerification />} />

          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/groups" element={<AdminGroups />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/licenses" element={<LicenseManagement />} />

          {/* Profile route for all roles */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { useAuth } from '../context/AuthContext';
function RoleRedirect() {
  const { user } = useAuth();
  if (user?.role === 'Admin') return <Navigate to="/dashboard/admin" replace />;
  if (user?.role === 'Staff') return <Navigate to="/dashboard/staff" replace />;
  return <Navigate to="/dashboard/coowner" replace />;
}