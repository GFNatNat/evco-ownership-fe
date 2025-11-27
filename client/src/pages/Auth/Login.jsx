import { LoginForm } from "../../components/auth/LoginForm";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    console.log(">>> HANDLE LOGIN CALLED", { email, password });

    const ok = await login({ email, password });
    // ✔ gửi object

    if (!ok) return;

    const role = localStorage.getItem("role");
    if (role === "Admin") navigate("/admin");
    else if (role === "Staff") navigate("/staff");
    else navigate("/coowner/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <LoginForm onSubmit={handleLogin} />
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link className="text-blue-600" to="/register">
            Register
          </Link>
        </p>
        <p className="text-center mt-2 text-sm text-gray-600">
          <Link className="text-blue-600" to="/forgot-password">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
