import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { mockGroups } from '../mocks/mockData'
import { Link as RouterLink } from 'react-router-dom'

export default function Groups() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Groups</Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2,1fr)' }} gap={2}>
        {mockGroups.map(g => (
          <Card key={g.id}>
            <CardContent>
              <Typography variant="h6">{g.name}</Typography>
              <Typography variant="body2">Vehicle: {g.vehicle.model} — {g.vehicle.plate}</Typography>
              <Box mt={2}>
                <Button component={RouterLink} to={`/groups/${g.id}`} variant="outlined" size="small">Open</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}