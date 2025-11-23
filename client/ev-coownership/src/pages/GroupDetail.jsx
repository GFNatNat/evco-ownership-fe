import React from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { mockGroups } from '../mocks/mockData'

export default function GroupDetail() {
  const { id } = useParams()
  const g = mockGroups.find(x => x.id === id) || mockGroups[0]
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>{g.name}</Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '2fr 1fr' }} gap={2}>
        <Paper sx={{ p:2 }}>
          <Typography variant="h6">Vehicle</Typography>
          <Typography>{g.vehicle.model} — {g.vehicle.plate}</Typography>
          <Typography variant="caption">Odometer: {g.vehicle.odometer} km</Typography>
        </Paper>
        <Paper sx={{ p:2 }}>
          <Typography variant="h6">Common Fund</Typography>
          <Typography>{g.commonFund.balance.toLocaleString()} VND</Typography>
        </Paper>
      </Box>

      <Box mt={3}>
        <Paper sx={{ p:2 }}>
          <Typography variant="h6">Members</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Share</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {g.members.map(m => (
                <TableRow key={m.userId}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.share}%</TableCell>
                  <TableCell>{m.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  )
}