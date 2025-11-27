import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

export default function ContractManagement() {
  const [contracts, setContracts] = useState([]);
  const load = async () => {
    const res = await adminApi.getContract("all");
    setContracts(res.data || []);
  };

  useEffect(() => load(), []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Contract Management
      </Typography>
      <Grid container spacing={3}>
        {contracts.map((c) => (
          <Grid item xs={12} md={4} key={c._id}>
            <Card className="shadow p-4">
              <CardContent>
                <Typography variant="h6">{c.title}</Typography>
                <Typography>Status: {c.status}</Typography>
                <Button
                  href={`/admin/contracts/${c._id}`}
                  className="mt-3"
                  variant="outlined"
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
