import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function AdminDisputeResolve() {
  const { id } = useParams();
  const [dispute, setDispute] = useState(null);
  const [result, setResult] = useState("");

  const load = async () => {
    try {
      const res = await adminApi.getDispute(id);
      setDispute(res.data);
    } catch {
      notifyError("Failed to load dispute");
    }
  };

  useEffect(() => load(), [id]);

  const resolve = async () => {
    try {
      await adminApi.resolveDispute(id, { resolution: result });
      notifySuccess("Dispute resolved");
      load();
    } catch {
      notifyError("Resolve failed");
    }
  };

  if (!dispute) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Resolve Dispute
      </Typography>

      <Card className="shadow p-4">
        <CardContent>
          <Typography variant="h6">{dispute.title}</Typography>
          <Typography className="text-gray-600 mb-3">
            Status: {dispute.status}
          </Typography>

          <Typography className="font-semibold">Details</Typography>
          <pre className="bg-gray-50 p-3 mb-4 rounded text-sm max-h-80 overflow-auto">
            {dispute.description}
          </pre>

          <Typography className="font-semibold mb-2">Resolution</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />

          {dispute.status !== "resolved" && (
            <Button className="mt-4" variant="contained" onClick={resolve}>
              Resolve
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
