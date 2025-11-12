"use client";

import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

const mockMembers = [
  { id: 1, name: "Nguyễn Văn A", role: "Admin nhóm", share: "40%" },
  { id: 2, name: "Trần Thị B", role: "Thành viên", share: "30%" },
  { id: 3, name: "Lê Văn C", role: "Thành viên", share: "30%" },
];

export default function MemberTable({ groupId }: { groupId: number }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Thành viên nhóm #{groupId}
      </h3>
      <Table className="bg-neutral-900 text-white rounded-xl">
        <TableHead>
          <TableRow>
            <TableCell>Họ tên</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Tỉ lệ sở hữu</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockMembers.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.role}</TableCell>
              <TableCell>{m.share}</TableCell>
              <TableCell>
                <Button variant="outlined" size="small">
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
