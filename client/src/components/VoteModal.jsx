import React, { useState, useEffect } from "react";
import api from "../api/axiosClient";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

export default function VoteModal({ groupId, onChange }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const create = async () => {
    if (!title) return alert("Nhập tiêu đề");
    await api.post(`/groups/${groupId}/votes`, { title, description });
    setOpen(false);
    setTitle("");
    setDescription("");
    onChange && onChange();
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Tạo cuộc bỏ phiếu
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Tạo bỏ phiếu</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={create}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
