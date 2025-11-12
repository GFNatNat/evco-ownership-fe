/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Stack } from "@mui/material";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

export default function ExportButtons({ data }: { data: any[] }) {
  return (
    <Stack direction="row" spacing={2} className="mt-3">
      <Button
        variant="outlined"
        onClick={() => exportToCSV(data, "payment-history.csv")}
      >
        Xuất CSV
      </Button>
      <Button
        variant="contained"
        onClick={() => exportToPDF(data, "payment-history.pdf")}
      >
        Xuất PDF
      </Button>
    </Stack>
  );
}
