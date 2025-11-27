import { IdentityVerificationForm } from "../../components/auth/IdentityVerificationForm";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";

export default function VerifyIdentity() {
  const navigate = useNavigate();

  const handleSubmit = async ({ front, back }) => {
    const formData = new FormData();
    formData.append("front", front);
    formData.append("back", back);

    await userApi.updateMe(formData);
    navigate("/verify-license");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <IdentityVerificationForm onSubmit={handleSubmit} />
    </div>
  );
}
