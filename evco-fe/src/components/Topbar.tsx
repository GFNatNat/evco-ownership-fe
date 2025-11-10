'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const router = useRouter();
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar className="justify-between">
        <Typography variant="h6">EV Co-Ownership</Typography>
        <Button onClick={() => { Cookies.remove(process.env.NEXT_PUBLIC_AUTH_COOKIE ?? 'accessToken'); router.push('/login'); }}>
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
}
