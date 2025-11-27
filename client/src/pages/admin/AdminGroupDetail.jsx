import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function AdminGroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [newMember, setNewMember] = useState({ email: "" });
  const [fund, setFund] = useState(0);

  const load = async () => {
    try {
      const res = await adminApi.getGroup(id);
      setGroup(res.data);
      const f = await adminApi.getGroupFund(id);
      setFund(f.data.balance);
    } catch (err) {
      notifyError("Failed to load group");
    }
  };

  useEffect(() => load(), [id]);

  const addMember = async () => {
    try {
      await adminApi.addMember(id, newMember);
      notifySuccess("Member added");
      setOpenAdd(false);
      setNewMember({ email: "" });
      load();
    } catch (err) {
      notifyError("Failed to add member");
    }
  };

  const removeMember = async (userId) => {
    try {
      await adminApi.removeMember(id, userId);
      notifySuccess("Member removed");
      load();
    } catch (err) {
      notifyError("Remove failed");
    }
  };

  const updateFund = async () => {
    try {
      await adminApi.updateGroupFund(id, { amount: Number(fund) });
      notifySuccess("Fund updated");
      load();
    } catch (err) {
      notifyError("Fund update failed");
    }
  };

  if (!group) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Group: {group.name}
      </Typography>
      <Typography className="mb-3 text-gray-600">
        {group.description}
      </Typography>

      <Divider className="my-4" />
      <Typography variant="h6">Members</Typography>
      <Grid container spacing={2} className="mt-2">
        {group.members.map((m) => (
          <Grid item xs={12} md={4} key={m._id}>
            <Card className="shadow">
              <CardContent>
                <Typography>{m.name}</Typography>
                <Typography className="text-gray-500">{m.email}</Typography>
                <Button
                  className="mt-3"
                  color="error"
                  variant="outlined"
                  onClick={() => removeMember(m._id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        className="mt-4"
        onClick={() => setOpenAdd(true)}
      >
        Add Member
      </Button>

      <Divider className="my-6" />
      <Typography variant="h6">Group Fund</Typography>
      <div className="flex gap-3 mt-3 items-center">
        <TextField
          label="Balance"
          value={fund}
          onChange={(e) => setFund(e.target.value)}
        />
        <Button variant="contained" onClick={updateFund}>
          Update
        </Button>
      </div>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            value={newMember.email}
            onChange={(e) => setNewMember({ email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={addMember}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
