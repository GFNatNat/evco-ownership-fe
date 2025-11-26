import React, { useState } from "react";
import api from "../api/axiosClient";
import { Box, Button } from "@mui/material";

export default function ContractUploader({ groupId, onUploaded }) {
  const [file, setFile] = useState(null);
  const upload = async () => {
    if (!file) return alert("Chọn file");
    const fd = new FormData();
    fd.append("contract", file);
    await api.post(`/groups/${groupId}/contract`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onUploaded && onUploaded();
  };
  return (
    <Box>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button variant="contained" sx={{ ml: 1 }} onClick={upload}>
        Upload
      </Button>
    </Box>
  );
}
