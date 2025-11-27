import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import vehicleApi from "../../api/vehicleApi";
import { Card, CardContent, Typography } from "@mui/material";

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    vehicleApi.get(id).then((res) => setVehicle(res.data));
  }, [id]);

  if (!vehicle) return null;

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-xl mx-auto p-4">
        <CardContent className="flex flex-col gap-3">
          <Typography variant="h4" className="font-bold">
            {vehicle.name}
          </Typography>
          <Typography>Model: {vehicle.model}</Typography>
          <Typography>Plate: {vehicle.plate}</Typography>
          <Typography>Battery: {vehicle.battery}%</Typography>
        </CardContent>
      </Card>
    </div>
  );
}
