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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AuthContext } from "../../auth/AuthProvider";
import InviteMemberDialog from "../../components/InviteMemberDialog";
import FundManager from "../../components/FundManager";
import VotesList from "../../components/VotesList";
import DisputesList from "../../components/DisputesList";

export default function GroupDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [openInvite, setOpenInvite] = useState(false);

  const fetch = async () => {
    const res = await api.get(`/groups/${id}`);
    setGroup(res.data);
  };
  useEffect(() => {
    if (id) fetch();
  }, [id]);

  const changeRole = async (memberId, newRole) => {
    await api.put(`/groups/${id}/members/${memberId}/role`, { role: newRole });
    fetch();
  };

  const removeMember = async (memberId) => {
    if (!confirm("Xác nhận xóa thành viên?")) return;
    await api.delete(`/groups/${id}/members/${memberId}`);
    fetch();
  };

  if (!group)
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );

  const isAdmin = group.adminId === user?._id || user?.role === "Admin";

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
              <Typography variant="h6">Thành viên</Typography>
              <Box>
                {isAdmin && (
                  <Button
                    startIcon={<PersonAddIcon />}
                    onClick={() => setOpenInvite(true)}
                  >
                    Mời thành viên
                  </Button>
                )}
              </Box>
            </Box>

            <List>
              {group.members.map((m) => (
                <ListItem
                  key={m._id}
                  secondaryAction={
                    <Box>
                      {isAdmin && (
                        <IconButton
                          onClick={() =>
                            changeRole(
                              m._id,
                              m.role === "Co-owner" ? "Member" : "Co-owner"
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {isAdmin && (
                        <IconButton onClick={() => removeMember(m._id)}>
                          X
                        </IconButton>
                      )}
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${m.name} (${m.email})`}
                    secondary={`Role: ${m.role} • ${m.percent}%`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Quỹ chung</Typography>
            <FundManager group={group} onChange={fetch} />
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Báo cáo & Audit</Typography>
            <Button
              onClick={() => (window.location.href = `/groups/${id}/reports`)}
            >
              Xem báo cáo
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Hợp đồng</Typography>
            {group.contracts?.length ? (
              group.contracts.map((c) => (
                <div key={c._id}>
                  <a href={c.url} target="_blank">
                    {c.title}
                  </a>
                </div>
              ))
            ) : (
              <div>Chưa có</div>
            )}
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Bỏ phiếu</Typography>
            <VotesList groupId={id} onChange={fetch} />
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Tranh chấp / Khiếu nại</Typography>
            <DisputesList groupId={id} onChange={fetch} />
          </Paper>
        </Grid>
      </Grid>

      <InviteMemberDialog
        open={openInvite}
        onClose={() => {
          setOpenInvite(false);
          fetch();
        }}
        groupId={id}
      />
    </Box>
  );
}
