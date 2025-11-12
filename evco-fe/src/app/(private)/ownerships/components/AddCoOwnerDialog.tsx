/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export default function AddCoOwnerDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ email: "", percent: "", role: "Member" });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Mời đồng sở hữu:", form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Mời đồng sở hữu</DialogTitle>
      <DialogContent className="space-y-4 mt-2">
        <TextField
          label="Email người được mời"
          name="email"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          label="Tỉ lệ sở hữu (%)"
          name="percent"
          type="number"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          select
          label="Vai trò"
          name="role"
          fullWidth
          value={form.role}
          onChange={handleChange}
        >
          <MenuItem value="Member">Thành viên</MenuItem>
          <MenuItem value="Admin">Admin nhóm</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Gửi lời mời
        </Button>
      </DialogActions>
    </Dialog>
  );
}
