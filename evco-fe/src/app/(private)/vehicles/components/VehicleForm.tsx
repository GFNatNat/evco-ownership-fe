/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function VehicleForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    licensePlate: "",
    battery: "",
    mileage: "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log("Tạo xe mới:", form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Thêm xe mới</DialogTitle>
      <DialogContent className="space-y-4 mt-2">
        <TextField
          label="Tên xe"
          fullWidth
          name="name"
          onChange={handleChange}
        />
        <TextField
          label="Biển số"
          fullWidth
          name="licensePlate"
          onChange={handleChange}
        />
        <TextField
          label="Dung lượng pin (%)"
          fullWidth
          name="battery"
          type="number"
          onChange={handleChange}
        />
        <TextField
          label="Số km đã đi"
          fullWidth
          name="mileage"
          type="number"
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
