/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button } from "@mui/material";
import MemberPermissionsDialog from "./MemberPermissionsDialog";
import { Trash2, Edit2 } from "lucide-react";

const mockGroup = {
  id: 1,
  name: "Nhóm Tesla",
  members: [
    { id: 1, name: "Nguyễn A", role: "Admin", share: 40 },
    { id: 2, name: "Trần B", role: "Member", share: 30 },
    { id: 3, name: "Lê C", role: "Member", share: 30 },
  ],
};

export default function GroupManagementAdvanced({ groupId }: { groupId?: number }) {
  const [group, setGroup] = useState<any>(mockGroup);
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  function handleSaveMember(updated: any) {
    setGroup((g: any) => ({ ...g, members: g.members.map((m: any) => (m.id === updated.id ? updated : m)) }));
  }

  function handleRemove(id: number) {
    if (!confirm('Xác nhận xoá thành viên?')) return;
    setGroup((g: any) => ({ ...g, members: g.members.filter((m: any) => m.id !== id) }));
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="text-cyan-400">Quản lý nhóm nâng cao</Typography>
        <div>
          <Button variant="outlined">Mời thành viên</Button>
        </div>
      </div>

      <Card className="bg-neutral-900 text-white mt-3">
        <CardContent>
          <Typography className="mb-3">{group.name}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Họ tên</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Tỉ lệ</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.members.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.role}</TableCell>
                  <TableCell>{m.share}%</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setEditing(m); setOpen(true); }}><Edit2 /></IconButton>
                    <IconButton onClick={() => handleRemove(m.id)} className="text-red-400"><Trash2 /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MemberPermissionsDialog open={open} onClose={() => setOpen(false)} member={editing} onSave={handleSaveMember} />
    </div>
  );
}
