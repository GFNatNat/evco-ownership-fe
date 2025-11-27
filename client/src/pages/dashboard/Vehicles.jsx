import { useEffect, useState } from "react";
import vehicleApi from "../../api/vehicleApi";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    vehicleApi.all().then((res) => setVehicles(res.data));
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-6">
        Vehicles
      </Typography>

      <Grid container spacing={3}>
        {vehicles.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <Card className="shadow-lg">
              <CardContent>
                <Typography variant="h6" className="font-bold">
                  {v.name}
                </Typography>
                <Typography className="text-gray-600">
                  Model: {v.model}
                </Typography>
                <Typography className="text-gray-600">
                  Plate: {v.plate}
                </Typography>
                <Button
                  component={Link}
                  to={`/vehicles/${v._id}`}
                  variant="contained"
                  className="mt-4"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
