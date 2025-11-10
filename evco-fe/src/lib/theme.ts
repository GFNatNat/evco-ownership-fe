'use client';
import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#2563eb' } },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 10, textTransform: 'none' } } } },
});
export default theme;
