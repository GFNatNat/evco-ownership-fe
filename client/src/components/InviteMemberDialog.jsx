import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import api from "../api/axiosClient";

export default function InviteMemberDialog({ open, onClose, groupId }) {
  const [email, setEmail] = useState("");
  const [percent, setPercent] = useState(0);
  const [role, setRole] = useState("Co-owner");

  const invite = async () => {
    if (!email) return alert("Nhập email");
    try {
      await api.post(`/groups/${groupId}/invites`, {
        email,
        percent: Number(percent),
        role,
      });
      alert("Đã gửi lời mời");
      onClose();
    } catch (e) {
      alert("Gửi lời mời thất bại");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Mời thành viên</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          label="Tỷ lệ (%)"
          type="number"
          fullWidth
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          sx={{ mt: 1 }}
        />
        <InputLabel sx={{ mt: 1 }}>Role</InputLabel>
        <Select
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="Co-owner">Co-owner</MenuItem>
          <MenuItem value="Member">Member</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={invite}>
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
