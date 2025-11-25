import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Typography } from '@mui/material';
import api from '../lib/api/axiosClient';

export default function PayModal({ cost, onClose }) {
  const [payer, setPayer] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const owed = (cost.splitDetail || []).filter(s => !s.paid);

  async function handlePay() {
    if (!payer) return alert('Choose payer');
    try {
      await api.post(`/costs/${cost._id}/pay`, { userId: payer, paymentRef });
      alert('Payment recorded');
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Pay Cost</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">Amount: {Number(cost.amount).toLocaleString()}</Typography>
        <Box sx={{ mt: 2 }}>
          <TextField select fullWidth label="Payer" value={payer} onChange={e => setPayer(e.target.value)}>
            {owed.map(s => <MenuItem key={String(s.userId)} value={String(s.userId)}>{String(s.userId)} — {(s.amount||0).toLocaleString()}</MenuItem>)}
          </TextField>
        </Box>
        <TextField label="Payment reference" fullWidth sx={{ mt: 2 }} value={paymentRef} onChange={e => setPaymentRef(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handlePay}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
