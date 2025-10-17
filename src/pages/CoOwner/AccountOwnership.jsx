import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button, Stack, Snackbar, Alert, Divider } from '@mui/material';
import ownerApi from '../../api/ownerApi';

export default function AccountOwnership() {
  const [state, setState] = React.useState({
    cccdFile: null,
    licenseFile: null,
    cccdNumber: '',
    licenseNumber: '',
    email: '',
  });
  const [eligibility, setEligibility] = React.useState([
    { name: 'A', percent: 40 },
    { name: 'B', percent: 30 },
    { name: 'C', percent: 30 },
  ]);

  const [msg, setMsg] = React.useState('');
  const [err, setErr] = React.useState('');

  const pickFile = (key) => (e) => setState(s => ({ ...s, [key]: e.target.files?.[0] || null }));

  const upload = async (fileKey) => {
    setMsg(''); setErr('');
    try {
      if (!state[fileKey]) { setErr('Chưa chọn file'); return; }
      const fd = new FormData();
      fd.append('file', state[fileKey]);
      await ownerApi.uploadFile(fd);
      setMsg('Upload thành công');
    } catch (e) {
      setErr(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e));
    }
  };

  const verifyAuth = async () => {
    setMsg(''); setErr('');
    try {
      await ownerApi.verifyLicenseAuth({ licenseId: state.licenseNumber, cccd: state.cccdNumber });
      setMsg('Đã gửi xác thực (Auth/verify-license)');
    } catch (e) { setErr(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e)); }
  };

  const verifyLicenseSvc = async () => {
    setMsg(''); setErr('');
    try {
      await ownerApi.verifyLicense({ licenseId: state.licenseNumber });
      setMsg('Đã gửi xác thực (License/verify)');
    } catch (e) { setErr(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e)); }
  };

  const checkExist = async () => {
    setMsg(''); setErr('');
    try {
      await ownerApi.checkExist({ email: state.email });
      setMsg('Kiểm tra tồn tại: OK');
    } catch (e) { setErr(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e)); }
  };

  const submitEligibility = async () => {
    setMsg(''); setErr('');
    try {
      const total = eligibility.reduce((a,b)=> a + Number(b.percent || 0), 0);
      if (total !== 100) { setErr('Tổng tỉ lệ phải bằng 100%'); return; }
      await ownerApi.eligibility({ portions: eligibility });
      setMsg('Kiểm tra tỷ lệ sở hữu: OK');
    } catch (e) { setErr(e?.response?.data ? JSON.stringify(e.response.data) : String(e.message || e)); }
  };

  const changeEligibility = (idx, key) => (e) => {
    const val = key === 'percent' ? Number(e.target.value) : e.target.value;
    setEligibility(list => list.map((it, i) => i === idx ? { ...it, [key]: val } : it));
  };

  const addHolder = () => setEligibility(list => [...list, { name: '', percent: 0 }]);
  const removeHolder = (idx) => setEligibility(list => list.filter((_, i) => i !== idx));

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Tài khoản & Quyền sở hữu</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Giấy tờ cá nhân</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Số CCCD/CMND" value={state.cccdNumber} onChange={(e)=>setState(s=>({...s, cccdNumber: e.target.value}))} />
              <Button component="label" variant="outlined">Chọn file CCCD
                <input type="file" hidden onChange={pickFile('cccdFile')} />
              </Button>
              <Button variant="contained" onClick={()=>upload('cccdFile')}>Upload CCCD</Button>
              <Divider />
              <TextField label="Số GPLX" value={state.licenseNumber} onChange={(e)=>setState(s=>({...s, licenseNumber: e.target.value}))} />
              <Button component="label" variant="outlined">Chọn file GPLX
                <input type="file" hidden onChange={pickFile('licenseFile')} />
              </Button>
              <Button variant="contained" onClick={()=>upload('licenseFile')}>Upload GPLX</Button>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={verifyAuth}>Xác thực (Auth)</Button>
                <Button variant="outlined" onClick={verifyLicenseSvc}>Xác thực (License)</Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Kiểm tra tồn tại tài khoản</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Email" value={state.email} onChange={(e)=>setState(s=>({...s, email: e.target.value}))} />
              <Button variant="contained" onClick={checkExist}>Check exist</Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1">Tỷ lệ đồng sở hữu</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {eligibility.map((it, idx) => (
                <Stack key={idx} direction="row" spacing={1}>
                  <TextField label="Tên" value={it.name} onChange={changeEligibility(idx, 'name')} />
                  <TextField type="number" label="%" value={it.percent} onChange={changeEligibility(idx, 'percent')} />
                  <Button color="error" onClick={()=>removeHolder(idx)}>Xoá</Button>
                </Stack>
              ))}
              <Button onClick={addHolder}>Thêm người</Button>
              <Button variant="contained" onClick={submitEligibility}>Xác nhận tỉ lệ</Button>
            </Stack>
          </Grid>
        </Grid>

        <Snackbar open={!!msg} autoHideDuration={3000} onClose={()=>setMsg('')}>
          <Alert severity="success" onClose={()=>setMsg('')}>{msg}</Alert>
        </Snackbar>
        <Snackbar open={!!err} autoHideDuration={6000} onClose={()=>setErr('')}>
          <Alert severity="error" onClose={()=>setErr('')} sx={{ whiteSpace: 'pre-wrap' }}>{err}</Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}