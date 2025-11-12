/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Chip } from "@mui/material";
import { paymentsApi } from "@/app/(private)/payments/api/paymentsApi";
import QRPayDialog from "@/app/(private)/payments/components/QRPayDialog";
import InvoiceDetailDialog from "@/app/(private)/payments/components/InvoiceDetailDialog";
import PayDialog from "@/app/(private)/payments/components/PayDialog";

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openInv, setOpenInv] = useState<any>(null);
  const [openPay, setOpenPay] = useState<any>(null);
  const [openQR, setOpenQR] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await paymentsApi.getInvoices();
        setInvoices(res);
      } catch (err) {
        console.error("Fetch invoices error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-gray-400 p-4">Đang tải...</div>;

  return (
    <div className="bg-neutral-900 p-4 rounded-xl text-white">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã hóa đơn</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell>Ngày</TableCell>
            <TableCell>Tổng</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.id}</TableCell>
              <TableCell>{inv.title}</TableCell>
              <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-cyan-400 font-bold">
                {inv.total.toLocaleString()}₫
              </TableCell>
              <TableCell>
                <Chip label={inv.status} color={inv.status === "PAID" ? "success" : "warning"} />
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => setOpenInv(inv)}>Chi tiết</Button>
                {inv.status !== "PAID" && (
                  <>
                    <Button variant="contained" size="small" onClick={() => setOpenPay(inv)} className="ml-2">Thanh toán</Button>
                    <Button variant="outlined" size="small" onClick={() => setOpenQR(inv)} className="ml-2">QR Pay</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InvoiceDetailDialog invoice={openInv} onClose={() => setOpenInv(null)} />
      <PayDialog invoice={openPay} onClose={() => setOpenPay(null)} onSuccess={() => paymentsApi.getInvoices().then(setInvoices)} />
      <QRPayDialog invoice={openQR} onClose={() => setOpenQR(null)} onPaid={() => { paymentsApi.getInvoices().then(setInvoices); }} />
    </div>
  );
}
