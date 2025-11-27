import { useEffect, useState } from "react";
import groupApi from "../../api/groupApi";
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
} from "@mui/material";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const load = async () => {
    const res = await groupApi.myGroups();
    setGroups(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      // Gọi API create vừa thêm
      await groupApi.create({ name: groupName });
      setOpen(false);
      setGroupName("");
      load(); // Load lại danh sách sau khi tạo
    } catch (error) {
      console.error("Failed to create group", error);
      // Bạn có thể thêm notification báo lỗi ở đây nếu muốn
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4">Groups</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <Card key={g._id} className="shadow">
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {g.name}
              </Typography>
              <Typography className="text-gray-600">
                Members: {g.members.length}
              </Typography>
              <Typography className="text-gray-600">
                Vehicle: {g.vehicle?.name || "N/A"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
