import { FileUploader } from "../common/FileUploader";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";

export function IdentityVerificationForm({ onSubmit }) {
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ front, back });
  };

  return (
    <Card className="max-w-lg mx-auto shadow-xl p-4">
      <CardContent className="flex flex-col gap-4">
        <Typography variant="h6" className="text-center">
          Verify Identity (CCCD)
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FileUploader onChange={setFront} />
          <FileUploader onChange={setBack} />
          <Button type="submit" variant="contained" fullWidth>
            Submit Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
