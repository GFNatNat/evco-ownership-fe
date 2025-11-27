import { useEffect, useState } from "react";
import scheduleApi from "../../api/scheduleApi";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export default function Schedule() {
  const [calendar, setCalendar] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    scheduleApi.mySchedule().then((res) => setCalendar(res.data));
  }, []);

  const handleBook = async () => {
    await scheduleApi.book({ startTime: start, endTime: end });
    const updated = await scheduleApi.mySchedule();
    setCalendar(updated.data);
  };

  return (
    <div className="p-4">
      <Typography variant="h4">My Schedule</Typography>

      <div className="flex gap-4 mt-4">
        <TextField
          label="Start Time"
          type="datetime-local"
          onChange={(e) => setStart(e.target.value)}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          onChange={(e) => setEnd(e.target.value)}
        />
        <Button variant="contained" onClick={handleBook}>
          Book
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {calendar.map((item) => (
          <Card key={item._id} className="shadow">
            <CardContent>
              <Typography variant="h6">{item.vehicleName}</Typography>
              <Typography className="text-gray-600">
                {item.startTime} → {item.endTime}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
