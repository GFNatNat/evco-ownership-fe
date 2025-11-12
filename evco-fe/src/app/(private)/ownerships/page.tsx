"use client";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OwnershipTable from "./components/OwnershipTable";
import { useState } from "react";
import AddCoOwnerDialog from "./components/AddCoOwnerDialog";

export default function OwnershipsPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">Đồng sở hữu</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Thêm thành viên
        </Button>
      </div>
      <OwnershipTable />
      <AddCoOwnerDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
