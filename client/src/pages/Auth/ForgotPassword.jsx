import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import api from "../../api/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("Email reset đã được gửi nếu tài khoản tồn tại.");
    } catch (err) {
      setError("Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Paper sx={{ p: 3, width: 420 }}>
        <Typography variant="h6">Quên mật khẩu</Typography>
        {success && (
          <Alert severity="success" sx={{ mt: 1 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={submit}
          disabled={loading}
        >
          Gửi
        </Button>
      </Paper>
    </Box>
  );
}
