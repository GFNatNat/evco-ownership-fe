import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <NavBar />
      <Sidebar />
      <Box component="main" sx={{ flex: 1, p: 3, mt: 8 }}>
        {/* If App renders routes itself, we use children. If using Outlet, render Outlet. */}
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
