import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' },
    secondary: { main: '#64748b' }
  },
  shape: { borderRadius: 12 }
});
export default theme;