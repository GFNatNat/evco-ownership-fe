import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { mockGroups } from '../mocks/mockData'
import CostCalculator from '../components/CostCalculator'
import api from '../api/api'

export default function CostCreatePage() {
  const group = mockGroups[0]
  const members = group.members
  const [amount, setAmount] = useState(100000)
  const [splitMethod, setSplitMethod] = useState('byShare')
  const [usageMap, setUsageMap] = useState({})
  const [wShare, setWShare] = useState(0.6)

  async function handleSubmit() {
    const payload = { groupId: group.id, amount, splitMethod, members: members.map(m=>({ userId: m.userId, share: m.share })), usageMap, wShare }
    try {
      const res = await api.post('/costs', payload)
      alert('Created cost: ' + res.data._id)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Create Cost</Typography>
      <Paper sx={{ p:2 }}>
        <TextField label="Amount" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} sx={{ mb:2 }} fullWidth />
        <TextField select label="Split Method" value={splitMethod} onChange={e=>setSplitMethod(e.target.value)} sx={{ mb:2 }} fullWidth>
          <MenuItem value="byShare">By Share</MenuItem>
          <MenuItem value="byUsage">By Usage</MenuItem>
          <MenuItem value="hybrid">Hybrid (share+usage)</MenuItem>
        </TextField>

        { (splitMethod === 'byUsage' || splitMethod === 'hybrid') && (
          <Box sx={{ mb:2 }}>
            <Typography variant="subtitle2">Enter usage (km) per member</Typography>
            {members.map(m => (
              <TextField
                key={m.userId}
                label={`${m.name} (share ${m.share}%)`}
                type="number"
                value={usageMap[m.userId]||''}
                onChange={e=>setUsageMap(prev => ({ ...prev, [m.userId]: Number(e.target.value) }))}
                sx={{ mt:1 }}
                fullWidth
              />
            ))}
          </Box>
        )}

        { splitMethod === 'hybrid' && (
          <Box sx={{ mb:2 }}>
            <TextField label="Weight for share (wShare)" type="number" value={wShare} onChange={e=>setWShare(Number(e.target.value))} fullWidth />
            <Typography variant="caption">Note: wUsage will be 1 - wShare</Typography>
          </Box>
        ) }

        <CostCalculator amount={amount} members={members} splitMethod={splitMethod} usageMap={usageMap} wShare={wShare} />

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleSubmit}>Create Cost</Button>
        </Box>
      </Paper>
    </Box>
  )
}