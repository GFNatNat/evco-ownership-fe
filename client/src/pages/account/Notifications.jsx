import { useEffect, useState } from "react";
import notificationApi from "../../api/notificationApi";
import { Card, CardContent, Typography } from "@mui/material";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    notificationApi.list().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4">Notifications</Typography>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {items.map((n) => (
          <Card key={n._id} className="shadow">
            <CardContent>
              <Typography className="font-bold">{n.title}</Typography>
              <Typography className="text-gray-600">{n.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
