"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GroupDialog({ open, onClose }: Props) {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    console.log("Tạo nhóm:", groupName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Tạo nhóm đồng sở hữu mới</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tên nhóm"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mt-3"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleCreate} variant="contained">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
