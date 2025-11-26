import React from 'react'
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function VehicleCard({ vehicle }){
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{vehicle.name}</Typography>
        <Typography variant="body2">Plate: {vehicle.plate}</Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={`/vehicles/${vehicle._id}`} size="small">Open</Button>
      </CardActions>
    </Card>
  )
}
