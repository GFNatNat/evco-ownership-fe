import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // TODO: Replace with real API call: /api/transactions
    const mock = [
      {
        id: "tx001",
        payer: "Alice",
        totalCost: 260,
        members: ["Alice", "Bob", "Chris"],
        date: "2024-03-10",
      },
      {
        id: "tx002",
        payer: "David",
        totalCost: 120,
        members: ["David", "Emma"],
        date: "2024-03-07",
      },
    ];
    setTransactions(mock);
  }, []);

  return (
    <div className="p-6 animate-fadeIn">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.payer}</TableCell>
                  <TableCell>${t.totalCost}</TableCell>
                  <TableCell>{t.members.join(", ")}</TableCell>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
