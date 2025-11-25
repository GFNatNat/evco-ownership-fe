import React, { useMemo } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

export default function CostCalculator({ amount = 0, members = [], usageMap = {}, method = 'byShare', wShare = 0.6 }) {
  const split = useMemo(() => {
    if (!members || members.length === 0) return [];
    if (method === 'byShare') {
      return members.map(m => ({ userId: m.userId || m._id || m.id, amount: Math.round((m.share || 0) / 100 * amount) }));
    }
    if (method === 'byUsage') {
      const total = Object.values(usageMap).reduce((a, b) => a + (Number(b) || 0), 0) || 1;
      return members.map(m => ({ userId: m.userId || m._id || m.id, amount: Math.round(((Number(usageMap[m.userId]) || 0) / total) * amount) }));
    }
    if (method === 'hybrid') {
      const total = Object.values(usageMap).reduce((a, b) => a + (Number(b) || 0), 0) || 1;
      return members.map(m => {
        const sharePart = (m.share || 0) / 100;
        const usagePart = (Number(usageMap[m.userId]) || 0) / total;
        const factor = wShare * sharePart + (1 - wShare) * usagePart;
        return { userId: m.userId || m._id || m.id, amount: Math.round(factor * amount) };
      });
    }
    return [];
  }, [amount, members, usageMap, method, wShare]);

  // rounding correction
  const totalCalculated = split.reduce((s, it) => s + (it.amount || 0), 0);
  let diff = Math.round(amount - totalCalculated);
  const out = split.map(s => ({ ...s }));
  for (let i = 0; diff !== 0 && i < out.length * 2; i++) {
    const idx = i % out.length;
    out[idx].amount += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="subtitle1">Split Preview ({method})</Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {out.map(s => (
          <Grid item xs={12} sm={6} md={4} key={s.userId}>
            <Box sx={{ border: '1px solid rgba(0,0,0,0.06)', p: 1, borderRadius: 1 }}>
              <Typography variant="body2" noWrap>{String(s.userId)}</Typography>
              <Typography variant="h6">{(s.amount || 0).toLocaleString()}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
