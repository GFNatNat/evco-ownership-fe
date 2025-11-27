import { useSearchParams, useNavigate } from "react-router-dom";
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";
import authApi from "../../api/authApi";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const handleSubmit = async ({ password }) => {
    await authApi.resetPassword(token, { password });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ResetPasswordForm onSubmit={handleSubmit} />
    </div>
  );
}
