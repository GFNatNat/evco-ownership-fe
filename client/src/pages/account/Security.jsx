import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import api from "../../api/axiosClient";

export default function Security() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    setLoading(true);
    try {
      await api.post("/users/change-password", {
        currentPassword: current,
        newPassword: newPass,
      });
      alert("Đổi mật khẩu thành công");
      setCurrent("");
      setNewPass("");
    } catch (err) {
      alert("Lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Bảo mật</Typography>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          fullWidth
          sx={{ mt: 1 }}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          fullWidth
          sx={{ mt: 1 }}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={changePassword}
          disabled={loading}
        >
          Đổi mật khẩu
        </Button>
      </Paper>
    </Box>
  );
}
