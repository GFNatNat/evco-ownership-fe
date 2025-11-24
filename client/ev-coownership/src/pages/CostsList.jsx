import React, { useEffect, useState } from 'react'
import api from '../api/api'
import PayModal from '../components/PayModal'


export default function CostsList(){
const [costs, setCosts] = useState(null) // null = loading
const [selected, setSelected] = useState(null)


useEffect(()=>{ fetchCosts() }, [])
async function fetchCosts(){ setCosts(null); try{ const res = await api.get('/costs'); setCosts(res.data) }catch(e){ console.error(e); setCosts([]) } }


return (
<Box>
<Typography variant="h4" gutterBottom>Costs</Typography>
<Paper>
{costs === null ? (
<Box p={2}>
<Skeleton variant="rectangular" height={40} />
<Skeleton variant="rectangular" height={40} sx={{ mt:1 }} />
<Skeleton variant="rectangular" height={40} sx={{ mt:1 }} />
</Box>
) : (
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
<TableRow key={c._id} hover>
<TableCell sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.groupId}</TableCell>
<TableCell>{c.type}</TableCell>
<TableCell align="right">{c.amount.toLocaleString()}</TableCell>
<TableCell>{c.status}</TableCell>
<TableCell align="right">
{c.status === 'pending' && <Button size="small" onClick={async ()=>{ await api.post(`/costs/${c._id}/approve`); fetchCosts() }}>Approve</Button>}
<Button size="small" onClick={()=>setSelected(c)}>Pay</Button>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
)}
</Paper>


{selected && <PayModal cost={selected} onClose={()=>{ setSelected(null); fetchCosts() }} />}
</Box>
)
}