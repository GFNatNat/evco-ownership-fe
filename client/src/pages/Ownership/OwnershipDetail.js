import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosClient";
import { Box, Typography, Paper, Grid } from "@mui/material";

export default function OwnershipDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/vehicles/${id}`)
      .then((r) => setVehicle(r.data))
      .catch(() => {});
  }, [id]);

  if (!vehicle)
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );

  return (
    <Box p={2}>
      <Typography variant="h4">{vehicle.name}</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Thông tin xe</Typography>
            <Typography>Biển số: {vehicle.plate}</Typography>
            <Typography>Model: {vehicle.model}</Typography>
            <Typography>Năm: {vehicle.year}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Tỷ lệ sở hữu</Typography>
            {vehicle.ownership?.map((o) => (
              <div key={o.userId}>
                {o.name} — {o.percent}%
              </div>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
