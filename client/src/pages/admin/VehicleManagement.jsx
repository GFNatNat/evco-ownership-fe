import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { notifySuccess, notifyError } from "../../utils/notifications";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", license: "", battery: 0 });

  const load = async () => {
    try {
      const res = await adminApi.getVehicles();
      setVehicles(res.data || []);
    } catch (err) {
      notifyError("Failed to load vehicles");
    }
  };

  useEffect(() => load(), []);

  const submit = async () => {
    try {
      await adminApi.createVehicle(form);
      notifySuccess("Vehicle created");
      setOpen(false);
      setForm({ name: "", license: "", battery: 0 });
      load();
    } catch {
      notifyError("Fail to create vehicle");
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Vehicle Management
      </Typography>
      <Button
        variant="contained"
        className="mb-4"
        onClick={() => setOpen(true)}
      >
        Add Vehicle
      </Button>

      <Grid container spacing={3}>
        {vehicles.map((v) => (
          <Grid item xs={12} md={4} key={v._id}>
            <Card className="shadow p-4">
              <CardContent>
                <Typography variant="h6">{v.name}</Typography>
                <Typography className="text-gray-600">
                  License: {v.license}
                </Typography>
                <Typography className="text-gray-600">
                  Battery: {v.battery}%
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  className="mt-2"
                  onClick={async () => {
                    await adminApi.deleteVehicle(v._id);
                    load();
                  }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Vehicle</DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="License"
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
          />
          <TextField
            label="Battery"
            type="number"
            value={form.battery}
            onChange={(e) => setForm({ ...form, battery: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
