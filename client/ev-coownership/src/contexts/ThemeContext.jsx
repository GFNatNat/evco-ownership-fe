import React, { createContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import createAppTheme from '../theme'


export const ThemeToggleContext = createContext({ toggle: ()=>{} })


export function AppThemeProvider({ children }){
const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light')
useEffect(()=> localStorage.setItem('theme', mode), [mode])
const theme = useMemo(()=>createAppTheme(mode), [mode])
function toggle(){ setMode(m => (m === 'light' ? 'dark' : 'light')) }
return (
<ThemeToggleContext.Provider value={{ mode, toggle }}>
<ThemeProvider theme={theme}>{children}</ThemeProvider>
</ThemeToggleContext.Provider>
)
}