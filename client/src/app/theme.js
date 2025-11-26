import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }
  },
  components: {
    MuiAppBar: { defaultProps: { position: 'static' } }
  }
})

export default theme
