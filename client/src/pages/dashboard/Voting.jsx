import { useState, useEffect } from "react";
import voteApi from "../../api/voteApi";
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
} from "@mui/material";

export default function Voting() {
  const [votes, setVotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([""]);

  const load = async () => {
    const res = await voteApi.list();
    setVotes(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    await voteApi.create({ title, options });
    setOpen(false);
    setTitle("");
    setOptions([""]);
    load();
  };

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (idx, val) => {
    const arr = [...options];
    arr[idx] = val;
    setOptions(arr);
  };

  const castVote = async (voteId, option) => {
    await voteApi.cast(voteId, { option });
    load();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4">Voting</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Vote
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {votes.map((v) => (
          <Card key={v._id} className="shadow">
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {v.title}
              </Typography>
              <div className="mt-3 flex flex-col gap-2">
                {v.options.map((opt) => (
                  <Button
                    key={opt}
                    variant="outlined"
                    onClick={() => castVote(v._id, opt)}
                    className="text-left"
                  >
                    {opt} ({v.results?.[opt] || 0})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Voting</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {options.map((opt, idx) => (
            <TextField
              key={idx}
              label={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => updateOption(idx, e.target.value)}
            />
          ))}

          <Button onClick={addOption}>Add Option</Button>
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
