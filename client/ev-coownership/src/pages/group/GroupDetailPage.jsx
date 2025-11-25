import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function GroupDetailPage() {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const mock = {
      id: "GR001",
      name: "Co-owner Group A",
      carModel: "VinFast VF e34",
      members: [
        { name: "Alice", role: "Admin", ownership: "40%" },
        { name: "Bob", role: "Member", ownership: "30%" },
        { name: "Chris", role: "Member", ownership: "30%" },
      ],
      fundBalance: 540,
    };
    setGroup(mock);
  }, []);

  if (!group) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 animate-fadeIn">
      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Group: {group.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-gray-700">
            <p><strong>Group ID:</strong> {group.id}</p>
            <p><strong>Car Model:</strong> {group.carModel}</p>
            <p><strong>Shared Fund Balance:</strong> ${group.fundBalance}</p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Members</h3>

            <div className="space-y-3">
              {group.members.map((m, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-xl shadow-sm flex justify-between">
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-gray-500 text-sm">Role: {m.role}</p>
                  </div>

                  <p className="text-lg font-bold">{m.ownership}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Manage Members</Button>
            <Button>View Transactions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
