import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    userApi.me().then((res) => setProfile(res.data));
  }, []);

  const handleUpdate = async () => {
    await userApi.updateMe(profile);
    setEdit(false);
  };

  if (!profile) return null;

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto shadow-lg p-4">
        <CardContent>
          <Typography variant="h4">My Profile</Typography>

          <div className="flex flex-col gap-4 mt-4">
            <TextField
              label="Full Name"
              value={profile.name}
              disabled={!edit}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <TextField label="Email" value={profile.email} disabled />

            {!edit ? (
              <Button variant="contained" onClick={() => setEdit(true)}>
                Edit
              </Button>
            ) : (
              <Button variant="contained" onClick={handleUpdate}>
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
