"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#00bcd4" },
      background: {
        default: darkMode ? "#0d0d0d" : "#fafafa",
        paper: darkMode ? "#1a1a1a" : "#ffffff",
      },
    },
    typography: { fontFamily: "Inter, sans-serif" },
  });

  return (
    <html lang="vi">
      <body className={`${darkMode ? "bg-black text-white" : "bg-white text-black"} transition-colors`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="flex h-screen">
            <Sidebar />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </Box>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
