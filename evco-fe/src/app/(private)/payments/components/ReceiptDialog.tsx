/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider,
} from "@mui/material";
import { paymentsApi } from "../api/paymentsApi";

export default function ReceiptDialog({ invoice, onClose }: any) {
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    if (invoice) {
      paymentsApi.getReceipt(invoice.id).then(setReceipt).catch(console.error);
    }
  }, [invoice]);

  if (!invoice) return null;

  return (
    <Dialog open={!!invoice} onClose={onClose} fullWidth>
      <DialogTitle>Biên lai thanh toán — {invoice.id}</DialogTitle>
      <DialogContent>
        {!receipt ? (
          <Typography className="text-gray-400">Đang tải biên lai...</Typography>
        ) : (
          <>
            <Typography>Tên người thanh toán: {receipt.payerName}</Typography>
            <Typography>Phương thức: {receipt.method}</Typography>
            <Typography>Số tiền: {receipt.amount.toLocaleString()}₫</Typography>
            <Typography>Ngày thanh toán: {new Date(receipt.date).toLocaleString()}</Typography>
            <Divider className="my-2" />
            <Typography variant="body2" className="text-gray-400">
              Mã giao dịch: {receipt.transactionId}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
