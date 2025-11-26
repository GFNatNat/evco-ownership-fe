import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { VehicleService } from "../../api";
import { Link } from "react-router-dom";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    VehicleService.list()
      .then((r) => setVehicles(r.data))
      .catch(() => {});
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4">Xe của nhóm</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {vehicles.map((v) => (
          <Grid key={v._id} item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{v.name}</Typography>
                <Typography variant="body2">Biển số: {v.plate}</Typography>
                <Typography variant="body2">Model: {v.model}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/ownership/${v._id}`}
                  size="small"
                >
                  Chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
