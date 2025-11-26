import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      alert("Đặt lại mật khẩu thành công");
      nav("/login");
    } catch (err) {
      alert("Lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Paper sx={{ p: 3, width: 420 }}>
        <Typography variant="h6">Đặt mật khẩu mới</Typography>
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={submit}
          disabled={loading}
        >
          Xác nhận
        </Button>
      </Paper>
    </Box>
  );
}
