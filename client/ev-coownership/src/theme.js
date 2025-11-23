import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#0f6efd' },
    secondary: { main: '#6c757d' }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } }
  }
})

export default theme