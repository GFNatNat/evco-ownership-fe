"use client";
import { Card, CardContent, Typography } from "@mui/material";

export default function OverviewCards() {
  const stats = [
    { label: "Tổng chi phí (tháng)", value: "82.400.000₫" },
    { label: "Chi phí trung bình/người", value: "20.600.000₫" },
    { label: "Số lần sử dụng (tháng)", value: 42 },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="bg-neutral-900 text-white">
          <CardContent>
            <Typography color="gray">{s.label}</Typography>
            <Typography variant="h5" className="text-cyan-400 font-bold">
              {s.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
