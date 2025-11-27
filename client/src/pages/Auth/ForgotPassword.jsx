import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import authApi from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authApi.forgotPassword({ email });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md mx-auto shadow-xl p-4">
        <CardContent className="flex flex-col gap-4">
          <Typography variant="h6">Forgot Password</Typography>

          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <Button type="submit" variant="contained" fullWidth>
                Send Reset Link
              </Button>
            </form>
          ) : (
            <p className="text-green-600">
              Reset link has been sent to your email.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
