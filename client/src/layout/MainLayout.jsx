import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GlobalLoader from "../components/common/GlobalLoader";
import ErrorBoundary from "../components/common/ErrorBoundary";
import NotificationBell from "../components/common/NotificationBell";
import AppSettings from "../components/common/AppSettings";
import Footer from "../components/common/Footer";

const menu = [
  { label: "Dashboard", path: "/" },
  { label: "Groups", path: "/groups" },
  { label: "Account", path: "/account" },
];

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <ErrorBoundary>
      <GlobalLoader />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          className="w-60"
          PaperProps={{ className: "w-60 bg-white" }}
        >
          <div className="p-4 text-xl font-bold">EV Co-owner</div>
          <List>
            {menu.map((m) => (
              <ListItemButton
                key={m.path}
                component={Link}
                to={m.path}
                selected={pathname === m.path}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={m.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>

        {/* Content */}
        <div className="flex-1">
          <AppBar position="static" className="bg-white shadow text-gray-700">
            <Toolbar>
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
                <NotificationBell />
              </IconButton>
              <Typography variant="h6" className="ml-3 font-bold">
                Co-owner Portal
              </Typography>
            </Toolbar>
          </AppBar>

          <div className="p-6">
            <Outlet />
            <Footer />
            <AppSettings />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
