import React, {useEffect, useState} from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Typography } from '@mui/material'
import api from '../../lib/api/axiosClient'

export default function Users(){
  const [users,setUsers]=useState([])
  useEffect(()=>api.get('/admin/users').then(r=>setUsers(r.data)).catch(()=>{}),[])
  return (
    <Box p={3}><Typography variant="h4">User Management</Typography>
      <Table><TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Action</TableCell></TableRow></TableHead>
      <TableBody>{users.map(u=>(<TableRow key={u._id}><TableCell>{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell><TableCell><Button size="small" onClick={()=>alert('edit')}>Edit</Button></TableCell></TableRow>))}</TableBody></Table>
    </Box>
  )
}