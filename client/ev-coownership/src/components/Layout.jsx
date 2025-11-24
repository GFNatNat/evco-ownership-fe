import { Container, Box } from '@mui/material'
import Navbar from './NavBar'
import { Outlet } from 'react-router-dom'


export default function Layout(){
return (
<Box sx={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
<Navbar />
<Container maxWidth="lg" sx={{ my:3, flex:1 }}>
<Outlet />
</Container>
</Box>
)
}