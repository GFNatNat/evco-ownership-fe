/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { splitCost } from "../utils/splitCost";

const mockOwners = [
  { id: 1, name: "Nguyễn A", sharePercent: 40 },
  { id: 2, name: "Trần B", sharePercent: 30 },
  { id: 3, name: "Lê C", sharePercent: 30 },
];

export default function InvoiceDetailDialog({ invoice, onClose }: any) {
  if (!invoice) return null;
  const owners = mockOwners;
  const breakdown = splitCost(owners as any, invoice.total, invoice.splitMethod);

  return (
    <Dialog open={!!invoice} onClose={onClose} fullWidth>
      <DialogTitle>Chi tiết {invoice.id}</DialogTitle>
      <DialogContent>
        <Typography className="mb-3">{invoice.title}</Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Tổng</TableCell>
              <TableCell className="text-cyan-400 font-bold">{invoice.total.toLocaleString()}₫</TableCell>
            </TableRow>
            {breakdown.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.amount.toLocaleString()}₫</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
