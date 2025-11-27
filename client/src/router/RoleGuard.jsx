import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../utils/roles";

export default function RoleGuard({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const role = user?.roles?.[0] || localStorage.getItem("role") || "Coowner";

  if (!roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
