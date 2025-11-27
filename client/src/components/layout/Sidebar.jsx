import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Schedule", path: "/schedule" },
  { label: "Costs", path: "/cost" },
  { label: "Groups", path: "/groups" },
  { label: "Voting", path: "/vote" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <Drawer variant="temporary" open={open} onClose={onClose}>
      <List className="w-64 p-4">
        {menu.map((item) => (
          <ListItemButton key={item.path} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
