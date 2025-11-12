/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

export default function MemberPermissionsDialog({ open, onClose, member, onSave }: any) {
  const [role, setRole] = useState(member?.role || "Member");
  const [share, setShare] = useState(member?.share || 0);

  useEffect(() => {
    setRole(member?.role || "Member");
    setShare(member?.share || 0);
  }, [member]);

  function handleSave() {
    onSave({ ...member, role, share: Number(share) });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Chỉnh sửa thành viên</DialogTitle>
      <DialogContent className="space-y-3">
        <TextField label="Họ tên" value={member?.name || ""} fullWidth disabled />
        <TextField select label="Vai trò" value={role} onChange={(e) => setRole(e.target.value)} fullWidth>
          <MenuItem value="Member">Thành viên</MenuItem>
          <MenuItem value="Admin">Admin nhóm</MenuItem>
        </TextField>
        <TextField label="Tỉ lệ sở hữu (%)" type="number" value={share} onChange={(e) => setShare(e.target.value)} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSave}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}
