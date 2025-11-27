import { useEffect, useState } from "react";
import { IconButton, Badge, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import notificationApi from "../../api/notificationApi";
import { formatDateTime } from "../../utils/formatter";

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);

  const open = Boolean(anchorEl);

  const load = async () => {
    const res = await notificationApi.mine();
    setItems(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge color="error" badgeContent={items.filter((i) => !i.read).length}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Typography variant="h6" className="px-4 py-2 font-semibold">
          Notifications
        </Typography>

        {items.length === 0 && (
          <MenuItem className="text-gray-500">No notifications</MenuItem>
        )}

        {items.map((n) => (
          <MenuItem key={n._id} className="flex flex-col items-start">
            <span className="font-medium">{n.title}</span>
            <span className="text-xs text-gray-500">
              {formatDateTime(n.createdAt)}
            </span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
