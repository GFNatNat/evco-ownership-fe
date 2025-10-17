import React from 'react';
import { Container, Typography } from '@mui/material';
export default function AccessDenied() {
  return <Container sx={{ mt: 8 }}><Typography variant="h5" color="error">Bạn không có quyền truy cập.</Typography></Container>;
}