import React, { useContext } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'

export default function NavBar(){
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const doLogout = async ()=>{ await logout(); navigate('/login') }

  return (
    <AppBar>
      <Toolbar sx={{ display:'flex', justifyContent:'space-between' }}>
        <Box>
          <Typography component={Link} to='/' variant="h6" sx={{ color:'inherit', textDecoration:'none' }}>EV Co-Ownership</Typography>
        </Box>
        <Box>
          <Button component={Link} to='/vehicles' sx={{ color:'inherit' }}>Vehicles</Button>
          {user ? <Button onClick={doLogout} sx={{ color:'inherit' }}>Logout</Button> : <Button component={Link} to='/login' sx={{ color:'inherit' }}>Login</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
