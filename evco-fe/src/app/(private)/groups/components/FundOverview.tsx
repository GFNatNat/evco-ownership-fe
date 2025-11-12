"use client";

import { Card, CardContent, Typography } from "@mui/material";

const mockFund = {
  total: 54000000,
  maintenance: 12000000,
  insurance: 8000000,
  reserve: 34000000,
};

export default function FundOverview({ groupId }: { groupId: number }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Quỹ nhóm #{groupId}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(mockFund).map(([k, v]) => (
          <Card key={k} className="bg-neutral-900 text-white">
            <CardContent>
              <Typography color="gray">{k}</Typography>
              <Typography variant="h6" className="text-cyan-400 font-bold">
                {v.toLocaleString()}₫
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
