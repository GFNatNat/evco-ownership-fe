/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import RoleGate from '@/components/RoleGate';
import { groupApi } from '@/api/groupApi';
import { useEffect, useMemo, useState, useCallback, startTransition } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function CoownerGroups() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const fetchGroups = useCallback(async () => {
    const res = await groupApi.getAll();
    startTransition(() => setRows(res.data || []));
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => { if (alive) fetchGroups(); });
    return () => { alive = false; };
  }, [fetchGroups]);

  const onCreate = useCallback(async () => {
    await groupApi.create({ name });
    setOpen(false); setName('');
    await fetchGroups();
  }, [name, fetchGroups]);

  const onDelete = useCallback(async (id: string) => {
    await groupApi.update(id, { isDeleted: true });
    await fetchGroups();
  }, [fetchGroups]);

  const cols = useMemo<GridColDef[]>(() => [
    { field: 'id', headerName: 'ID', width: 180 },
    { field: 'name', headerName: 'Tên nhóm', flex: 1 },
    { field: 'members', headerName: 'Số thành viên', width: 160, valueGetter: (p)=>p.row?.members?.length ?? p.row?.memberCount },
    {
      field:'actions', type:'actions', width: 80,
      getActions: ({ id }) => [
        <GridActionsCellItem key="del" icon={<DeleteIcon/>} label="Xóa" onClick={() => onDelete(String(id))} />
      ]
    }
  ], [onDelete]);

  return (
    <>
      <Topbar />
      <div className="flex">
        <SideNav />
        <RoleGate need="COOWNER">
          <main className="flex-1 p-6">
            <Stack direction="row" spacing={2} className="mb-3">
              <Button startIcon={<AddIcon />} variant="contained" onClick={()=>setOpen(true)}>Tạo nhóm</Button>
            </Stack>
            <Box sx={{ height: 520 }}>
              <DataGrid rows={rows} columns={cols} getRowId={(r)=>r.id} />
            </Box>
            <Dialog open={open} onClose={()=>setOpen(false)}>
              <DialogTitle>Tạo nhóm đồng sở hữu</DialogTitle>
              <DialogContent>
                <TextField autoFocus margin="dense" label="Tên nhóm" fullWidth value={name} onChange={e=>setName(e.target.value)} />
              </DialogContent>
              <DialogActions>
                <Button onClick={()=>setOpen(false)}>Hủy</Button>
                <Button variant="contained" onClick={onCreate} disabled={!name.trim()}>Tạo</Button>
              </DialogActions>
            </Dialog>
          </main>
        </RoleGate>
      </div>
    </>
  );
}
