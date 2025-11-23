import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import Navbar from './components/NavBar'
import Sidebar from './components/SideBar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/CalendarPage'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import Login from './pages/LoginPage'

export default function App() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}