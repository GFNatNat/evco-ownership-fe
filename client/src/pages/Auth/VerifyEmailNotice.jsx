import React from "react";
import { Box, Paper, Typography } from "@mui/material";

export default function VerifyEmailNotice() {
  return (
    <Box p={2} display="flex" justifyContent="center">
      <Paper sx={{ p: 3, width: 480 }}>
        <Typography variant="h6">Xác thực email</Typography>
        <Typography sx={{ mt: 1 }}>
          Bạn đã đăng ký. Vui lòng kiểm tra email để xác thực tài khoản trước
          khi đăng nhập.
        </Typography>
      </Paper>
    </Box>
  );
}
