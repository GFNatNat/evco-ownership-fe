import React from 'react';
import { Typography, Stack, TextField, Button, Card, CardContent } from '@mui/material';
import coOwnerApi from '../../api/coOwnerApi';
import FileUploadField from '../../components/common/FileUploadField';

export default function AccountOwnership() {
  const [cccdId, setCccdId] = React.useState('');
  const [licenseId, setLicenseId] = React.useState('');
  const [eligibilityInput, setEligibilityInput] = React.useState({ portions: [{ name: 'A', percent: 40 }, { name: 'B', percent: 30 }, { name: 'C', percent: 30 }] });
  const [msg, setMsg] = React.useState('');
  const [error, setError] = React.useState('');

  const onUpload = async (file) => {
    setMsg(''); setError('');
    const fd = new FormData(); fd.append('file', file);
    try {
      await coOwnerApi.file.upload(fd);
      setMsg('Upload thành công');
    } catch (e) { setError(e?.response?.data || e.message); }
  };

  const verify = async () => {
    setMsg(''); setError('');
    try {
      await coOwnerApi.license.verify({ licenseId });
      setMsg('Đã gửi yêu cầu xác thực giấy phép');
    } catch (e) { setError(e?.response?.data || e.message); }
  };

  const checkExist = async () => {
    setMsg(''); setError('');
    try {
      // demo: tái dùng verify-license theo mô tả, tùy backend có /check-exist ở Auth
      // bạn có thể chuyển sang authApi.checkExist nếu API có sẵn
      setMsg('Đã kiểm tra tồn tại (placeholder)');
    } catch (e) { setError(e?.response?.data || e.message); }
  };

  const checkEligibility = async () => {
    setMsg(''); setError('');
    try {
      await coOwnerApi.eligibility(eligibilityInput);
      setMsg('Kiểm tra tỷ lệ sở hữu OK (placeholder)');
    } catch (e) { setError(e?.response?.data || e.message); }
  };

  return (
    <Card><CardContent>
      <Typography variant="h5" sx={{ mb: 2 }}>Tài khoản & Quyền sở hữu</Typography>
      <Stack spacing={2}>
        <FileUploadField onFile={onUpload} />
        <TextField label="CCCD/CMND" value={cccdId} onChange={(e)=>setCccdId(e.target.value)} />
        <TextField label="Giấy phép lái xe" value={licenseId} onChange={(e)=>setLicenseId(e.target.value)} />
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={verify}>Xác thực GPLX</Button>
          <Button variant="outlined" onClick={checkExist}>Kiểm tra tồn tại</Button>
        </Stack>
        <Button variant="contained" onClick={checkEligibility}>Kiểm tra tỉ lệ sở hữu</Button>
        {msg && <Typography color="primary">{msg}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </CardContent></Card>
  );
}