import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import { LoadingProvider } from "../contexts/LoadingContext";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

// Layouts
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/admin/AdminLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyIdentity from "../pages/auth/VerifyIdentity";
import VerifyLicense from "../pages/auth/VerifyLicense";
import OnboardingSuccess from "../pages/auth/OnboardingSuccess";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Co-owner Pages
import Overview from "../pages/dashboard/Overview";
import Groups from "../pages/dashboard/Groups";
import GroupDetail from "../pages/dashboard/GroupDetail";
import Schedule from "../pages/dashboard/Schedule";
import Vehicles from "../pages/dashboard/Vehicles";
import VehicleDetail from "../pages/dashboard/VehicleDetail";
import Voting from "../pages/dashboard/Voting";
import VotingDetail from "../pages/dashboard/VotingDetail";
import Costs from "../pages/dashboard/Costs";

// Account
import Profile from "../pages/account/Profile";
import Notifications from "../pages/account/Notifications";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminGroupManagement from "../pages/admin/AdminGroupManagement";
import AdminGroupDetail from "../pages/admin/AdminGroupDetail";
import AdminContractList from "../pages/admin/AdminContractList";
import AdminContractDetail from "../pages/admin/AdminContractDetail";
import AdminContractWorkflow from "../pages/admin/AdminContractWorkflow";
import ContractManagement from "../pages/admin/ContractManagement";
import VehicleManagement from "../pages/admin/VehicleManagement";
import DisputeManagement from "../pages/admin/DisputeManagement";
import AdminDisputeResolve from "../pages/admin/AdminDisputeResolve";
import FinanceReports from "../pages/admin/FinanceReports";

// Staff Pages
import StaffDashboard from "../pages/staff/StaffDashboard";
import StaffCheckinUI from "../pages/staff/StaffCheckinUI";
import CheckInOut from "../pages/staff/CheckInOut";

// 🚀 AUTO REDIRECT BASED ON ROLE
function DashboardRedirect() {
  const role = localStorage.getItem("role");

  if (role === "Admin") return <Navigate to="/admin" replace />;
  if (role === "Staff") return <Navigate to="/staff" replace />;
  return <Navigate to="/coowner/dashboard" replace />;
}

export default function AppRouter() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-identity" element={<VerifyIdentity />} />
            <Route path="/verify-license" element={<VerifyLicense />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* MAIN DASHBOARD REDIRECT */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* COOWNER */}
            <Route
              path="/coowner"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={["Coowner", "Admin", "Staff"]}>
                    <MainLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Overview />} />
              <Route path="groups" element={<Groups />} />
              <Route path="groups/:id" element={<GroupDetail />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/:id" element={<VehicleDetail />} />
              <Route path="voting" element={<Voting />} />
              <Route path="voting/:id" element={<VotingDetail />} />
              <Route path="costs" element={<Costs />} />
            </Route>

            {/* ACCOUNT */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={["Admin"]}>
                    <AdminLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="groups" element={<AdminGroupManagement />} />
              <Route path="groups/:id" element={<AdminGroupDetail />} />
              <Route path="contracts" element={<AdminContractList />} />
              <Route path="contracts/:id" element={<AdminContractDetail />} />
              <Route
                path="contracts/:id/workflow"
                element={<AdminContractWorkflow />}
              />
              <Route path="contracts/manage" element={<ContractManagement />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="disputes" element={<DisputeManagement />} />
              <Route
                path="disputes/:id/resolve"
                element={<AdminDisputeResolve />}
              />
              <Route path="reports" element={<FinanceReports />} />
            </Route>

            {/* STAFF — FIXED: cần Layout bao quanh */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={["Admin", "Staff"]}>
                    <MainLayout /> {/* layout cho staff */}
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="checkin" element={<StaffCheckinUI />} />
              <Route path="checkin/scan" element={<CheckInOut />} />
            </Route>

            {/* DEFAULT */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}
