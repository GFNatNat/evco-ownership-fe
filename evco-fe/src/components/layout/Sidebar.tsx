"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Users, Wallet, Calendar, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { href: "/dashboard", icon: <Home size={20} />, label: "Tổng quan" },
  { href: "/vehicles", icon: <Car size={20} />, label: "Xe" },
  { href: "/ownerships", icon: <Users size={20} />, label: "Đồng sở hữu" },
  { href: "/schedules", icon: <Calendar size={20} />, label: "Lịch" },
  { href: "/payments", icon: <Wallet size={20} />, label: "Chi phí" },
  { href: "/analytics", icon: <BarChart3 size={20} />, label: "Phân tích" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="w-60 border-r border-neutral-800 p-4 hidden md:flex flex-col bg-neutral-900"
    >
      <h1 className="text-xl font-bold mb-8 text-cyan-400">EV Co-Ownership</h1>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors ${
                active ? "bg-neutral-800 text-cyan-400" : "text-neutral-300"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
