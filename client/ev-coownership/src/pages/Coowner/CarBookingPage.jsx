import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, TextField } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CarBookingPage() {
  const [events, setEvents] = useState([
    {
      title: "Người A sử dụng",
      start: new Date(2025, 1, 10, 9, 0),
      end: new Date(2025, 1, 10, 12, 0),
    },
  ]);

  const [form, setForm] = useState({ start: "", end: "", reason: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBooking = () => {
    if (!form.start || !form.end) return;

    setEvents([
      ...events,
      {
        title: form.reason || "Lịch đặt mới",
        start: new Date(form.start),
        end: new Date(form.end),
      },
    ]);

    setForm({ start: "", end: "", reason: "" });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Đặt lịch & Sử dụng xe
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Lịch xe
              </Typography>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "20px", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Tạo lịch đặt xe
              </Typography>

              <TextField
                label="Bắt đầu"
                type="datetime-local"
                name="start"
                fullWidth
                value={form.start}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Kết thúc"
                type="datetime-local"
                name="end"
                fullWidth
                value={form.end}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Lý do / mô tả"
                name="reason"
                fullWidth
                value={form.reason}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <Button variant="contained" fullWidth onClick={handleAddBooking}>
                Thêm lịch đặt
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
