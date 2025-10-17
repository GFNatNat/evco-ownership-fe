import React from 'react';
import { Button } from '@mui/material';

export default function FileUploadField({ onFile }) {
  const ref = React.useRef();
  return (
    <div>
      <input ref={ref} type="file" hidden onChange={(e)=>onFile?.(e.target.files?.[0])} />
      <Button variant="outlined" onClick={()=>ref.current?.click()}>Chọn file</Button>
    </div>
  );
}