import { useState } from "react";
import {
  Drawer,
  Switch,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function AppSettings() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("vi");

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-white shadow"
      >
        <SettingsIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="w-72 p-6 flex flex-col gap-4">
          <Typography variant="h5" className="font-bold mb-2">
            App Settings
          </Typography>

          {/* Theme Mode */}
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
            label="Dark Mode"
          />

          {/* Language Switch */}
          <div className="flex flex-col gap-2">
            <Typography className="font-medium">Language</Typography>
            <select
              className="border p-2 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="vi">🇻🇳 Vietnamese</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </Drawer>
    </>
  );
}
