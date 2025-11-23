import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { mockBookings, mockGroups } from '../mocks/mockData'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function CalendarPage() {
  const [events, setEvents] = useState(() => mockBookings.map(b => ({ id: b.id, title: `Booking:${b.userId}`, start: b.startAt, end: b.endAt })))
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({ start: '', end: '' })
  const [groupId] = useState(mockGroups[0].id)

  function handleDateSelect(selectInfo) {
    setRange({ start: selectInfo.startStr, end: selectInfo.endStr })
    setOpen(true)
  }
  function handleCreate() {
    // naive conflict check
    const conflict = events.some(ev => !(new Date(range.end) <= new Date(ev.start) || new Date(range.start) >= new Date(ev.end)))
    if (conflict) {
      alert('Conflict detected — adjust dates or request approval')
      return
    }
    const id = `b_${Date.now()}`
    const newEv = { id, title: 'My booking', start: range.start, end: range.end }
    setEvents(prev => [...prev, newEv])
    setOpen(false)
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Calendar</Typography>
      <Box sx={{ bgcolor: 'background.paper', p:2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable
          select={handleDateSelect}
          events={events}
          height="auto"
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create booking</DialogTitle>
        <DialogContent>
          <TextField label="Start" type="datetime-local" fullWidth value={range.start} onChange={e => setRange(r => ({ ...r, start: e.target.value }))} sx={{ mt:1 }} InputLabelProps={{ shrink:true }} />
          <TextField label="End" type="datetime-local" fullWidth value={range.end} onChange={e => setRange(r => ({ ...r, end: e.target.value }))} sx={{ mt:2 }} InputLabelProps={{ shrink:true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}