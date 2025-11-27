import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import voteApi from "../../api/voteApi";
import notificationApi from "../../api/notificationApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336"];

export default function VotingDetail() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await voteApi.get(id);
    setVote(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  const cast = async (option) => {
    await voteApi.cast(id, { option });
    // send notification to group
    try {
      await notificationApi.send({
        title: "New Vote",
        message: `A vote was cast for \"${option}\"`,
        recipients: vote.groupMembers.map((m) => m._id),
      });
    } catch (e) {
      console.warn("Notification failed", e);
    }
    await load();
  };

  if (loading || !vote) return <div className="p-6">Loading vote...</div>;

  const chartData = vote.options.map((opt) => ({
    name: opt,
    value: vote.results?.[opt] || 0,
  }));

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Vote: {vote.title}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardContent>
            <Typography variant="h6">Options</Typography>
            <List>
              {vote.options.map((opt) => (
                <ListItem
                  key={opt}
                  secondaryAction={
                    <Button onClick={() => cast(opt)}>Vote</Button>
                  }
                >
                  <ListItemText
                    primary={opt}
                    secondary={`Votes: ${vote.results?.[opt] || 0}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent style={{ height: 320 }}>
            <Typography variant="h6">Results</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
