"use client";

import { useState } from "react";
import VehicleSelector from "./components/VehicleSelector";
import CalendarView from "./components/CalendarView";
import BookingDialog from "./components/BookingDialog";

export default function BookingPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-cyan-400">Đặt lịch sử dụng xe</h2>

      <VehicleSelector
        selectedVehicle={selectedVehicle}
        onSelect={setSelectedVehicle}
      />

      {selectedVehicle && (
        <CalendarView
          vehicleId={selectedVehicle}
          onSelectSlot={setSelectedSlot}
        />
      )}

      <BookingDialog
        open={!!selectedSlot}
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        vehicleId={selectedVehicle}
      />
    </div>
  );
}
