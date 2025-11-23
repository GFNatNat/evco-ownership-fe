import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { mockGroups } from '../mocks/mockData'
import { Link as RouterLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <Drawer variant="permanent" open sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}>
      <List>
        <ListItem>
          <ListItemText primary="Vehicles" />
        </ListItem>
        {mockGroups.map(g => (
          <ListItem button key={g.id} component={RouterLink} to={`/groups/${g.id}`}>
            <ListItemText primary={`${g.vehicle.model} — ${g.vehicle.plate}`} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}