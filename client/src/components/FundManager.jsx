import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import api from "../api/axiosClient";

export default function FundManager({ group, onChange }) {
  const [amount, setAmount] = useState("");
  const deposit = async () => {
    if (!amount) return alert("Nhập số tiền");
    try {
      await api.post(`/groups/${group._id}/fund/deposit`, {
        amount: Number(amount),
      });
      setAmount("");
      onChange && onChange();
    } catch (e) {
      alert("Deposit failed");
    }
  };

  const requestWithdraw = async () => {
    const reason = prompt("Lý do rút tiền:");
    if (!reason) return;
    try {
      await api.post(`/groups/${group._1d}/fund/withdraw-requests`, {
        amount: Number(amount),
        reason,
      });
      alert("Đã gửi yêu cầu rút tiền");
      onChange && onChange();
    } catch (e) {
      alert("Withdraw request failed");
    }
  };

  return (
    <Box>
      <Typography>Số dư: {group.fund?.balance ?? 0} VND</Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <TextField
          label="Số tiền"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button variant="contained" onClick={deposit}>
          Nạp
        </Button>
        <Button variant="outlined" onClick={requestWithdraw}>
          Yêu cầu rút
        </Button>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle2">Lịch sử</Typography>
        {group.fund?.transactions?.length ? (
          group.fund.transactions.map((t) => (
            <div key={t._id}>
              {t.date} - {t.type} - {t.amount}
            </div>
          ))
        ) : (
          <div>Chưa có giao dịch</div>
        )}
      </Box>
    </Box>
  );
}
