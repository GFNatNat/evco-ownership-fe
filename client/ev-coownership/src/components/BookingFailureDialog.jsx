import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material'

export default function BookingFailureDialog({ open, onClose, conflict }){
  if(!conflict) return null
  const { winner, suggestions } = conflict
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Booking Conflict</DialogTitle>
      <DialogContent>
        <p>Another booking has higher priority:</p>
        <List>
          <ListItem>
            <ListItemText primary={`Winner: ${winner.userId}`} secondary={`Score: ${Number(winner.score).toFixed(3)}`} />
          </ListItem>
        </List>
        <p>Suggested alternatives (top candidates):</p>
        <List>
          {suggestions.map(s=> (
            <ListItem key={s.id}><ListItemText primary={`${s.userId} (score ${Number(s.score).toFixed(3)})`} /></ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}