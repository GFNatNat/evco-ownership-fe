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
import AccessDenied from '../pages/Error/AccessDenied';
import NotFound from '../pages/Error/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated routes with layout */}
      <Route element={<PrivateRoute roles={['CoOwner','Admin','Staff']} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Navigate to="/dashboard/role" replace />} />
          {/* role-based redirect */}
          <Route path="/dashboard/role" element={<RoleRedirect />} />
          <Route path="/dashboard/coowner" element={<CoOwnerDashboard />} />
              <Route path="/co-owner/schedule" element={<Schedule />} />
              <Route path="/co-owner/payments" element={<Payments />} />
          <Route path="/dashboard/staff" element={<StaffDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
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