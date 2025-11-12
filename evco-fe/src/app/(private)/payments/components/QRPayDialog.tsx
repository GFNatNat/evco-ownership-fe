/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { paymentsApi } from "@/app/(private)/payments/api/paymentsApi";

const QRCode = dynamic(() => import("qrcode.react").then(mod => mod.QRCodeSVG), { ssr: false });

export default function QRPayDialog({ invoice, onClose, onPaid }: any) {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invoice) return;
    setLoading(true);
    paymentsApi.getPaymentLink(invoice.id).then((r: any) => {
      setLink(r.link || r);
    }).catch(console.error).finally(() => setLoading(false));
  }, [invoice]);

  if (!invoice) return null;

  return (
    <Dialog open={!!invoice} onClose={onClose} fullWidth>
      <DialogTitle>Thanh toán bằng QR — {invoice.id}</DialogTitle>
      <DialogContent className="flex flex-col items-center gap-4 py-6">
        <Typography className="text-gray-300">Quét mã QR bằng ví để thanh toán</Typography>
        {link ? (
          <div className="bg-white p-4 rounded">
            <QRCode value={link} size={220} />
          </div>
        ) : (
          <Typography className="text-gray-500">Đang tạo mã...</Typography>
        )}

        <Typography className="text-sm text-gray-400 mt-2">Link: {link}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => { onPaid?.(); onClose?.(); }}>
          Tôi đã thanh toán (mock)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
