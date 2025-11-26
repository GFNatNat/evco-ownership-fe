import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import api from "../../api/axiosClient";
import AddIcon from "@mui/icons-material/Add";

export default function GroupCreate({ navigate }) {
  const [name, setName] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [members, setMembers] = useState([{ email: "", percent: 0 }]);

  const addMemberRow = () =>
    setMembers([...members, { email: "", percent: 0 }]);
  const updateMember = (idx, key, val) => {
    const m = [...members];
    m[idx][key] = val;
    setMembers(m);
  };
  const removeMember = (idx) => {
    const m = [...members];
    m.splice(idx, 1);
    setMembers(m);
  };

  const submit = async () => {
    // validate sum percentage
    const total = members.reduce((s, m) => s + Number(m.percent), 0);
    if (total !== 100) return alert("Tổng tỷ lệ phải bằng 100%");
    try {
      await api.post("/groups", { name, vehicleId, members });
      alert("Tạo nhóm thành công");
      window.location.href = "/groups";
    } catch (e) {
      alert("Tạo nhóm thất bại");
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">Tạo nhóm đồng sở hữu</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Tên nhóm"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Vehicle ID (optional)"
              fullWidth
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Thành viên & tỷ lệ sở hữu
            </Typography>
            {members.map((m, idx) => (
              <Grid
                container
                spacing={1}
                key={idx}
                sx={{ my: 1, alignItems: "center" }}
              >
                <Grid item xs={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={m.email}
                    onChange={(e) => updateMember(idx, "email", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="%"
                    type="number"
                    value={m.percent}
                    onChange={(e) =>
                      updateMember(idx, "percent", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <IconButton onClick={() => removeMember(idx)}>-</IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={addMemberRow}>
              Thêm thành viên
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={submit}>
              Tạo
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
