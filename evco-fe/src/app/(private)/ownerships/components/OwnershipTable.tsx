"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const coOwners = [
  { id: 1, name: "Nguyễn A", email: "a@gmail.com", percent: 40, role: "Admin" },
  { id: 2, name: "Trần B", email: "b@gmail.com", percent: 30, role: "Member" },
  { id: 3, name: "Lê C", email: "c@gmail.com", percent: 30, role: "Member" },
];

export default function OwnershipTable() {
  return (
    <Table className="bg-neutral-900 text-white rounded-xl">
      <TableHead>
        <TableRow>
          <TableCell className="text-cyan-400">Tên</TableCell>
          <TableCell className="text-cyan-400">Email</TableCell>
          <TableCell className="text-cyan-400">Tỉ lệ sở hữu</TableCell>
          <TableCell className="text-cyan-400">Vai trò</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {coOwners.map((o) => (
          <TableRow key={o.id}>
            <TableCell>{o.name}</TableCell>
            <TableCell>{o.email}</TableCell>
            <TableCell>{o.percent}%</TableCell>
            <TableCell>
              <Chip
                label={o.role}
                color={o.role === "Admin" ? "primary" : "default"}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
