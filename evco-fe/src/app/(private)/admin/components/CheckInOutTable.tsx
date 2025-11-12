"use client";
import { Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";

const checkLogs = [
  { id: 1, vehicle: "Tesla Model 3", user: "Nguyễn A", type: "Check-in", time: "10:15 12/11" },
  { id: 2, vehicle: "VF8 Hà Nội", user: "Trần B", type: "Check-out", time: "09:45 12/11" },
];

export default function CheckInOutTable() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Check-in / Check-out hôm nay
      </h3>
      <Table className="bg-neutral-900 text-white rounded-xl">
        <TableHead>
          <TableRow>
            <TableCell>Xe</TableCell>
            <TableCell>Người dùng</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Thời gian</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checkLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.vehicle}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>
                <Chip
                  label={log.type}
                  color={log.type === "Check-in" ? "success" : "info"}
                />
              </TableCell>
              <TableCell>{log.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
