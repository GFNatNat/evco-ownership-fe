import React, { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import api from '../../lib/api/axiosClient'

export default function CheckinCheckout(){
  const [bookingId,setBookingId]=useState('')
  const [startOdo,setStartOdo]=useState('')
  const [endOdo,setEndOdo]=useState('')

  async function handleCheckin(){
    await api.post('/staff/checkin',{ bookingId, startOdometer: Number(startOdo) })
    alert('Checked in')
  }
  async function handleCheckout(){
    await api.post('/staff/checkout',{ bookingId, endOdometer: Number(endOdo) })
    alert('Checked out')
  }

  return (
    <Box p={3}>
      <Typography variant="h5">Check-in / Check-out</Typography>
      <TextField label="Booking ID" value={bookingId} onChange={e=>setBookingId(e.target.value)} sx={{mt:2}} />
      <Box mt={2}><TextField label="Start odometer" value={startOdo} onChange={e=>setStartOdo(e.target.value)} /></Box>
      <Button variant="contained" sx={{mt:2}} onClick={handleCheckin}>Check-in</Button>
      <Box mt={4}><TextField label="End odometer" value={endOdo} onChange={e=>setEndOdo(e.target.value)} /></Box>
      <Button variant="contained" sx={{mt:2}} onClick={handleCheckout}>Check-out</Button>
    </Box>
  )
}