import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

/**
 * AppLayout - Minimal wrapper component
 * 
 * This component is now deprecated in favor of role-based Dashboard Layouts:
 * - AdminDashboardLayout for Admin role
 * - StaffDashboardLayout for Staff role  
 * - CoOwnerDashboardLayout for CoOwner role
 * - ProfileDashboardLayout for Profile pages
 * - PublicLayout for public pages
 * 
 * This component is kept only for backward compatibility and will be removed in future versions.
 */
export default function AppLayout() {
  console.warn('AppLayout is deprecated. Use role-based Dashboard Layouts instead.');
  
  return (
    <Box>
      {/* Minimal wrapper - just render children */}
      <Outlet />
    </Box>
  );
}