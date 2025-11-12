"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
} from "@mui/material";
import { Eye } from "lucide-react";

const groups = [
  { id: 1, name: "Nhóm Tesla", members: 3, vehicles: 2, status: "Hoạt động" },
  { id: 2, name: "Nhóm VF8 Hà Nội", members: 4, vehicles: 1, status: "Đang bảo trì" },
];

export default function GroupTable() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Nhóm đồng sở hữu
      </h3>
      <Table className="bg-neutral-900 text-white rounded-xl">
        <TableHead>
          <TableRow>
            <TableCell>Tên nhóm</TableCell>
            <TableCell>Thành viên</TableCell>
            <TableCell>Xe</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((g) => (
            <TableRow key={g.id}>
              <TableCell>{g.name}</TableCell>
              <TableCell>{g.members}</TableCell>
              <TableCell>{g.vehicles}</TableCell>
              <TableCell>
                <Chip
                  label={g.status}
                  color={g.status === "Hoạt động" ? "success" : "warning"}
                />
              </TableCell>
              <TableCell>
                <IconButton>
                  <Eye size={18} className="text-cyan-400" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
