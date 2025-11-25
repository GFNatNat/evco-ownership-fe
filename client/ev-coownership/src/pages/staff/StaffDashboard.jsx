import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material'
import api from '../../lib/api/axiosClient'

export default function StaffDashboard(){
  const [stats, setStats] = useState(null)
  useEffect(()=>{
    api.get('/admin/stats').then(r=>setStats(r.data)).catch(()=>setStats({}))
  },[])

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Staff Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}><Card><CardContent><Typography>Active groups</Typography><Typography variant="h5">{stats?.groups||0}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent><Typography>Pending bookings</Typography><Typography variant="h5">{stats?.pendingBookings||0}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent><Typography>Open disputes</Typography><Typography variant="h5">{stats?.disputes||0}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent><Typography>Services due</Typography><Typography variant="h5">{stats?.services||0}</Typography></CardContent></Card></Grid>
      </Grid>

      <Box mt={4}>
        <Button variant="contained" onClick={()=>window.location='/staff/vehicle-groups'}>Manage Vehicle Groups</Button>
      </Box>
    </Box>
  )
}