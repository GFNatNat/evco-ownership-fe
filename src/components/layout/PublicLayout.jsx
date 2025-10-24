import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { DirectionsCar, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function PublicLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: 'white', 
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}
      >
        <Toolbar>
          {/* Logo & Brand */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              flexGrow: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <DirectionsCar sx={{ fontSize: 32, color: '#10b981' }} />
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{
                background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              EV Co-ownership
            </Typography>
          </Box>

          {/* Navigation Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                borderColor: '#10b981',
                color: '#10b981',
                '&:hover': {
                  borderColor: '#059669',
                  bgcolor: 'rgba(16, 185, 129, 0.04)'
                }
              }}
            >
              Đăng nhập
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/register')}
              sx={{
                textTransform: 'none',
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              Đăng ký
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#f8fafc', 
          py: 3, 
          borderTop: '1px solid #e2e8f0',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCar sx={{ fontSize: 20, color: '#10b981' }} />
              <Typography variant="body2" color="text.secondary">
                © 2025 EV Co-ownership Platform. All rights reserved.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="text" size="small" color="inherit">
                Về chúng tôi
              </Button>
              <Button variant="text" size="small" color="inherit">
                Liên hệ
              </Button>
              <Button variant="text" size="small" color="inherit">
                Điều khoản
              </Button>
              <Button variant="text" size="small" color="inherit">
                Chính sách
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}