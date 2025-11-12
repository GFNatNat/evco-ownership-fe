"use client";
import { Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";

const contracts = [
  {
    id: 1,
    group: "Nhóm Tesla",
    contractNo: "CT-2025-001",
    status: "Hiệu lực",
    expiry: "12/2025",
  },
  {
    id: 2,
    group: "VF8 Hà Nội",
    contractNo: "CT-2025-009",
    status: "Chờ ký",
    expiry: "—",
  },
];

export default function ContractTable() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">
        Hợp đồng điện tử
      </h3>
      <Table className="bg-neutral-900 text-white rounded-xl">
        <TableHead>
          <TableRow>
            <TableCell>Nhóm</TableCell>
            <TableCell>Số hợp đồng</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hết hạn</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.group}</TableCell>
              <TableCell>{c.contractNo}</TableCell>
              <TableCell>
                <Chip
                  label={c.status}
                  color={
                    c.status === "Hiệu lực"
                      ? "success"
                      : c.status === "Chờ ký"
                      ? "warning"
                      : "default"
                  }
                />
              </TableCell>
              <TableCell>{c.expiry}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
