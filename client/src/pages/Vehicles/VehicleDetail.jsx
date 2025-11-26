import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosClient";
import { Box, Typography, Paper } from "@mui/material";

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
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
      <Typography variant="h5">{vehicle.name}</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography>Plate: {vehicle.plate}</Typography>
        <Typography>Model: {vehicle.model}</Typography>
        <Typography>Owner group: {vehicle.groupId || "N/A"}</Typography>
      </Paper>
    </Box>
  );
}
