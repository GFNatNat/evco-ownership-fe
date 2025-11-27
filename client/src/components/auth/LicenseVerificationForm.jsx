import { FileUploader } from "../common/FileUploader";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";

export function LicenseVerificationForm({ onSubmit }) {
  const [license, setLicense] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ license });
  };

  return (
    <Card className="max-w-lg mx-auto shadow-xl p-4">
      <CardContent className="flex flex-col gap-4">
        <Typography variant="h6" className="text-center">
          Upload Driver License
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FileUploader onChange={setLicense} />
          <Button type="submit" variant="contained" fullWidth>
            Upload
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
