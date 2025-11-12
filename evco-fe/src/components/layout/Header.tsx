"use client";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar className="flex justify-between">
        <Typography variant="h6" className="text-cyan-400 font-bold">
          EV Dashboard
        </Typography>
        <div className="flex items-center gap-4">
          <ThemeSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <Avatar alt="User" src="/avatar.png" />
          <IconButton color="inherit" onClick={() => alert("Logout clicked!")}>
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
