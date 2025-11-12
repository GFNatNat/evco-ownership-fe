"use client";
import { useEffect, useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
import { paymentsApi } from "../api/paymentsApi";

interface PaymentRecord {
  id: string;
  invoiceId: string;
  payerName: string;
  amount: number;
  method: string;
  date: string;
}

export default function PaymentHistory() {
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await paymentsApi.getHistory();
        setRecords(data);
      } catch (e) {
        console.error("Load history error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Typography className="text-gray-400">Đang tải...</Typography>;

  return (
    <div className="bg-neutral-900 p-4 rounded-xl text-white mt-6">
      <Typography variant="h6" className="text-cyan-400 mb-3">
        Lịch sử thanh toán
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã giao dịch</TableCell>
            <TableCell>Hóa đơn</TableCell>
            <TableCell>Người thanh toán</TableCell>
            <TableCell>Phương thức</TableCell>
            <TableCell>Số tiền</TableCell>
            <TableCell>Ngày</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography className="text-gray-400 text-center">
                  Chưa có giao dịch nào.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.invoiceId}</TableCell>
                <TableCell>{r.payerName}</TableCell>
                <TableCell>{r.method}</TableCell>
                <TableCell className="text-cyan-400 font-bold">
                  {r.amount.toLocaleString()}₫
                </TableCell>
                <TableCell>{new Date(r.date).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
