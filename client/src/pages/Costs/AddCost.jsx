import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  InputLabel,
} from "@mui/material";

export default function AddCost({ groupId, onAdded }) {
  const [type, setType] = useState("charging");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [receipt, setReceipt] = useState(null);
  const [splitMethod, setSplitMethod] = useState("ownership"); // 'ownership' or 'usage'
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!groupId)
      return api
        .get(`/groups/${groupId}`)
        .then((r) => setMembers(r.data.members))
        .catch(() => {});
  }, [groupId]);

  const submit = async () => {
    if (!amount) return alert("Nhập số tiền");
    const fd = new FormData();
    fd.append("type", type);
    fd.append("amount", amount);
    fd.append("date", date);
    fd.append("splitMethod", splitMethod);
    if (receipt) fd.append("receipt", receipt);
    try {
      await api.post(`/groups/${groupId}/costs`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm chi phí thành công");
      onAdded && onAdded();
    } catch (e) {
      alert("Thêm thất bại");
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Thêm khoản chi</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <InputLabel>Loại</InputLabel>
            <Select
              fullWidth
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="charging">Phí sạc</MenuItem>
              <MenuItem value="maintenance">Bảo dưỡng</MenuItem>
              <MenuItem value="insurance">Bảo hiểm</MenuItem>
              <MenuItem value="registration">Đăng kiểm</MenuItem>
              <MenuItem value="cleaning">Vệ sinh</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Số tiền"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Ngày"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InputLabel>Chia theo</InputLabel>
            <Select
              fullWidth
              value={splitMethod}
              onChange={(e) => setSplitMethod(e.target.value)}
            >
              <MenuItem value="ownership">Theo tỷ lệ sở hữu</MenuItem>
              <MenuItem value="usage">Theo mức độ sử dụng (km/giờ)</MenuItem>
              <MenuItem value="manual">Thủ công</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} md={6}>
            <InputLabel>Biên nhận (receipt)</InputLabel>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceipt(e.target.files[0])}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={submit}>
              Thêm khoản chi
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
