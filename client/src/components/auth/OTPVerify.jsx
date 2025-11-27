import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export function OTPVerify({ onSubmit }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ otp });
  };

  return (
    <Card className="max-w-sm mx-auto shadow-xl p-4">
      <CardContent className="flex flex-col gap-4">
        <Typography variant="h6" className="text-center">
          Verify OTP
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Confirm
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
