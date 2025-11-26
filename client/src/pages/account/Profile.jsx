import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import api from "../../api/axiosClient";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
} from "@mui/material";

export default function Profile() {
  const { user, fetchMe } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", ownerPercent: 0 });

  useEffect(() => {
    if (user)
      setForm({
        name: user.name || "",
        email: user.email || "",
        ownerPercent: user.ownerPercent || 0,
      });
  }, [user]);

  const save = async () => {
    try {
      await api.put("/users/me", {
        name: form.name,
        ownerPercent: form.ownerPercent,
      });
      await fetchMe();
      setEditing(false);
      alert("Cập nhật thành công");
    } catch (e) {
      alert("Lỗi khi cập nhật");
    }
  };

  const uploadDoc = async (file, key) => {
    const fd = new FormData();
    fd.append("file", file);
    try {
      await api.post(`/users/me/upload-${key}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchMe();
      alert("Upload thành công");
    } catch (e) {
      alert("Upload thất bại");
    }
  };

  if (!user)
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );

  return (
    <Box p={2}>
      <Typography variant="h5">Tài khoản của tôi</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Thông tin cơ bản</Typography>
            <TextField
              label="Họ và tên"
              fullWidth
              sx={{ mt: 1 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!editing}
            />
            <TextField
              label="Email"
              fullWidth
              sx={{ mt: 1 }}
              value={form.email}
              disabled
            />
            <TextField
              label="Tỷ lệ sở hữu (%)"
              fullWidth
              sx={{ mt: 1 }}
              value={form.ownerPercent}
              onChange={(e) =>
                setForm({ ...form, ownerPercent: e.target.value })
              }
              disabled={!editing}
            />
            <Box sx={{ mt: 2 }}>
              {editing ? (
                <>
                  <Button variant="contained" onClick={save} sx={{ mr: 1 }}>
                    Lưu
                  </Button>
                  <Button variant="outlined" onClick={() => setEditing(false)}>
                    Hủy
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setEditing(true)}>
                  Chỉnh sửa
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tài liệu</Typography>
            <Box sx={{ mt: 1 }}>
              <div>
                CMND/CCCD:{" "}
                {user.documents?.idFile ? (
                  <Link href={user.documents.idFile} target="_blank">
                    Xem
                  </Link>
                ) : (
                  "Chưa upload"
                )}
              </div>
              <div>
                GPLX:{" "}
                {user.documents?.licenseFile ? (
                  <Link href={user.documents.licenseFile} target="_blank">
                    Xem
                  </Link>
                ) : (
                  "Chưa upload"
                )}
              </div>
              <Box sx={{ mt: 1 }}>
                <input
                  type="file"
                  onChange={(e) => uploadDoc(e.target.files[0], "id")}
                />
                <input
                  type="file"
                  onChange={(e) => uploadDoc(e.target.files[0], "license")}
                />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">Hợp đồng đồng sở hữu</Typography>
            {user.contracts?.length ? (
              user.contracts.map((c) => (
                <div key={c._id}>
                  <a href={c.url} target="_blank">
                    {c.title || "Contract"}
                  </a>
                </div>
              ))
            ) : (
              <div>Chưa có hợp đồng</div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
