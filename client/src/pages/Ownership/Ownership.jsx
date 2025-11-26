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

export default function Ownership() {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    api
      .get("/groups/my")
      .then((r) => setGroups(r.data))
      .catch(() => {});
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Nhóm đồng sở hữu
      </Typography>
      <Grid container spacing={2}>
        {groups.map((g) => (
          <Grid item key={g._id} xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{g.name}</Typography>
                <Typography>Xe: {g.vehicle?.name || "N/A"}</Typography>
                <Typography>Thành viên: {g.members?.length || 0}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    component={Link}
                    to={`/groups/${g._id}`}
                    size="small"
                    variant="contained"
                  >
                    Quản lý
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
