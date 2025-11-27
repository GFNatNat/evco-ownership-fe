import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function AdminGroupManagement() {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = async () => {
    try {
      const res = await adminApi.usage(); // placeholder for group list (depends on BE)
      setGroups(res.data.groups || []);
    } catch (err) {
      notifyError("Failed to load groups");
    }
  };

  useEffect(() => load(), []);

  const submit = async () => {
    try {
      await adminApi.createGroup(form);
      notifySuccess("Group created successfully");
      setOpen(false);
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      notifyError("Failed to create group");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <Typography variant="h4">Admin Group Management</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Group
        </Button>
      </div>

      <Grid container spacing={3}>
        {groups.map((g) => (
          <Grid item xs={12} md={4} key={g._id}>
            <Card className="shadow">
              <CardContent>
                <Typography variant="h6">{g.name}</Typography>
                <Typography className="text-gray-600 mb-3">
                  {g.description}
                </Typography>
                <Button variant="outlined" href={`/admin/groups/${g._id}`}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
