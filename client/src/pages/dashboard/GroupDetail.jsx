import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupApi from "../../api/groupApi";
import ownershipApi from "../../api/ownershipApi";
import costApi from "../../api/costApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState("");
  const [fundOpen, setFundOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState(0);

  const load = async () => {
    const res = await groupApi.details(id);
    setGroup(res.data);
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const handleAddMember = async () => {
    await groupApi.addMember(id, { email: emailToAdd });
    setOpenAdd(false);
    setEmailToAdd("");
    load();
  };

  const handleRemove = async (userId) => {
    await groupApi.removeMember(id, userId);
    load();
  };

  const handleTopUp = async () => {
    await groupApi.updateFund(id, { amount: fundAmount });
    setFundOpen(false);
    setFundAmount(0);
    load();
  };

  if (!group) return <div className="p-6">Loading group...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4">Group: {group.name}</Typography>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => setOpenAdd(true)}>
            Add Member
          </Button>
          <Button variant="contained" onClick={() => setFundOpen(true)}>
            Manage Fund
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardContent>
            <Typography variant="h6" className="mb-2">
              Members (Edit Ownership %)
            </Typography>
            <List>
              {group.members.map((m) => (
                <ListItem
                  key={m._id}
                  secondaryAction={
                    <Button size="small" onClick={() => handleRemove(m._id)}>
                      Remove
                    </Button>
                  }
                >
                  <ListItemText
                    primary={m.name}
                    secondary={`${m.email} • ${m.ownershipPercent}%`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider className="my-3" />
            <Typography variant="subtitle1" className="mb-2">
              Update Ownership Percentage
            </Typography>
            <div className="flex flex-col gap-2">
              {group.members.map((m, idx) => (
                <div key={m._id} className="flex items-center gap-3">
                  <Typography className="w-32">{m.name}</Typography>
                  <TextField
                    type="number"
                    value={m.ownershipPercent}
                    onChange={(e) => {
                      const updated = { ...group };
                      updated.members[idx].ownershipPercent = e.target.value;
                      setGroup(updated);
                    }}
                    size="small"
                  />
                </div>
              ))}
              <Button
                variant="contained"
                className="mt-3"
                onClick={async () => {
                  await ownershipApi.updatePercentages(id, {
                    members: group.members.map((m) => ({
                      userId: m._id,
                      ownershipPercent: Number(m.ownershipPercent),
                    })),
                  });
                  load();
                }}
              >
                Save Ownership Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <Typography variant="h6" className="mb-2">
              Group Fund
            </Typography>
            <Typography className="text-2xl font-bold">
              ${group.fund?.balance || 0}
            </Typography>
            <Typography className="text-sm text-gray-600 mt-2">
              Transactions
            </Typography>
            <List>
              {(group.fund?.history || []).map((t) => (
                <ListItem key={t._id}>
                  <ListItemText
                    primary={`${t.type}: $${t.amount}`}
                    secondary={new Date(t.date).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <Typography variant="h6" className="mb-2">
              Recent Costs
            </Typography>
            <List>
              {(group.recentCosts || []).map((c) => (
                <ListItem key={c._id}>
                  <ListItemText
                    primary={`${c.title} — $${c.amount}`}
                    secondary={new Date(c.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
            <Divider className="my-3" />
            <Typography variant="body2">
              Total Outstanding: ${group.outstanding || 0}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add Member to Group</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            label="Member Email"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMember}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={fundOpen} onClose={() => setFundOpen(false)}>
        <DialogTitle>Top-up Group Fund</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            label="Amount"
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFundOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTopUp}>
            Top-up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
