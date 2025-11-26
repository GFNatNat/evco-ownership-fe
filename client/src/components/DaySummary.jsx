import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

export function DaySummary({ date, vehicleId }) {
  const [slots, setSlots] = useState([]);
  useEffect(() => {
    if (!vehicleId) return;
    const from = dayjs(date).startOf("day").toISOString();
    const to = dayjs(date).endOf("day").toISOString();
    api
      .get(`/vehicles/${vehicleId}/availability?from=${from}&to=${to}`)
      .then((r) => setSlots(r.data))
      .catch(() => setSlots([]));
  }, [date, vehicleId]);

  if (!vehicleId) return <Typography variant="body2">Chưa chọn xe</Typography>;
  if (!slots.length)
    return <Typography variant="body2">Cả ngày trống</Typography>;

  return (
    <Box>
      {slots.map((s) => (
        <Box key={s._id} sx={{ mb: 0.5 }}>
          <Typography variant="body2">
            {dayjs(s.start).format("HH:mm")} - {dayjs(s.end).format("HH:mm")} —{" "}
            {s.user?.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
