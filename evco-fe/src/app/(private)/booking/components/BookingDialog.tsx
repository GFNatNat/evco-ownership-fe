"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default function BookingDialog({
  open,
  onClose,
  slot,
  vehicleId,
}: {
  open: boolean;
  onClose: () => void;
  slot: any;
  vehicleId: number | null;
}) {
  if (!slot) return null;

  const handleConfirm = () => {
    console.log("Xác nhận đặt xe:", {
      vehicleId,
      start: slot.startStr,
      end: slot.endStr,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Xác nhận đặt lịch xe #{vehicleId}</DialogTitle>
      <DialogContent>
        <Typography>
          Bắt đầu:{" "}
          <span className="text-cyan-400">
            {dayjs(slot.start).format("HH:mm DD/MM/YYYY")}
          </span>
        </Typography>
        <Typography>
          Kết thúc:{" "}
          <span className="text-cyan-400">
            {dayjs(slot.end).format("HH:mm DD/MM/YYYY")}
          </span>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleConfirm}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
