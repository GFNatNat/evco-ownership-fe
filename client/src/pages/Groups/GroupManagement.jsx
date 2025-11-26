import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosClient";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VoteModal from "../../components/VoteModal";
import ContractUploader from "../../components/ContractUploader";

export default function GroupManagement() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [newMember, setNewMember] = useState({ email: "", percent: 0 });
  const [editIdx, setEditIdx] = useState(null);
  const [editPercent, setEditPercent] = useState(0);

  const fetch = async () => {
    const res = await api.get(`/groups/${id}`);
    setGroup(res.data);
  };

  useEffect(() => {
    if (id) fetch();
  }, [id]);

  const removeMember = async (memberId) => {
    if (!confirm("Xác nhận xóa thành viên?")) return;
    await api.delete(`/groups/${id}/members/${memberId}`);
    fetch();
  };

  const saveEdit = async (memberId) => {
    // update single member percent
    await api.put(`/groups/${id}/members/${memberId}`, {
      percent: Number(editPercent),
    });
    setEditIdx(null);
    fetch();
  };

  const addMember = async () => {
    await api.post(`/groups/${id}/members`, {
      email: newMember.email,
      percent: Number(newMember.percent),
    });
    setOpenAdd(false);
    setNewMember({ email: "", percent: 0 });
    fetch();
  };

  if (!group)
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );

  return (
    <Box p={2}>
      <Typography variant="h4">Nhóm: {group.name}</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Thành viên & Tỷ lệ sở hữu</Typography>
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAdd(true)}
                >
                  Thêm thành viên
                </Button>
                <Button
                  startIcon={<UploadFileIcon />}
                  sx={{ ml: 1 }}
                  onClick={() => {
                    /* open contract dialog */
                  }}
                >
                  Upload hợp đồng
                </Button>
              </Box>
            </Box>

            <List>
              {group.members.map((m) => (
                <ListItem
                  key={m._id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        onClick={() => {
                          setEditIdx(m._id);
                          setEditPercent(m.percent);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => removeMember(m._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${m.name} (${m.email})`}
                    secondary={`Tỷ lệ: ${m.percent}%`}
                  />
                  {editIdx === m._id && (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField
                        size="small"
                        type="number"
                        value={editPercent}
                        onChange={(e) => setEditPercent(e.target.value)}
                        sx={{ width: 100 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => saveEdit(m._id)}
                      >
                        Lưu
                      </Button>
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>

            <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
              <DialogTitle>Thêm thành viên</DialogTitle>
              <DialogContent>
                <TextField
                  label="Email"
                  fullWidth
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Tỷ lệ (%)"
                  type="number"
                  fullWidth
                  value={newMember.percent}
                  onChange={(e) =>
                    setNewMember({ ...newMember, percent: e.target.value })
                  }
                  sx={{ mt: 1 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenAdd(false)}>Hủy</Button>
                <Button onClick={addMember} variant="contained">
                  Thêm
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Quỹ chung</Typography>
            <Typography sx={{ mt: 1 }}>
              Số dư: {group.fund?.balance ?? 0} VND
            </Typography>
            <Box sx={{ mt: 1 }}>
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
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Hợp đồng</Typography>
            <ContractUploader groupId={id} onUploaded={fetch} />
            <Box sx={{ mt: 1 }}>
              {group.contracts?.length ? (
                group.contracts.map((c) => (
                  <div key={c._id}>
                    <a href={c.url} target="_blank">
                      {c.title || "Contract"}
                    </a>
                  </div>
                ))
              ) : (
                <div>Chưa có hợp đồng</div>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Bỏ phiếu / Quyết định</Typography>
            <VoteModal groupId={id} onChange={fetch} />
            <Box sx={{ mt: 1 }}>
              {group.votes?.length ? (
                group.votes.map((v) => (
                  <div key={v._id}>
                    {v.title} - {v.status}
                  </div>
                ))
              ) : (
                <div>Chưa có cuộc bỏ phiếu</div>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
