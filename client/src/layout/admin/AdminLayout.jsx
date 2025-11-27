import { Outlet, Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const menuItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Vehicles", path: "/admin/vehicles" },
  { label: "Contracts", path: "/admin/contracts" },
  { label: "Disputes", path: "/admin/disputes" },
  { label: "Finance Reports", path: "/admin/reports" },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={open}
        onClose={() => setOpen(false)}
        className="w-64"
        PaperProps={{ className: "w-64 bg-white" }}
      >
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1">
        <AppBar position="static" className="bg-white shadow text-gray-700">
          <Toolbar>
            <IconButton onClick={() => setOpen(!open)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className="ml-3 font-bold">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
