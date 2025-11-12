"use client";
import { Card, CardContent, Typography } from "@mui/material";

export default function FinanceSummary() {
  const data = [
    { label: "Tổng doanh thu tháng", value: "128.500.000₫" },
    { label: "Chi phí vận hành", value: "54.000.000₫" },
    { label: "Lợi nhuận ròng", value: "74.500.000₫" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Tóm tắt tài chính
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.map((d) => (
          <Card key={d.label} className="bg-neutral-900 text-white">
            <CardContent>
              <Typography variant="body2" color="gray">
                {d.label}
              </Typography>
              <Typography variant="h5" className="text-cyan-400 font-bold">
                {d.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
