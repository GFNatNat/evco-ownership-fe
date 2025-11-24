import React, { useContext } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Link } from 'react-router-dom'
import { ThemeToggleContext } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'


export default function Navbar(){
const { mode, toggle } = useContext(ThemeToggleContext)
const { user, logout } = useAuth()
const [anchor, setAnchor] = React.useState(null)
const open = Boolean(anchor)
return (
<AppBar position="static">
<Toolbar>
<IconButton edge="start" color="inherit" sx={{ mr:2 }} onClick={e=>setAnchor(e.currentTarget)}>
<MenuIcon />
</IconButton>
<Menu anchorEl={anchor} open={open} onClose={()=>setAnchor(null)}>
<MenuItem component={Link} to="/">Dashboard</MenuItem>
<MenuItem component={Link} to="/groups">Groups</MenuItem>
<MenuItem component={Link} to="/calendar">Calendar</MenuItem>
<MenuItem component={Link} to="/costs">Costs</MenuItem>
</Menu>


<Typography variant="h6" sx={{ flexGrow: 1 }}>EV Co-Own</Typography>


<IconButton color="inherit" onClick={toggle} title="Toggle theme">
{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
</IconButton>


{user ? (
<>
<Typography sx={{ mx:2 }}>{user.name}</Typography>
<Button color="inherit" onClick={logout}>Logout</Button>
</>
) : (
<Button color="inherit" component={Link} to="/login">Login</Button>
)}
</Toolbar>
</AppBar>
)
}