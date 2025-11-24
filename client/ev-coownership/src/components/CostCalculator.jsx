import React, { useMemo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function CostCalculator({ amount, members, splitMethod, usageMap = {}, wShare = 0.6 }) {
  const rows = useMemo(() => {
    if (splitMethod === 'byShare') return members.map(m => ({ ...m, amount: Math.round((m.share/100)*amount) }))
    if (splitMethod === 'byUsage') {
      const totalUsage = Object.values(usageMap).reduce((a,b)=>a+(Number(b)||0),0) || 1
      return members.map(m=>({ ...m, amount: Math.round(((Number(usageMap[m.userId])||0)/totalUsage)*amount) }))
    }
    // hybrid
    const totalUsage = Object.values(usageMap).reduce((a,b)=>a+(Number(b)||0),0) || 1
    return members.map(m=>{
      const sharePart = m.share/100
      const usagePart = (Number(usageMap[m.userId])||0)/totalUsage
      const factor = wShare*sharePart + (1-wShare)*usagePart
      return { ...m, amount: Math.round(factor*amount) }
    })
  }, [amount, members, splitMethod, usageMap, wShare])

  const total = rows.reduce((s,r)=>s+r.amount,0)

  return (
    <Paper sx={{ p:2, mt:2 }}>
      <Typography variant="subtitle1">Preview split</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Share</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.userId}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.share}%</TableCell>
              <TableCell align="right">{r.amount.toLocaleString()} VND</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell /><TableCell><strong>Total</strong></TableCell>
            <TableCell align="right"><strong>{total.toLocaleString()} VND</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}