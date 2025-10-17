import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import reportApi from '../../api/reportApi';
export default function Reports(){
  const [txt, setTxt] = React.useState('');
  React.useEffect(()=>{(async()=>{
    try {
      const r = await reportApi.financial({ period: 'month' });
      setTxt(JSON.stringify(r.data));
    } catch(e) { setTxt(String(e?.message || e)); }
  })();},[]);
  return (<Card><CardContent><Typography variant="h5" sx={{ mb: 2 }}>Báo cáo tài chính</Typography><pre>{txt}</pre></CardContent></Card>);
}