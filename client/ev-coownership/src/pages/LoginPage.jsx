import React from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  function handleSubmit(e) {
    e.preventDefault()
    const email = e.target.email.value
    login(email)
    nav('/')
  }
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="80vh">
      <Paper sx={{ p:3, width: 360 }}>
        <Typography variant="h6" gutterBottom>Sign in</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField name="email" label="Email" fullWidth defaultValue="bao@example.com" sx={{ mb:2 }} />
          <TextField name="password" label="Password" type="password" fullWidth defaultValue="password" sx={{ mb:2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained">Login</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}