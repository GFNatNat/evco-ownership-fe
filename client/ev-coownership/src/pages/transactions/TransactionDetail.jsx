import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API: GET /api/transactions/:id
    const mock = {
      id: id,
      payer: "Alice",
      totalCost: 260,
      date: "2024-03-10",
      members: [
        { name: "Alice", share: 100 },
        { name: "Bob", share: 80 },
        { name: "Chris", share: 80 },
      ],
      description: "Monthly battery charging + inside cleaning",
    };
    setTransaction(mock);
  }, [id]);

  if (!transaction) return <div className="p-6">Loading...</div>;

  const totalShares = transaction.members.reduce((acc, m) => acc + m.share, 0);

  return (
    <div className="p-6 animate-fadeIn">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transaction Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Top Info */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Transaction ID</p>
              <p className="font-semibold">{transaction.id}</p>
            </div>

            <Badge className="text-sm px-3 py-1">Completed</Badge>
          </div>

          <Separator />

          {/* Summary */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Total Cost</p>
              <p className="text-xl font-bold">${transaction.totalCost}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Payer</p>
              <p className="text-lg font-semibold">{transaction.payer}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-medium">{transaction.date}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Description</p>
              <p className="font-medium">{transaction.description}</p>
            </div>
          </div>

          <Separator />

          {/* Member Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Cost Split</h3>

            <div className="space-y-3">
              {transaction.members.map((m, index) => {
                const percent = ((m.share / totalShares) * 100).toFixed(1);
                const amount = ((m.share / totalShares) * transaction.totalCost).toFixed(2);

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-gray-500 text-sm">
                        Share: {m.share} ({percent}%)
                      </p>
                    </div>

                    <p className="text-lg font-bold">${amount}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 flex justify-end">
            <Button variant="outline" className="px-6">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
