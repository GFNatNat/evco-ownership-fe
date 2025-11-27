import { RegisterForm } from "../../components/auth/RegisterForm";
import authApi from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    await authApi.register(data);
    navigate("/verify-identity");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSubmit={handleRegister} />
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
