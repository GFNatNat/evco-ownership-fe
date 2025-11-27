import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function OnboardingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-green-600">
        Verification Complete!
      </h1>
      <p className="text-gray-700 text-center max-w-md">
        Your identity and driver license have been successfully verified. You
        can now access full system features.
      </p>
      <Button variant="contained" onClick={() => navigate("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  );
}
