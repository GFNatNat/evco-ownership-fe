"use client";

import { Card, CardContent, Button, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import GroupDialog from "./GroupDialog";
import { useState } from "react";

const mockGroups = [
  { id: 1, name: "Nhóm Tesla Model 3", members: 3, balance: 54000000 },
  { id: 2, name: "Nhóm VF8 Hà Nội", members: 4, balance: 32200000 },
];

interface Props {
  onSelectGroup: (id: number) => void;
  selectedGroup: number | null;
}

export default function GroupList({ onSelectGroup, selectedGroup }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="text-cyan-400 font-semibold">
          Danh sách nhóm
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setOpenDialog(true)}
        >
          Tạo nhóm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockGroups.map((group) => (
          <Card
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`bg-neutral-900 cursor-pointer hover:ring-2 transition-all ${
              selectedGroup === group.id ? "ring-2 ring-cyan-400" : ""
            }`}
          >
            <CardContent>
              <Typography variant="h6" className="text-white">
                {group.name}
              </Typography>
              <Typography color="gray">
                Thành viên: {group.members}
              </Typography>
              <Typography className="text-cyan-400">
                Quỹ nhóm: {group.balance.toLocaleString()}₫
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <GroupDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </div>
  );
}
