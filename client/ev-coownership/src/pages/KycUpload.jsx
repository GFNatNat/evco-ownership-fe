import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import api from '../lib/api/axiosClient';

export default function KycUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert('Choose file');
    const fd = new FormData();
    fd.append('file', file);
    setLoading(true);
    try {
      const r = await api.post('/fileUpload/kyc', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUrl(r.data.url);
      alert('Uploaded');
    } catch (e) {
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5">KYC Upload</Typography>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} />
        <Button type="submit" variant="contained" sx={{ ml: 2 }} disabled={loading}>Upload</Button>
      </form>
      {url && <Box mt={2}><Typography>Uploaded: <a href={url} target="_blank" rel="noreferrer">{url}</a></Typography></Box>}
    </Box>
  );
}
