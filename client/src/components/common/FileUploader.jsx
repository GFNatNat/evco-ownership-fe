import { useState } from "react";
import { Button } from "@mui/material";

export function FileUploader({ onChange, accept = "image/*" }) {
  const [fileName, setFileName] = useState("");

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    onChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept={accept}
        className="hidden"
        id="upload-input"
        onChange={handleSelect}
      />
      <label htmlFor="upload-input">
        <Button variant="contained" component="span" fullWidth>
          Upload File
        </Button>
      </label>
      {fileName && (
        <p className="text-sm text-gray-600">Selected: {fileName}</p>
      )}
    </div>
  );
}
