"use client";
import VehicleList from "./components/VehicleList";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import VehicleForm from "./components/VehicleForm";

export default function VehiclesPage() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyan-400">Quản lý xe</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Thêm xe
        </Button>
      </div>
      <VehicleList />
      <VehicleForm open={openForm} onClose={() => setOpenForm(false)} />
    </div>
  );
}
