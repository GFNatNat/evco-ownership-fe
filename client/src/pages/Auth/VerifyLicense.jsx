import { LicenseVerificationForm } from "../../components/auth/LicenseVerificationForm";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function VerifyLicense() {
  const navigate = useNavigate();

  const handleSubmit = async ({ license }) => {
    await userApi.uploadLicense(license);
    navigate("/onboarding-success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LicenseVerificationForm onSubmit={handleSubmit} />
    </div>
  );
}
