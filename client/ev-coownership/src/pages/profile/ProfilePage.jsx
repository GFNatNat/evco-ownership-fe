import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    licenseId: "",
  });

  useEffect(() => {
    const mock = {
      name: "Nguyen Van A",
      email: "a@example.com",
      phone: "0987654321",
      licenseId: "B1-1234567",
    };
    setProfile(mock);
  }, []);

  return (
    <div className="p-6 animate-fadeIn">
      <Card className="rounded-2xl shadow-md max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <Input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Driver License ID</label>
              <Input
                value={profile.licenseId}
                onChange={(e) =>
                  setProfile({ ...profile, licenseId: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-3 text-right">
            <Button className="px-6">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
