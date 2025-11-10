/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import RoleGate from '@/components/RoleGate';
import { groupApi } from '@/api/groupApi';
import { useCallback, useEffect, startTransition, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export default function VotesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [groups, setGroups] = useState<any[]>([]);

  const fetchVotes = useCallback(async () => {
    if (!groupId) { setRows([]); return; }
    const r = await groupApi.votes(groupId);
    startTransition(() => setRows(r.data || []));
  }, [groupId]);

  const fetchGroups = useCallback(async () => {
    const r = await groupApi.getAll();
    startTransition(() => setGroups(r.data || []));
  }, []);

  useEffect(()=>{ fetchGroups(); },[fetchGroups]);
  useEffect(()=>{
    let alive = true;
    Promise.resolve().then(()=>{ if(alive) fetchVotes(); });
    return ()=>{ alive=false; };
  },[fetchVotes]);

  const createVote = useCallback(async ()=>{
    if(!groupId || !topic.trim()) return;
    await groupApi.createVote(groupId, { topic });
    setOpen(false); setTopic('');
    await fetchVotes();
  },[groupId, topic, fetchVotes]);

  const cols: GridColDef[] = [
    { field:'id', headerName:'ID', width:180 },
    { field:'topic', headerName:'Chủ đề', flex:1 },
    { field:'status', headerName:'Trạng thái', width:160 },
  ];

  return (<>
    <Topbar/><div className="flex">
      <SideNav/>
      <RoleGate need="COOWNER">
        <main className="flex-1 p-6">
          <Stack direction="row" spacing={2} className="mb-3 items-center">
            <TextField select size="small" label="Nhóm" value={groupId} onChange={e=>setGroupId(e.target.value)} sx={{minWidth:260}}>
              {groups.map((g:any)=>(<MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>))}
            </TextField>
            <Button variant="contained" onClick={()=>setOpen(true)} disabled={!groupId}>Tạo phiếu</Button>
          </Stack>
          <Box sx={{height:520}}>
            <DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id}/>
          </Box>
          <Dialog open={open} onClose={()=>setOpen(false)}>
            <DialogTitle>Tạo phiếu biểu quyết</DialogTitle>
            <DialogContent>
              <TextField autoFocus fullWidth label="Chủ đề" value={topic} onChange={e=>setTopic(e.target.value)} />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>setOpen(false)}>Hủy</Button>
              <Button variant="contained" onClick={createVote} disabled={!topic.trim()}>Tạo</Button>
            </DialogActions>
          </Dialog>
        </main>
      </RoleGate>
    </div>
  </>);
}
