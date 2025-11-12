"use client";

import { Card, CardContent, Typography, Button, LinearProgress } from "@mui/material";

const mockVotes = [
  {
    id: 1,
    title: "Nâng cấp pin xe Tesla Model 3",
    agree: 2,
    total: 3,
    endDate: "15/11/2025",
  },
  {
    id: 2,
    title: "Gia hạn bảo hiểm VF8 Hà Nội",
    agree: 3,
    total: 4,
    endDate: "18/11/2025",
  },
];

export default function VotingSection({ groupId }: { groupId: number }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Bỏ phiếu / Quyết định chung
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {mockVotes.map((v) => {
          const percent = (v.agree / v.total) * 100;
          return (
            <Card key={v.id} className="bg-neutral-900 text-white">
              <CardContent>
                <Typography variant="h6">{v.title}</Typography>
                <Typography color="gray" className="text-sm">
                  Hạn: {v.endDate}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={percent}
                  className="my-3 bg-neutral-800"
                  color="primary"
                />
                <div className="flex justify-between items-center">
                  <Typography>{v.agree}/{v.total} phiếu đồng ý</Typography>
                  <Button variant="contained" color="primary" size="small">
                    Bỏ phiếu
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
