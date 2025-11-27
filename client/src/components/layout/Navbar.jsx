import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ onToggleSidebar }) {
  return (
    <AppBar position="fixed" elevation={1} color="inherit">
      <Toolbar className="flex justify-between">
        <IconButton onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className="font-bold">
          EV Co-ownership System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
