/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  TextField, 
  Snackbar,
} from "@mui/material";
import { paymentsApi } from "../api/paymentsApi";

export default function PayDialog({ invoice, onClose, onSuccess }: any) {
  const [method, setMethod] = useState("wallet");
  const [amount, setAmount] = useState<number | "">("");
  const [openSnack, setOpenSnack] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!invoice) return null;

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) return alert("Nhập số tiền hợp lệ");
    setLoading(true);
    try {
      await paymentsApi.pay(invoice.id, 1, Number(amount), method); // giả định userId=1
      setOpenSnack(true);
      onSuccess?.();
      setTimeout(() => onClose(), 800);
    } catch (e) {
      console.error(e);
      alert("Lỗi thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={!!invoice} onClose={onClose} fullWidth>
        <DialogTitle>Thanh toán {invoice.id}</DialogTitle>
        <DialogContent className="space-y-3">
          <Typography>
            Tổng: <span className="text-cyan-400 font-bold">{invoice.total.toLocaleString()}₫</span>
          </Typography>

          <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
            <FormControlLabel value="wallet" control={<Radio />} label="Ví điện tử" />
            <FormControlLabel value="bank" control={<Radio />} label="Chuyển khoản ngân hàng" />
            <FormControlLabel value="card" control={<Radio />} label="Thẻ tín dụng/ghi nợ" />
          </RadioGroup>

          <TextField
            label="Số tiền thanh toán"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            helperText="Nhập phần bạn muốn thanh toán (VD: 12,600,000)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handlePay} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => setOpenSnack(false)}
        message="Thanh toán thành công!"
      />
    </>
  );
}
