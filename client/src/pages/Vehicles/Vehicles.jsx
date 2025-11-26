import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import { Box, Typography, Grid } from "@mui/material";
import VehicleCard from "../../components/VehicleCard";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    api
      .get("/vehicles")
      .then((r) => setVehicles(r.data))
      .catch(() => {});
  }, []);
  return (
    <Box p={2}>
      <Typography variant="h5">Vehicles</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {vehicles.map((v) => (
          <Grid item key={v._id} xs={12} sm={6} md={4}>
            <VehicleCard vehicle={v} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
