"use client";

import { Card, CardContent, Typography } from "@mui/material";

const mockVehicles = [
  { id: 1, name: "Tesla Model 3", plate: "30H-123.45", status: "Sẵn sàng" },
  { id: 2, name: "VinFast VF8", plate: "30G-999.99", status: "Đang sử dụng" },
];

export default function VehicleSelector({
  selectedVehicle,
  onSelect,
}: {
  selectedVehicle: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Chọn xe muốn đặt lịch
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockVehicles.map((v) => (
          <Card
            key={v.id}
            className={`bg-neutral-900 cursor-pointer hover:ring-2 transition-all ${
              selectedVehicle === v.id ? "ring-2 ring-cyan-400" : ""
            }`}
            onClick={() => onSelect(v.id)}
          >
            <CardContent>
              <Typography variant="h6" className="text-white">
                {v.name}
              </Typography>
              <Typography color="gray">{v.plate}</Typography>
              <Typography
                className={`font-medium ${
                  v.status === "Sẵn sàng" ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {v.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
