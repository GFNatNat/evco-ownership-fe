import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import api from "../api/axiosClient";

export default function PaymentDialog({ open, onClose, groupId, cost }) {
  const [members, setMembers] = useState([]);
  const [amount, setAmount] = useState(cost?.amount || 0);
  const [payer, setPayer] = useState(null);
  const [method, setMethod] = useState("e-wallet");

  useEffect(() => {
    if (!groupId) return;
    api
      .get(`/groups/${groupId}`)
      .then((r) => setMembers(r.data.members))
      .catch(() => {});
    setAmount(cost?.amount || 0);
  }, [groupId, cost]);

  const create = async () => {
    try {
      const res = await api.post(`/groups/${groupId}/payments`, {
        costId: cost?._id,
        amount,
        payerId: payer,
        method,
      });
      // the backend may return a paymentUrl for redirect
      if (res.data.paymentUrl) window.location.href = res.data.paymentUrl;
      else {
        alert("Yêu cầu thanh toán đã tạo");
        onClose();
      }
    } catch (e) {
      alert("Tạo yêu cầu thất bại");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Tạo yêu cầu thanh toán</DialogTitle>
      <DialogContent>
        <InputLabel sx={{ mt: 1 }}>Người thanh toán</InputLabel>
        <Select
          fullWidth
          value={payer || ""}
          onChange={(e) => setPayer(e.target.value)}
        >
          <MenuItem value="">-- Chọn --</MenuItem>
          {members.map((m) => (
            <MenuItem key={m._id} value={m._id}>
              {m.name} ({m.percent}%)
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Số tiền"
          fullWidth
          sx={{ mt: 2 }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <InputLabel sx={{ mt: 2 }}>Phương thức</InputLabel>
        <Select
          fullWidth
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <MenuItem value="e-wallet">E-wallet</MenuItem>
          <MenuItem value="bank-transfer">Bank transfer</MenuItem>
          <MenuItem value="cash">Tiền mặt</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={create}>
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
