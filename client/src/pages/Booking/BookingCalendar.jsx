import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import BookingDialog from "../../components/BookingDialog";

export default function BookingCalendar() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState(null);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api
      .get("/vehicles")
      .then((r) => setVehicles(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!vehicleId) return;
    fetchDayBookings();
  }, [vehicleId, date]);

  const fetchDayBookings = async () => {
    const from = dayjs(date).startOf("day").toISOString();
    const to = dayjs(date).endOf("day").toISOString();
    const res = await api.get(
      `/vehicles/${vehicleId}/availability?from=${from}&to=${to}`
    );
    // assume backend returns array of bookings for the day
    setBookings(res.data);
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Lịch dùng xe</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography>Chọn xe</Typography>
            <Select
              fullWidth
              value={vehicleId || ""}
              onChange={(e) => setVehicleId(e.target.value)}
              sx={{ mt: 1 }}
            >
              <MenuItem value="">-- Chọn --</MenuItem>
              {vehicles.map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.name} ({v.plate})
                </MenuItem>
              ))}
            </Select>

            <Typography sx={{ mt: 2 }}>Ngày</Typography>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={!vehicleId}
              onClick={() => setOpen(true)}
            >
              Đặt lịch
            </Button>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Lịch hôm nay</Typography>
            {bookings.length ? (
              bookings.map((b) => (
                <Box key={b._id} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
                  <Typography>
                    {dayjs(b.start).format("HH:mm")} -{" "}
                    {dayjs(b.end).format("HH:mm")} — {b.user?.name}
                  </Typography>
                  <Typography variant="caption">{b.reason}</Typography>
                </Box>
              ))
            ) : (
              <Typography>Không có booking</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Lịch 7 ngày</Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {[...Array(7)].map((_, i) => {
                const d = dayjs(date).startOf("day").add(i, "day");
                return (
                  <Grid key={d.format("YYYY-MM-DD")} item xs={12} md={6}>
                    <Box sx={{ border: "1px solid #eee", p: 1 }}>
                      <Typography variant="subtitle2">
                        {d.format("ddd DD/MM")}
                      </Typography>
                      <DaySummary date={d} vehicleId={vehicleId} />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <BookingDialog
        open={open}
        onClose={() => {
          setOpen(false);
          fetchDayBookings();
        }}
        vehicleId={vehicleId}
        date={date}
      />
    </Box>
  );
}
