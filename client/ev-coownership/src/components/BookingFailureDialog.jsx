import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

export default function BookingFailureDialog({ open, onClose, conflict }) {
  if (!conflict) return null;
  const { winner, suggestions = [] } = conflict;
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Booking Conflict</DialogTitle>
      <DialogContent>
        <Typography>There is a higher-priority booking:</Typography>
        <List>
          <ListItem>
            <ListItemText primary={`Winner: ${winner.userId}`} secondary={`Score: ${Number(winner.score).toFixed(3)}`} />
          </ListItem>
        </List>
        <Typography>Suggested alternatives (top):</Typography>
        <List>
          {suggestions.map(s => (
            <ListItem key={s.id}><ListItemText primary={`${s.userId} — score ${Number(s.score).toFixed(3)}`} /></ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
