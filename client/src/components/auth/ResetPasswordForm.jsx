import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export function ResetPasswordForm({ onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ password });
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl p-4">
      <CardContent className="flex flex-col gap-4">
        <Typography variant="h6" className="text-center">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
