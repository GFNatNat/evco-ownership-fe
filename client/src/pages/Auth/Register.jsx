import React, { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ownerPercent, setOwnerPercent] = useState(0);
  const [idFile, setIdFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!idFile || !licenseFile)
      return alert("Vui lòng upload CMND/CCCD và GPLX");
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        ownerPercent,
        documents: { idFile, licenseFile },
      });
      alert("Đăng ký thành công. Vui lòng kiểm tra email để xác thực nếu cần.");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2} display="flex" justifyContent="center">
      <Paper sx={{ p: 3, width: 680 }}>
        <Typography variant="h6" mb={2}>
          Đăng ký tài khoản
        </Typography>
        <form onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Họ và tên"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tỷ lệ sở hữu (%)"
                type="number"
                fullWidth
                value={ownerPercent}
                onChange={(e) => setOwnerPercent(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel sx={{ mb: 1 }}>CMND/CCCD (ảnh/PDF)</InputLabel>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setIdFile(e.target.files[0])}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ mb: 1 }}>Giấy phép lái xe (ảnh/PDF)</InputLabel>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setLicenseFile(e.target.files[0])}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={loading}>
                Đăng ký
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
