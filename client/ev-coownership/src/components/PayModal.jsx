import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography, Box } from '@mui/material'
import api from '../api/api'

export default function PayModal({ cost, onClose }){
  const [userId, setUserId] = useState('')
  const [paymentRef, setPaymentRef] = useState('')

  function owedEntries(){
    return (cost.splitDetail || []).filter(s => !s.paid)
  }

  async function handlePay(){
    if(!userId) return alert('Choose payer')
    try{
      await api.post(`/costs/${cost._id}/pay`, { userId, paymentRef })
      alert('Payment recorded')
      onClose()
    }catch(e){ alert(e.response?.data?.message || e.message) }
  }

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Pay Cost</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">Amount: {cost.amount.toLocaleString()}</Typography>
        <Box sx={{ mt:2 }}>
          <TextField select label="Payer" fullWidth value={userId} onChange={e=>setUserId(e.target.value)}>
            {owedEntries().map(s=> (
              <MenuItem key={s.userId} value={s.userId}>{s.userId} — {s.amount.toLocaleString()}</MenuItem>
            ))}
          </TextField>
        </Box>
        <TextField label="Payment ref" fullWidth value={paymentRef} onChange={e=>setPaymentRef(e.target.value)} sx={{ mt:2 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handlePay}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}