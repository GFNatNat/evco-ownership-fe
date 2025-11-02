// ========================= PHÂN QUYỀN ROUTE =========================
// - Mỗi route truyền roles=["Admin"], ["Staff"], ["CoOwner"]
// - Nếu user không có role hoặc role không nằm trong danh sách, sẽ chuyển hướng về /access-denied
// - Đảm bảo chỉ đúng role mới truy cập được route tương ứng
// ====================================================================
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ roles }) {
  const { user, accessToken, isAuthenticated, isLoading } = useAuth();

  // Wait for auth state to be loaded
  if (isLoading) {
    console.log('⏳ Auth loading, please wait...');
    return <div>Loading...</div>; // Or a proper loading component
  }

  // Debug logging
  console.log('🔍 PrivateRoute Debug:', {
    user,
    accessToken: !!accessToken,
    isAuthenticated,
    isLoading,
    requiredRoles: roles,
    userRole: user?.role,
    userRoleType: typeof user?.role
  });

  // Check authentication
  if (!accessToken || !isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check role authorization if roles are specified
  if (roles && user && !roles.includes(user.role)) {
    console.warn(`❌ Access denied: user role ${user.role} (${typeof user.role}) not in allowed roles:`, roles);
    return <Navigate to="/access-denied" replace />;
  }

  console.log('✅ Access granted');
  return <Outlet />;
}