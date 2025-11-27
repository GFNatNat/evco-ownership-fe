import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

export default function DisputeManagement() {
  const [disputes, setDisputes] = useState([]);

  const load = async () => {
    const res = await adminApi.getDisputes();
    setDisputes(res.data || []);
  };

  useEffect(() => load(), []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Dispute Management
      </Typography>
      <Grid container spacing={3}>
        {disputes.map((d) => (
          <Grid item xs={12} md={4} key={d._id}>
            <Card className="shadow p-4">
              <CardContent>
                <Typography variant="h6">{d.title}</Typography>
                <Typography>Status: {d.status}</Typography>
                <Button
                  href={`/admin/disputes/${d._id}`}
                  className="mt-3"
                  variant="outlined"
                >
                  Resolve
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
