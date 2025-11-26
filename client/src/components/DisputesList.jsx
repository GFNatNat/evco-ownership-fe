import React, { useEffect, useState } from "react";
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

export default function DisputesList({ groupId, onChange }) {
  const [disputes, setDisputes] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const fetch = async () => {
    const res = await api.get(`/groups/${groupId}/disputes`);
    setDisputes(res.data);
  };
  useEffect(() => {
    if (groupId) fetch();
  }, [groupId]);

  const create = async () => {
    await api.post(`/groups/${groupId}/disputes`, { title, details });
    setOpen(false);
    setTitle("");
    setDetails("");
    fetch();
    onChange && onChange();
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Báo cáo tranh chấp
      </Button>
      <List>
        {disputes.map((d) => (
          <ListItem key={d._id}>
            <ListItemText
              primary={d.title}
              secondary={`Trạng thái: ${d.status}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Báo cáo tranh chấp</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Chi tiết"
            fullWidth
            multiline
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={create}>
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
