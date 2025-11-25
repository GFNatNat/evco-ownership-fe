import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material'
import api from '../../lib/api/axiosClient'

export default function VehicleGroups(){
  const [groups,setGroups] = useState([])
  useEffect(()=>{ api.get('/groups').then(r=>setGroups(r.data)).catch(()=>{}) },[])

  return (
    <Box p={3}>
      <Typography variant="h4">Vehicle Groups</Typography>
      <Card sx={{mt:2}}>
        <CardContent>
          <Table size="small">
            <TableHead><TableRow><TableCell>Group</TableCell><TableCell>Vehicle</TableCell><TableCell>Members</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
            <TableBody>{groups.map(g=>(<TableRow key={g._id}><TableCell>{g.name}</TableCell><TableCell>{g.vehicle?.model} ({g.vehicle?.plate})</TableCell><TableCell>{g.members?.length||0}</TableCell><TableCell><Button size="small" onClick={()=>window.location=`/staff/groups/${g._id}`}>Open</Button></TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  )
}