"use client";
import { Card, CardContent, Typography } from "@mui/material";

export default function AdminOverview() {
  const stats = [
    { label: "Tổng nhóm đồng sở hữu", value: 12 },
    { label: "Tổng số xe", value: 24 },
    { label: "Số hợp đồng đang hiệu lực", value: 18 },
    { label: "Check-in hôm nay", value: 9 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="bg-neutral-900 text-white">
          <CardContent>
            <Typography variant="body2" color="gray">
              {s.label}
            </Typography>
            <Typography variant="h4" className="text-cyan-400 font-bold">
              {s.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
