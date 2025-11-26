import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosClient";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { AuthContext } from "../auth/AuthProvider";

export default function VotesList({ groupId, onChange }) {
  const [votes, setVotes] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(AuthContext);

  const fetch = async () => {
    const res = await api.get(`/groups/${groupId}/votes`);
    setVotes(res.data);
  };
  useEffect(() => {
    if (groupId) fetch();
  }, [groupId]);

  const create = async () => {
    await api.post(`/groups/${groupId}/votes`, { title, description });
    setOpenCreate(false);
    setTitle("");
    setDescription("");
    fetch();
    onChange && onChange();
  };

  const cast = async (voteId, option) => {
    await api.post(`/groups/${groupId}/votes/${voteId}/vote`, { option });
    fetch();
    onChange && onChange();
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpenCreate(true)}>
        Tạo bỏ phiếu
      </Button>
      <List>
        {votes.map((v) => (
          <ListItem key={v._id}>
            <ListItemText
              primary={v.title}
              secondary={`Trạng thái: ${v.status}`}
            />
            {v.status === "open" && (
              <Button onClick={() => cast(v._id, "yes")}>Vote Yes</Button>
            )}
            {v.status === "open" && (
              <Button onClick={() => cast(v._id, "no")}>Vote No</Button>
            )}
            <Button onClick={() => alert(JSON.stringify(v.results || {}))}>
              Kết quả
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Tạo cuộc bỏ phiếu</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button variant="contained" onClick={create}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
