// ========================= XỬ LÝ KHI BỊ CHẶN PHÂN QUYỀN =========================
// - Khi bị chặn, FE xác định role hiện tại và hiển thị nút về đúng dashboard tương ứng
// - Đảm bảo UX tốt: người dùng luôn có đường quay về dashboard hợp lệ
// =================================================================================
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AccessDenied() {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Xác định dashboard phù hợp với role
  let dashboardPath = '/';
  let dashboardLabel = 'Trang chủ';
  if (role === 'Admin') {
    dashboardPath = '/admin';
    dashboardLabel = 'Về trang Admin';
  } else if (role === 'Staff') {
    dashboardPath = '/staff';
    dashboardLabel = 'Về trang Staff';
  } else if (role === 'CoOwner') {
    dashboardPath = '/coowner';
    dashboardLabel = 'Về trang Co-Owner';
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <ReportProblemIcon color="error" sx={{ fontSize: 64 }} />
        <Typography variant="h4" color="error" fontWeight={700}>
          Truy cập bị từ chối
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra lại quyền truy cập hoặc quay về dashboard phù hợp.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3 }}
          onClick={() => navigate(dashboardPath)}
        >
          {dashboardLabel}
        </Button>
      </Box>
    </Container>
  );
}
