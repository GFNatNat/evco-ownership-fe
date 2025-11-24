import React, { useEffect, useState } from "react";
import { getCosts } from "../services/costService";
import { Button, Card, CardContent } from "@mui/material";
import PayModal from "../components/PayModal";

export default function CostListPage() {
  const [costs, setCosts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getCosts().then(r => setCosts(r));
  }, []);

  return (
    <>
      <h2>Costs</h2>

      {costs.map(c => (
        <Card key={c._id} sx={{ mb: 2 }}>
          <CardContent>
            <div>{c.description} — {c.total} VND</div>
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => setSelected(c)}
            >Pay / Details</Button>
          </CardContent>
        </Card>
      ))}

      {selected && (
        <PayModal
          open={true}
          cost={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}