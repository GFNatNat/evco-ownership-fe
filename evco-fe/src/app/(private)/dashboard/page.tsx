"use client";
import { Card, CardContent, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-neutral-900 text-white">
        <CardContent>
          <Typography variant="h6">Xe đang sử dụng</Typography>
          <Typography variant="h3" className="text-cyan-400">3</Typography>
        </CardContent>
      </Card>
      <Card className="bg-neutral-900 text-white">
        <CardContent>
          <Typography variant="h6">Tổng chi phí tháng này</Typography>
          <Typography variant="h3" className="text-cyan-400">12.5M₫</Typography>
        </CardContent>
      </Card>
      <Card className="bg-neutral-900 text-white">
        <CardContent>
          <Typography variant="h6">Số km trung bình / tháng</Typography>
          <Typography variant="h3" className="text-cyan-400">410 km</Typography>
        </CardContent>
      </Card>
    </div>
  );
}
