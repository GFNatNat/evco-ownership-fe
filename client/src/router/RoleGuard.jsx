import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function normalizeRoleName(r) {
  if (!r) return "coowner";
  return String(r).toLowerCase();
}

export default function RoleGuard({ roles = [], children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
  const normalizedUserRoles = userRoles.map((r) => normalizeRoleName(r));
  const normalizedAllowed = roles.map((r) => normalizeRoleName(r));

  const allowed = normalizedUserRoles.some((ur) =>
    normalizedAllowed.includes(ur)
  );

  if (!allowed) return <Navigate to="/dashboard" replace />;
  return children;
}
