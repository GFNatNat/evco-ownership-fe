import React, { useState, useEffect } from 'react';
import { Box, Alert, AlertTitle, Button, Collapse, CircularProgress, Chip } from '@mui/material';
import { CheckCircle, Error, Warning, Refresh } from '@mui/icons-material';
import axiosClient from '../../api/axiosClient';

const BackendStatusChecker = () => {
  const [status, setStatus] = useState('checking'); // checking, online, offline, error
  const [details, setDetails] = useState(null);
  const [open, setOpen] = useState(true);

  const checkBackendStatus = async () => {
    setStatus('checking');
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7279';
    
    const result = {
      baseUrl,
      timestamp: new Date().toISOString(),
      checks: []
    };

    try {
      // Check 1: Simple fetch to backend
      const healthUrl = `${baseUrl}/api/coowner/profile`;
      try {
        const response = await fetch(healthUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
          }
        });

        result.checks.push({
          name: 'Backend Connection',
          status: response.ok || response.status === 401 ? 'success' : 'failed',
          statusCode: response.status,
          message: response.ok ? 'Backend is running' : 
                   response.status === 401 ? 'Backend running (needs auth)' : 
                   `Backend returned ${response.status}`
        });

        if (response.ok || response.status === 401) {
          setStatus('online');
        } else if (response.status === 404) {
          setStatus('error');
          result.checks.push({
            name: 'Endpoint Check',
            status: 'failed',
            message: '404 - Backend API endpoint not found. Check backend implementation.'
          });
        } else {
          setStatus('error');
        }
      } catch (fetchError) {
        result.checks.push({
          name: 'Backend Connection',
          status: 'failed',
          message: `Cannot connect: ${fetchError.message}`
        });
        setStatus('offline');
      }

      // Check 2: Token status
      const token = localStorage.getItem('accessToken');
      result.checks.push({
        name: 'Authentication Token',
        status: token ? 'success' : 'warning',
        message: token ? 'Token present' : 'No token - please login'
      });

      setDetails(result);
    } catch (error) {
      setStatus('error');
      setDetails({
        baseUrl,
        error: error.message,
        checks: [{
          name: 'Status Check',
          status: 'failed',
          message: error.message
        }]
      });
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getAlertSeverity = () => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'error': return 'warning';
      default: return 'info';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return <CircularProgress size={20} />;
      case 'online': return <CheckCircle />;
      case 'offline': return <Error />;
      case 'error': return <Warning />;
      default: return null;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking': return 'Checking backend connection...';
      case 'online': return 'Backend is online and ready';
      case 'offline': return 'Cannot connect to backend - Make sure backend is running';
      case 'error': return 'Backend connection issue detected';
      default: return 'Unknown status';
    }
  };

  if (status === 'online' && !open) {
    return null; // Hide when everything is OK and user closed it
  }

  return (
    <Collapse in={open}>
      <Alert 
        severity={getAlertSeverity()}
        icon={getStatusIcon()}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              size="small" 
              onClick={checkBackendStatus}
              startIcon={<Refresh />}
            >
              Recheck
            </Button>
            {status === 'online' && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setOpen(false)}
              >
                Dismiss
              </Button>
            )}
          </Box>
        }
        sx={{ mb: 2 }}
      >
        <AlertTitle>{getStatusMessage()}</AlertTitle>
        
        {details && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 1 }}>
              <strong>Backend URL:</strong> <code>{details.baseUrl}</code>
            </Box>
            
            {details.checks && details.checks.map((check, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip 
                  label={check.status}
                  color={check.status === 'success' ? 'success' : check.status === 'warning' ? 'warning' : 'error'}
                  size="small"
                />
                <span><strong>{check.name}:</strong> {check.message}</span>
                {check.statusCode && <code>({check.statusCode})</code>}
              </Box>
            ))}

            {status === 'offline' && (
              <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <strong>💡 Quick Fix:</strong>
                <ol style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                  <li>Make sure backend is running: <code>dotnet run</code></li>
                  <li>Check backend URL in .env.local file</li>
                  <li>Restart frontend dev server after changing .env.local</li>
                </ol>
              </Box>
            )}

            {status === 'error' && details.checks.some(c => c.statusCode === 404) && (
              <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <strong>⚠️ 404 Error:</strong> Backend API endpoints not found. This usually means:
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                  <li>Backend API routes are not implemented yet</li>
                  <li>API base path is incorrect (check backend routing)</li>
                  <li>Backend is running but on different port</li>
                </ul>
              </Box>
            )}
          </Box>
        )}
      </Alert>
    </Collapse>
  );
};

export default BackendStatusChecker;
