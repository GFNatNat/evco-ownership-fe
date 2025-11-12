/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const mockEvents = [
  { title: "Nguyễn A sử dụng", start: "2025-11-12T08:00", end: "2025-11-12T12:00" },
  { title: "Trần B bảo dưỡng", start: "2025-11-13T09:00", end: "2025-11-13T15:00" },
];

export default function CalendarView({
  vehicleId,
  onSelectSlot,
}: {
  vehicleId: number;
  onSelectSlot: (slot: any) => void;
}) {
  const calendarRef = useRef(null);

  useEffect(() => {
    console.log("Xe được chọn:", vehicleId);
  }, [vehicleId]);

  return (
    <div className="bg-neutral-900 p-4 rounded-xl text-white">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        selectMirror={true}
        allDaySlot={false}
        height="auto"
        events={mockEvents}
        select={(info) => onSelectSlot(info)}
        eventColor="#06b6d4"
        eventTextColor="#fff"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
      />
    </div>
  );
}
