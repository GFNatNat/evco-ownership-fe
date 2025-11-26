import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    api
      .get("/groups/my")
      .then((r) => setGroups(r.data))
      .catch(() => {});
  }, []);

  return (
    <Box p={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Nhóm đồng sở hữu</Typography>
        <Box>
          <Button component={Link} to="/groups/create" variant="contained">
            Tạo nhóm mới
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {groups.map((g) => (
          <Grid item xs={12} md={6} lg={4} key={g._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{g.name}</Typography>
                <Typography variant="body2">
                  Xe: {g.vehicle?.name || "Chưa gán"}
                </Typography>
                <Typography variant="body2">
                  Thành viên: {g.members?.length || 0}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/groups/${g._id}`}
                    variant="outlined"
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
