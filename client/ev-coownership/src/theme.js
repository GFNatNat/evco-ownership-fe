import { createTheme } from '@mui/material/styles'


export const getDesignTokens = (mode) => ({
palette: {
mode,
...(mode === 'light'
? {
primary: { main: '#0f6efd' },
background: { default: '#f4f6f8', paper: '#fff' }
}
: {
primary: { main: '#90caf9' },
background: { default: '#121212', paper: '#1d1d1d' }
})
},
components: {
MuiButton: { defaultProps: { disableElevation: true } }
}
})


export default function createAppTheme(mode='light'){
return createTheme(getDesignTokens(mode))
}