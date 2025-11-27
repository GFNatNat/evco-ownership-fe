import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import { LoadingProvider } from "../contexts/LoadingContext";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

// Layouts
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/admin/AdminLayout";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyIdentity from "../pages/Auth/VerifyIdentity";
import VerifyLicense from "../pages/Auth/VerifyLicense";
import OnboardingSuccess from "../pages/Auth/OnboardingSuccess";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

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

// Account Pages
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

// Redirect Helper
import DashboardRedirect from "../pages/DashboardRedirect";

export default function AppRouter() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-identity" element={<VerifyIdentity />} />
            <Route path="/verify-license" element={<VerifyLicense />} />
            <Route path="/onboarding-success" element={<OnboardingSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* --- DISPATCHER --- */}
            {/* Route gốc "/" sẽ tự động kiểm tra role và đưa về dashboard tương ứng */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            {/* Route cũ "/dashboard" giữ lại để tương thích */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* --- CO-OWNER ROUTES --- */}
            <Route
              path="/coowner"
              element={
                <ProtectedRoute>
                  {/* Coowner, Admin, Staff đều xem được giao diện user thường */}
                  <RoleGuard roles={["Coowner", "Admin", "Staff"]}>
                    <MainLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Overview />} />
              {/* Groups Management */}
              <Route path="groups" element={<Groups />} />
              <Route path="groups/:id" element={<GroupDetail />} />
              {/* Vehicle & Schedule */}
              <Route path="schedule" element={<Schedule />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/:id" element={<VehicleDetail />} />
              {/* Voting & Costs */}
              <Route path="vote" element={<Voting />} />{" "}
              {/* Sửa path khớp với Sidebar */}
              <Route path="voting/:id" element={<VotingDetail />} />
              <Route path="cost" element={<Costs />} />{" "}
              {/* Sửa path khớp với Sidebar */}
            </Route>

            {/* --- ACCOUNT ROUTES (FIXED) --- */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* QUAN TRỌNG: Dòng này sửa lỗi bấm vào Account bị trắng trang/login loop */}
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* --- ADMIN ROUTES --- */}
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

              {/* Group Management */}
              <Route path="groups" element={<AdminGroupManagement />} />
              <Route path="groups/:id" element={<AdminGroupDetail />} />

              {/* Contract Management */}
              <Route path="contracts" element={<AdminContractList />} />
              <Route path="contracts/:id" element={<AdminContractDetail />} />
              <Route
                path="contracts/:id/workflow"
                element={<AdminContractWorkflow />}
              />
              <Route path="contracts/manage" element={<ContractManagement />} />

              {/* System Management */}
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="disputes" element={<DisputeManagement />} />
              <Route
                path="disputes/:id/resolve"
                element={<AdminDisputeResolve />}
              />
              <Route path="reports" element={<FinanceReports />} />
            </Route>

            {/* --- STAFF ROUTES --- */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={["Admin", "Staff"]}>
                    <MainLayout />
                  </RoleGuard>
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="checkin" element={<StaffCheckinUI />} />
              <Route path="checkin/scan" element={<CheckInOut />} />
            </Route>

            {/* --- FALLBACK --- */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  );
}
