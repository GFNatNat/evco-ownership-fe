import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { Box, Paper, Typography, Button } from "@mui/material";
import dayjs from "dayjs";

export default function PaymentsHistory({ groupId }) {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    if (groupId) fetch();
  }, [groupId]);
  const fetch = async () => {
    const res = await api.get(`/groups/${groupId}/payments`);
    setPayments(res.data);
  };

  const markPaid = async (p) => {
    if (!confirm("Đánh dấu là đã thanh toán?")) return;
    await api.post(`/payments/${p._id}/mark-paid`, { method: "bank-transfer" });
    fetch();
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Lịch sử thanh toán</Typography>
      <Box sx={{ mt: 2 }}>
        {payments.map((p) => (
          <Paper key={p._id} sx={{ p: 2, mb: 1 }}>
            <Typography>
              {p.title || "Payment request"} — {p.amount} VND
            </Typography>
            <Typography variant="caption">
              Tạo: {dayjs(p.createdAt).format("DD/MM/YYYY")}
            </Typography>
            <Box sx={{ mt: 1 }}>
              {p.paymentUrl ? (
                <Button variant="contained" href={p.paymentUrl} target="_blank">
                  Thanh toán
                </Button>
              ) : (
                <Button variant="outlined" onClick={() => markPaid(p)}>
                  Đã thanh toán
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
