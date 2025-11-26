import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import api from "../api/axiosClient";
import dayjs from "dayjs";

export default function BookingDialog({ open, onClose, vehicleId, date }) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // reset
    setStartTime("09:00");
    setEndTime("10:00");
    setReason("");
  }, [open]);

  const create = async () => {
    if (!vehicleId) return alert("Chọn xe trước");
    const start = dayjs(`${date}T${startTime}`).toISOString();
    const end = dayjs(`${date}T${endTime}`).toISOString();
    if (dayjs(end).isBefore(dayjs(start)))
      return alert("Thời gian kết thúc phải sau bắt đầu");

    try {
      setChecking(true);
      const check = await api.post("/schedules/priority-check", {
        vehicleId,
        start,
        end,
      });
      if (!check.data.allowed) {
        alert(check.data.reason || "Không thể đặt lịch");
        setChecking(false);
        return;
      }
      // create booking
      await api.post("/schedules/book", { vehicleId, start, end, reason });
      alert("Đặt lịch thành công");
      onClose();
    } catch (e) {
      alert(e?.response?.data?.message || "Lỗi khi đặt lịch");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Đặt lịch sử dụng xe</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">Xe: {vehicleId || "---"}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <TextField
            label="Bắt đầu"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Kết thúc"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          label="Mục đích"
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 2 }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={create} disabled={checking}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
