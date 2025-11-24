import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import App from './App'
import theme from './theme'
import { AuthProvider } from './contexts/AuthContext'
import { AppThemeProvider } from './contexts/ThemeContext'

import './index.css'

createRoot(document.getElementById('root')).render(
<React.StrictMode>
<AppThemeProvider>
<CssBaseline />
<AuthProvider>
<BrowserRouter>
<App />
</BrowserRouter>
</AuthProvider>
</AppThemeProvider>
</React.StrictMode>
)