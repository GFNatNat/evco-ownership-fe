import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../contexts/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>EV Co-Own</Typography>
        <Button component={RouterLink} to="/" size="small">Dashboard</Button>
        <Button component={RouterLink} to="/calendar" size="small">Calendar</Button>
        <Button component={RouterLink} to="/groups" size="small">Groups</Button>
        {user ? (
          <>
            <Typography sx={{ mx: 2 }}>{user.name}</Typography>
            <Button onClick={logout} size="small">Logout</Button>
          </>
        ) : (
          <Button component={RouterLink} to="/login" size="small">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  )
}