import { useEffect, useState } from "react";
import costApi from "../../api/costApi";
import { Card, CardContent, Typography } from "@mui/material";

export default function Costs() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    costApi.history().then((res) => setHistory(res.data));
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4">Cost History</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {history.map((c) => (
          <Card key={c._id} className="shadow">
            <CardContent>
              <Typography variant="h6">{c.title}</Typography>
              <Typography className="text-gray-600">
                Amount: ${c.amount}
              </Typography>
              <Typography className="text-gray-600">Date: {c.date}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
