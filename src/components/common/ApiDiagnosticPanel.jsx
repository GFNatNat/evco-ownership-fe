import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Alert,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { diagnoseApiConnection } from '../utils/apiHealthCheck';

export default function ApiDiagnosticPanel() {
    const [diagnosing, setDiagnosing] = useState(false);
    const [results, setResults] = useState(null);

    const runDiagnostic = async () => {
        setDiagnosing(true);
        setResults(null);

        try {
            const diagnosticResults = await diagnoseApiConnection();
            setResults(diagnosticResults);
            console.log('🔧 Full Diagnostic Results:', diagnosticResults);
        } catch (error) {
            console.error('❌ Diagnostic failed:', error);
            setResults({ error: error.message });
        } finally {
            setDiagnosing(false);
        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🔧 API Connection Diagnostic
                </Typography>

                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                        API URL: {process.env.REACT_APP_API_BASE_URL || 'https://localhost:7279/api'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Environment: {process.env.NODE_ENV}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={runDiagnostic}
                    disabled={diagnosing}
                    startIcon={diagnosing ? <CircularProgress size={20} /> : null}
                >
                    {diagnosing ? 'Running Diagnostic...' : 'Run API Diagnostic'}
                </Button>

                {results && (
                    <Box mt={3}>
                        {results.error ? (
                            <Alert severity="error">
                                Diagnostic Error: {results.error}
                            </Alert>
                        ) : (
                            <>
                                {/* Health Check Results */}
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            API Health Check
                                            <Chip
                                                label={results.health?.success ? 'PASS' : 'FAIL'}
                                                color={results.health?.success ? 'success' : 'error'}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {results.health?.success ? (
                                            <Alert severity="success">
                                                API health check passed: {JSON.stringify(results.health.data)}
                                            </Alert>
                                        ) : (
                                            <Alert severity="error">
                                                API health check failed: {results.health?.error || 'Unknown error'}
                                                {results.health?.status && (
                                                    <Typography variant="body2" mt={1}>
                                                        Status: {results.health.status}
                                                    </Typography>
                                                )}
                                            </Alert>
                                        )}
                                    </AccordionDetails>
                                </Accordion>

                                {/* Register Test Results */}
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            Register Endpoint Test
                                            <Chip
                                                label={results.register?.success ? 'PASS' : 'FAIL'}
                                                color={results.register?.success ? 'success' : 'error'}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {results.register?.success ? (
                                            <Alert severity="success">
                                                Register endpoint working: {JSON.stringify(results.register.data)}
                                            </Alert>
                                        ) : (
                                            <Alert severity="error">
                                                Register endpoint failed: {results.register?.error || 'Unknown error'}
                                                {results.register?.status && (
                                                    <Typography variant="body2" mt={1}>
                                                        Status: {results.register.status}
                                                    </Typography>
                                                )}
                                                {results.register?.status === 500 && (
                                                    <Typography variant="body2" mt={1} sx={{ color: 'warning.main' }}>
                                                        🚨 This is the same 500 error you're experiencing.
                                                        The issue is on the backend server (NotificationMiddleware).
                                                    </Typography>
                                                )}
                                            </Alert>
                                        )}
                                    </AccordionDetails>
                                </Accordion>

                                {/* Recommendations */}
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Troubleshooting Steps:
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        1. Check if the backend server is running on port 7279<br />
                                        2. Verify the NotificationMiddleware configuration<br />
                                        3. Check backend logs for the specific error in NotificationMiddleware.cs:35<br />
                                        4. Ensure database connections are working<br />
                                        5. Try switching to the Azure backend URL temporarily
                                    </Typography>
                                </Alert>
                            </>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}