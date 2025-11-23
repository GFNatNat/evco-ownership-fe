import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { mockGroups, mockBookings } from '../mocks/mockData'

export default function Dashboard() {
  const g = mockGroups[0]
  const booking = mockBookings[0]
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3,1fr)' }} gap={2}>
        <Paper sx={{ p:2 }}>
          <Typography variant="subtitle2">Vehicle</Typography>
          <Typography variant="h6">{g.vehicle.model} — {g.vehicle.plate}</Typography>
          <Typography variant="caption">Odometer: {g.vehicle.odometer} km</Typography>
        </Paper>
        <Paper sx={{ p:2 }}>
          <Typography variant="subtitle2">Common Fund</Typography>
          <Typography variant="h6">{g.commonFund.balance.toLocaleString()} VND</Typography>
        </Paper>
        <Paper sx={{ p:2 }}>
          <Typography variant="subtitle2">Next Booking</Typography>
          <Typography variant="h6">{booking ? new Date(booking.startAt).toLocaleString() : 'None'}</Typography>
        </Paper>
      </Box>
    </Box>
  )
}