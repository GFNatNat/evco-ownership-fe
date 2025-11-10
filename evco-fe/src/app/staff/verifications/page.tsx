/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import { adminApi } from '@/api/adminApi';
import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';

export default function StaffVerifications() {
  const [rows, setRows] = useState<any[]>([]);
  const load = async () => {
    const r = await adminApi.licenses.getPending();
    setRows(r.data || []);
  };
  useEffect(()=>{ load(); }, []);

  const cols: GridColDef[] = [
    { field:'id', headerName:'ID', width:160 },
    { field:'userEmail', headerName:'Email', width:220 },
    { field:'type', headerName:'Loại', width:140 },
    { field:'submittedAt', headerName:'Gửi lúc', width:180 },
    {
      field:'actions', type:'actions', width:120,
      getActions: ({ id }) => [
        <GridActionsCellItem key="approve" icon={<CheckIcon/>} label="Duyệt" onClick={async()=>{ await adminApi.licenses.approve(String(id)); load(); }} />,
        <GridActionsCellItem key="reject" icon={<BlockIcon/>} label="Từ chối" onClick={async()=>{ await adminApi.licenses.reject(String(id),'Thiếu/không hợp lệ'); load(); }} />,
      ]
    }
  ];

  return (
    <>
      <Topbar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-3">Hồ sơ xác minh chờ duyệt</h3>
          <div style={{ height: 520 }}><DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id} /></div>
        </main>
      </div>
    </>
  );
}
