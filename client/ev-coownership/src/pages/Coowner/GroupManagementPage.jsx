import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function GroupManagementPage() {
  const [members, setMembers] = useState([
    { name: "A", ownership: 40 },
    { name: "B", ownership: 30 },
    { name: "C", ownership: 30 },
  ]);

  const [fund, setFund] = useState(5200000);
  const [transactions] = useState([
    { title: "Bảo dưỡng", amount: -800000 },
    { title: "Đóng góp thêm", amount: 1000000 },
  ]);

  const [newMember, setNewMember] = useState({ name: "", ownership: "" });
  const [dialog, setDialog] = useState(false);

  const handleAdd = () => {
    if (!newMember.name || !newMember.ownership) return;
    setMembers([...members, { name: newMember.name, ownership: Number(newMember.ownership) }]);
    setNewMember({ name: "", ownership: "" });
    setDialog(false);
  };

  const handleRemove = (name) => {
    setMembers(members.filter((m) => m.name !== name));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Quản lý nhóm đồng sở hữu
      </Typography>

      <Grid container spacing={3}>
        {/* Members */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2} fontWeight={700}>
                Thành viên nhóm
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Tỉ lệ sở hữu</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.name}>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>{m.ownership}%</TableCell>
                      <TableCell>
                        <Button color="error" onClick={() => handleRemove(m.name)}>
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setDialog(true)}>
                Thêm thành viên
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fund */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={1}>
                Quỹ chung
              </Typography>
              <Typography variant="h4" fontWeight={700} color="green">
                {fund.toLocaleString()}₫
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Lịch sử giao dịch
              </Typography>

              {transactions.map((t, i) => (
                <Typography key={i}>
                  {t.title}: <strong>{t.amount.toLocaleString()}₫</strong>
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Member Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)}>
        <DialogTitle>Thêm thành viên mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            fullWidth
            sx={{ mb: 2 }}
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />
          <TextField
            label="Tỉ lệ sở hữu (%)"
            fullWidth
            value={newMember.ownership}
            onChange={(e) => setNewMember({ ...newMember, ownership: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleAdd}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
