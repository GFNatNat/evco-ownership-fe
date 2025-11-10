/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, startTransition, useMemo, useState } from 'react';
import { adminApi } from '@/api/adminApi';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';

export default function AdminGroups(){
  const [rows,setRows]=useState<any[]>([]);
  const load = useCallback(async()=>{
    const r = await adminApi.groups.getAll();
    startTransition(()=>setRows(r.data||[]));
  },[]);
  useEffect(()=>{ let a=true; Promise.resolve().then(()=>{ if(a) load();}); return()=>{a=false}; },[load]);

  const dissolve=async(id:string)=>{ await adminApi.groups.dissolve(id,'Giải tán theo yêu cầu'); await load(); };

  const cols: GridColDef[] = useMemo(()=>[
    {field:'id', headerName:'ID', width:180},
    {field:'name', headerName:'Tên nhóm', flex:1},
    {field:'memberCount', headerName:'Thành viên', width:140, valueGetter:(p)=>p.row?.memberCount ?? p.row?.members?.length},
    {field:'actions', type:'actions', width:100,
      getActions:({id})=>([<GridActionsCellItem key="dis" icon={<BlockIcon/>} label="Giải tán" onClick={()=>dissolve(String(id))}/>])},
  ], [dissolve]);

  return <Box className="p-6" sx={{height:560}}><DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id}/></Box>;
}
