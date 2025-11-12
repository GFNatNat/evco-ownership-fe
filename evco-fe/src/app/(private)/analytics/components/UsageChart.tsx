"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", km: 410 },
  { month: "Feb", km: 380 },
  { month: "Mar", km: 450 },
  { month: "Apr", km: 520 },
  { month: "May", km: 480 },
  { month: "Jun", km: 500 },
];

export default function UsageChart() {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl text-white">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">Quãng đường theo tháng</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#222" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="km" stroke="#06b6d4" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
