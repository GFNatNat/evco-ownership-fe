/* eslint-disable @typescript-eslint/no-explicit-any */
// CSV export
export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(","),
    ...data.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// PDF export (simple, text-based)
export async function exportToPDF(data: any[], filename: string) {
  if (typeof window === "undefined") return;
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Lịch sử thanh toán", 14, 15);
  doc.setFontSize(10);

  const keys = Object.keys(data[0] || {});
  let y = 25;
  data.forEach((row, i) => {
    const line = keys.map((k) => row[k]).join(" | ");
    doc.text(line, 10, y);
    y += 8;
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });

  doc.save(filename);
}
