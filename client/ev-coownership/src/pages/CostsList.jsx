import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';
import api from '../lib/api/axiosClient';
import PayModal from '../components/PayModal';

export default function CostsList() {
  const [costs, setCosts] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchCosts() {
    setLoading(true);
    try {
      const res = await api.get('/costs');
      setCosts(res.data);
    } catch (e) {
      console.error(e);
      setCosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCosts(); }, []);

  async function handleApprove(id) {
    try {
      await api.post(`/costs/${id}/approve`);
      fetchCosts();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Costs</Typography>
      <Paper sx={{ p: 2 }}>
        {loading && <Box display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box>}
        {!loading && costs && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Group</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {costs.map(c => (
                <TableRow key={c._id}>
                  <TableCell sx={{ maxWidth: 220 }}>{String(c.groupId)}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell align="right">{Number(c.amount).toLocaleString()}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell align="right">
                    {c.status === 'pending' && <Button size="small" onClick={() => handleApprove(c._id)}>Approve</Button>}
                    <Button size="small" onClick={() => setSelected(c)}>Pay</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {selected && <PayModal cost={selected} onClose={() => { setSelected(null); fetchCosts(); }} />}
    </Box>
  );
}
