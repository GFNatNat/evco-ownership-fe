/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import RoleGate from '@/components/RoleGate';
import { useCallback, useEffect, startTransition, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { paymentApi } from '@/api/paymentApi';

export default function History(){
  const [rows,setRows]=useState<any[]>([]);
  const load = useCallback(async()=>{
    const r = await paymentApi.history();
    startTransition(()=>setRows(r.data||[]));
  },[]);
  useEffect(()=>{ let a=true; Promise.resolve().then(()=>{ if(a) load();}); return()=>{a=false}; },[load]);
  const cols: GridColDef[]=[
    {field:'id', headerName:'ID', width:160},
    {field:'type', headerName:'Loại', width:160},
    {field:'amount', headerName:'Số tiền', width:160},
    {field:'period', headerName:'Kỳ', width:140},
    {field:'createdAt', headerName:'Thời gian', width:200},
  ];
  return (<>
    <Topbar/>
    <div className="flex">
      <SideNav/>
      <RoleGate need="COOWNER">
        <main className="flex-1 p-6">
          <div style={{height:520}}><DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id}/></div>
        </main>
      </RoleGate>
    </div>
  </>);
}
