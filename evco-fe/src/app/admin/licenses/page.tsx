/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, startTransition, useState } from 'react';
import { adminApi } from '@/api/adminApi';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';

export default function AdminLicenses(){
  const [rows,setRows]=useState<any[]>([]);
  const load = useCallback(async()=>{
    const r = await adminApi.licenses.getAll();
    startTransition(()=>setRows(r.data||[]));
  },[]);
  useEffect(()=>{ let a=true; Promise.resolve().then(()=>{ if(a) load();}); return()=>{a=false}; },[load]);

  const approve=async(id:string)=>{ await adminApi.licenses.approve(id); await load(); };
  const reject =async(id:string)=>{ await adminApi.licenses.reject(id,'Không đạt'); await load(); };

  const cols: GridColDef[] = [
    { field:'id', headerName:'ID', width:160 },
    { field:'userEmail', headerName:'Email', width:220 },
    { field:'status', headerName:'Trạng thái', width:160 },
    { field:'actions', type:'actions', width:120,
      getActions:({id})=>([
        <GridActionsCellItem key="a" icon={<CheckIcon/>} label="Duyệt" onClick={()=>approve(String(id))}/>,
        <GridActionsCellItem key="r" icon={<BlockIcon/>} label="Từ chối" onClick={()=>reject(String(id))}/>,
      ])
    },
  ];

  return <Box className="p-6" sx={{height:560}}><DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id}/></Box>;
}
