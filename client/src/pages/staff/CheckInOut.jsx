import { useState, useEffect } from "react";
import checkinApi from "../../api/checkinApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export default function CheckInOut() {
  const [items, setItems] = useState([]);
  const [code, setCode] = useState("");

  const load = async () => {
    const res = await checkinApi.pending();
    setItems(res.data);
  };

  useEffect(() => load(), []);

  const checkIn = async () => {
    await checkinApi.checkin({ code });
    setCode("");
    load();
  };

  const checkOut = async (id) => {
    await checkinApi.checkout(id);
    load();
  };

  return (
    <div className="p-6">
      <Typography variant="h4">Vehicle Check-in / Check-out</Typography>

      <div className="flex gap-3 mt-4">
        <TextField
          label="QR / Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button variant="contained" onClick={checkIn}>
          Check In
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((i) => (
          <Card key={i._id} className="shadow">
            <CardContent>
              <Typography variant="h6">{i.vehicleName}</Typography>
              <Typography>Owner: {i.ownerName}</Typography>
              <Typography>Status: Awaiting return</Typography>
              <Button
                className="mt-3"
                variant="contained"
                onClick={() => checkOut(i._id)}
              >
                Check Out
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
