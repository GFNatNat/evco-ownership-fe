/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useMemo, useState, useCallback, startTransition } from 'react';
import { adminApi } from '@/api/adminApi';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Button, Stack, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');

  // Fetch ổn định và dùng trong mọi nơi cần reload
  const fetchUsers = useCallback(async () => {
    const res = q ? await adminApi.users.search(q) : await adminApi.users.getAll();
    startTransition(() => setRows(res.data || []));
  }, [q]);

  // Effect bất đồng bộ + defer microtask + cleanup
  useEffect(() => {
    let alive = true;
    const run = async () => { await fetchUsers(); };
    Promise.resolve().then(() => { if (alive) run(); });
    return () => { alive = false; };
  }, [fetchUsers]);

  const onActivate   = useCallback(async (id: string) => { await adminApi.users.activate(id);   await fetchUsers(); }, [fetchUsers]);
  const onDeactivate = useCallback(async (id: string) => { await adminApi.users.deactivate(id); await fetchUsers(); }, [fetchUsers]);
  const onDelete     = useCallback(async (id: string) => { await adminApi.users.delete(id);     await fetchUsers(); }, [fetchUsers]);

  const cols = useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 220 },
      { field: 'email', headerName: 'Email', flex: 1 },
      { field: 'name', headerName: 'Họ tên', flex: 1 },
      { field: 'status', headerName: 'Trạng thái', width: 140 },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Thao tác',
        width: 120,
        getActions: ({ id }) => [
          <GridActionsCellItem key="activate"   icon={<CheckIcon />} label="Kích hoạt" onClick={() => onActivate(String(id))} />,
          <GridActionsCellItem key="deactivate" icon={<BlockIcon />} label="Vô hiệu"   onClick={() => onDeactivate(String(id))} />,
          <GridActionsCellItem key="delete"     icon={<DeleteIcon />} label="Xóa"       onClick={() => onDelete(String(id))} showInMenu />,
        ],
      },
    ],
    [onActivate, onDeactivate, onDelete]
  );

  return (
    <Box className="p-6">
      <Stack direction="row" spacing={2} className="mb-3">
        <TextField size="small" placeholder="Tìm theo email..." value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="contained" onClick={fetchUsers}>Tìm</Button>
        <Button variant="outlined" onClick={() => setQ('')}>Làm mới</Button>
      </Stack>
      <div style={{ height: 560, width: '100%' }}>
        <DataGrid rows={rows} columns={cols} getRowId={(r) => r.id || r.userId || r.email} />
      </div>
    </Box>
  );
}
