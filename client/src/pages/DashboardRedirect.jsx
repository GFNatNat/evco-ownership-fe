import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role === "Admin") navigate("/admin");
    else if (user.role === "Staff") navigate("/staff");
    else navigate("/coowner/dashboard");
  }, [user]);

  return null;
}
