/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent, Typography, LinearProgress, Chip } from "@mui/material";
import Link from "next/link";

export default function VehicleCard({ vehicle }: { vehicle: any }) {
  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <Card className="bg-neutral-900 text-white hover:bg-neutral-800 transition-all cursor-pointer">
        <CardContent className="space-y-2">
          <Typography variant="h6" className="text-cyan-400">
            {vehicle.name}
          </Typography>
          <Typography variant="body2" color="gray">
            Biển số: {vehicle.licensePlate}
          </Typography>
          <Chip
            label={vehicle.status}
            color={vehicle.status === "Sẵn sàng" ? "success" : "warning"}
          />
          <div>
            <Typography variant="body2" color="gray">
              Pin còn lại
            </Typography>
            <LinearProgress
              variant="determinate"
              value={vehicle.battery}
              color="primary"
            />
          </div>
          <Typography variant="body2" color="gray">
            Số km: {vehicle.mileage.toLocaleString()} km
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
