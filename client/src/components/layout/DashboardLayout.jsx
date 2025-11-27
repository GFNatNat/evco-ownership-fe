import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Navbar onToggleSidebar={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 p-6 mt-16 bg-gray-50">{children}</main>
    </div>
  );
}
