/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import { paymentApi } from '@/api/paymentApi';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function CostsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { (async()=>{ const r = await paymentApi.history(); setRows(r.data||[]); })(); }, []);

  const cols: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 160 },
    { field: 'type', headerName: 'Loại chi phí', width: 200 },
    { field: 'amount', headerName: 'Số tiền', width: 140 },
    { field: 'period', headerName: 'Kỳ', width: 140 },
    { field: 'status', headerName: 'Trạng thái', width: 140 },
  ];

  return (
    <>
      <Topbar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-3">Chi phí & thanh toán</h3>
          <div style={{ height: 520 }}><DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id} /></div>
          <div className="mt-4">
            <Button variant="contained">Thanh toán trực tuyến</Button>
          </div>
        </main>
      </div>
    </>
  );
}
