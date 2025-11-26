import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupIcon from "@mui/icons-material/Group";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const items = [
    { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/ownership", label: "Ownership", icon: <DirectionsCarIcon /> },
    { to: "/calendar", label: "Booking", icon: <CalendarMonthIcon /> },
    { to: "/expenses", label: "Costs", icon: <AccountBalanceWalletIcon /> },
    { to: "/groups", label: "Groups", icon: <GroupIcon /> },
  ];
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box", mt: 8 },
      }}
    >
      <Toolbar />
      <List>
        {items.map((i) => (
          <ListItemButton key={i.to} component={Link} to={i.to}>
            <ListItemIcon>{i.icon}</ListItemIcon>
            <ListItemText primary={i.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
