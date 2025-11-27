import { useState, useEffect } from "react";
import staffApi from "../../api/staffApi";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function StaffCheckinUI() {
  const [code, setCode] = useState("");
  const [history, setHistory] = useState([]);

  const load = async () => {
    try {
      const res = await staffApi.checkinHistory("all"); // depends on BE
      setHistory(res.data || []);
    } catch (err) {
      notifyError("Failed to load history");
    }
  };

  useEffect(() => load(), []);

  const handleCheckIn = async () => {
    try {
      await staffApi.checkin({ code });
      notifySuccess("Vehicle checked in");
      setCode("");
      load();
    } catch (err) {
      notifyError("Failed to check in");
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await staffApi.checkout({ id });
      notifySuccess("Vehicle checked out");
      load();
    } catch (err) {
      notifyError("Failed to check out");
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Staff Check-in / Check-out
      </Typography>

      <div className="flex gap-3 mb-5">
        <TextField
          label="QR / Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button variant="contained" onClick={handleCheckIn}>
          Check In
        </Button>
      </div>

      <Grid container spacing={3}>
        {history.map((h) => (
          <Grid item xs={12} md={4} key={h._id}>
            <Card className="shadow">
              <CardContent>
                <Typography variant="h6">{h.vehicleName}</Typography>
                <Typography className="text-gray-600">
                  User: {h.userName}
                </Typography>
                <Typography className="text-gray-600 mb-3">
                  Status: {h.status}
                </Typography>

                {h.status === "in" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCheckOut(h._id)}
                  >
                    Check Out
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
