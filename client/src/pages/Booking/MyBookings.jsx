import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { Box, Paper, Typography, Button } from "@mui/material";
import dayjs from "dayjs";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const res = await api.get("/schedules/my");
    setBookings(res.data);
  };

  const cancel = async (id) => {
    if (!confirm("Xác nhận hủy booking?")) return;
    await api.delete(`/schedules/${id}`);
    fetch();
  };

  return (
    <Box p={2}>
      <Typography variant="h4">Booking của tôi</Typography>
      <Box sx={{ mt: 2 }}>
        {bookings.length ? (
          bookings.map((b) => (
            <Paper key={b._id} sx={{ p: 2, mb: 1 }}>
              <Typography>
                {dayjs(b.start).format("DD/MM/YYYY HH:mm")} -{" "}
                {dayjs(b.end).format("HH:mm")}
              </Typography>
              <Typography variant="body2">
                Xe: {b.vehicle?.name} — Lý do: {b.reason}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button variant="outlined" onClick={() => cancel(b._id)}>
                  Hủy
                </Button>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography>Không có booking</Typography>
        )}
      </Box>
    </Box>
  );
}
