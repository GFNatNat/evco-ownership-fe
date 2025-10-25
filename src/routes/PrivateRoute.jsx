// ========================= PHÂN QUYỀN ROUTE =========================
// - Mỗi route truyền roles=["Admin"], ["Staff"], ["CoOwner"]
// - Nếu user không có role hoặc role không nằm trong danh sách, sẽ chuyển hướng về /access-denied
// - Đảm bảo chỉ đúng role mới truy cập được route tương ứng
// ====================================================================
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ roles }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/access-denied" replace />;
  return <Outlet />;
}