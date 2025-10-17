import React from 'react';
import { Card, CardContent, Tabs, Tab, Box, Typography, Stack, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import groupApi from '../../api/groupApi';

export default function Group() {
  const [tab, setTab] = React.useState(0);
  const [groups, setGroups] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState(null);

  React.useEffect(()=>{ (async()=>{
    const res = await groupApi.list();
    const data = Array.isArray(res.data) ? res.data : [];
    setGroups(data);
    setSelectedGroup(data[0]?.id || null);
  })(); }, []);

  return (
    <Card><CardContent>
      <Typography variant="h5" sx={{ mb: 2 }}>Nhóm đồng sở hữu</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField select SelectProps={{ native: true }} label="Chọn nhóm" value={selectedGroup || ''} onChange={(e)=>setSelectedGroup(e.target.value)}>
          {(groups||[]).map(g => <option key={g.id} value={g.id}>{g.name || ('Group #' + g.id)}</option>)}
        </TextField>
      </Stack>

      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Thành viên" />
        <Tab label="Bỏ phiếu" />
        <Tab label="Quỹ chung" />
      </Tabs>

      {tab === 0 && <Members groupId={selectedGroup} />}
      {tab === 1 && <Votes groupId={selectedGroup} />}
      {tab === 2 && <Fund groupId={selectedGroup} />}
    </CardContent></Card>
  );
}

function Members({ groupId }){
  const [rows, setRows] = React.useState([]);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('Member');

  const load = React.useCallback(async ()=>{
    if(!groupId) return;
    const res = await groupApi.listMembers(groupId);
    const data = Array.isArray(res.data) ? res.data : [];
    setRows(data.map((r,i)=>({ id: r.id ?? i, ...r })));
  },[groupId]);
  React.useEffect(()=>{ load(); },[load]);

  const add = async () => { await groupApi.addMember(groupId, { name, role }); setName(''); await load(); };
  const remove = async (id) => { await groupApi.removeMember(groupId, id); await load(); };

  const columns = [
    { field: 'name', headerName: 'Tên', flex: 1 },
    { field: 'role', headerName: 'Quyền', flex: 1 },
    { field: 'actions', headerName: 'Hành động', flex: 0.8, renderCell: (p)=>(<Button color="error" size="small" onClick={()=>remove(p.row.id)}>Xoá</Button>) },
  ];

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField label="Tên" value={name} onChange={(e)=>setName(e.target.value)} />
        <TextField label="Quyền" value={role} onChange={(e)=>setRole(e.target.value)} />
        <Button variant="contained" onClick={add}>Thêm</Button>
      </Stack>
      <div style={{ height: 460, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
      </div>
    </Box>
  );
}

function Votes({ groupId }){
  const [rows, setRows] = React.useState([]);
  const [title, setTitle] = React.useState('');

  const load = React.useCallback(async ()=>{
    if(!groupId) return;
    const res = await groupApi.listVotes(groupId);
    const data = Array.isArray(res.data) ? res.data : [];
    setRows(data.map((r,i)=>({ id: r.id ?? i, ...r })));
  },[groupId]);
  React.useEffect(()=>{ load(); },[load]);

  const create = async () => { await groupApi.createVote(groupId, { title }); setTitle(''); await load(); };
  const vote = async (voteId, val) => { await groupApi.vote(groupId, voteId, { value: val }); await load(); };

  const columns = [
    { field: 'title', headerName: 'Tiêu đề', flex: 1 },
    { field: 'result', headerName: 'Kết quả', flex: 0.6 },
    { field: 'actions', headerName: 'Bỏ phiếu', flex: 1, renderCell: (p)=>(
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" onClick={()=>vote(p.row.id, 'yes')}>Đồng ý</Button>
        <Button size="small" variant="outlined" onClick={()=>vote(p.row.id, 'no')}>Không</Button>
      </Stack>
    )},
  ];

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField label="Tiêu đề" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <Button variant="contained" onClick={create}>Tạo cuộc bỏ phiếu</Button>
      </Stack>
      <div style={{ height: 460, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSizeOptions={[5,10,25]} />
      </div>
    </Box>
  );
}

function Fund({ groupId }){
  const [info, setInfo] = React.useState(null);
  const [amount, setAmount] = React.useState(0);
  const load = React.useCallback(async ()=>{
    if(!groupId) return;
    const res = await groupApi.getFund(groupId);
    setInfo(res.data);
  },[groupId]);
  React.useEffect(()=>{ load(); },[load]);

  const contribute = async () => { await groupApi.contributeFund(groupId, { amount: Number(amount) }); setAmount(0); await load(); };

  return (
    <Box>
      <Typography>Số dư quỹ: <b>{info?.balance ? new Intl.NumberFormat().format(info.balance) : 0}</b> ₫</Typography>
      <Stack direction="row" spacing={2} sx={{ my:2 }}>
        <TextField type="number" label="Nạp quỹ" value={amount} onChange={(e)=>setAmount(e.target.value)} />
        <Button variant="contained" onClick={contribute}>Xác nhận</Button>
      </Stack>
    </Box>
  );
}