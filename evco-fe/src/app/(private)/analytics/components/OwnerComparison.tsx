"use client";
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell } from "@mui/material";

const owners = [
  { name: "Nguyễn A", share: 40, usedPercent: 45 },
  { name: "Trần B", share: 30, usedPercent: 25 },
  { name: "Lê C", share: 30, usedPercent: 30 },
];

export default function OwnerComparison() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">So sánh mức sử dụng vs sở hữu</h3>
      <Card className="bg-neutral-900 text-white">
        <CardContent>
          <Table>
            <TableBody>
              {owners.map((o) => (
                <TableRow key={o.name}>
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{o.share}% (sở hữu)</TableCell>
                  <TableCell>{o.usedPercent}% (sử dụng)</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
