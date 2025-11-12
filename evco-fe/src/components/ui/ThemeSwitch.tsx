"use client";
import { Switch } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function ThemeSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {checked ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
      <Switch checked={checked} onChange={onChange} color="default" />
    </div>
  );
}
