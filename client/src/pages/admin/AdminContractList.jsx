import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

export default function AdminContractList() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    adminApi.getContract("all").then((res) => setContracts(res.data || []));
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Contracts
      </Typography>
      <Grid container spacing={3}>
        {contracts.map((c) => (
          <Grid item xs={12} md={4} key={c._id}>
            <Card className="shadow p-4">
              <CardContent>
                <Typography variant="h6">{c.title}</Typography>
                <Typography>Status: {c.status}</Typography>
                <Button
                  className="mt-3"
                  variant="outlined"
                  href={`/admin/contracts/${c._id}`}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
