"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Sạc điện", value: 42000000 },
  { name: "Bảo dưỡng", value: 18000000 },
  { name: "Bảo hiểm", value: 12000000 },
  { name: "Vệ sinh", value: 8000000 },
];

const COLORS = ["#06b6d4", "#f59e0b", "#ef4444", "#10b981"];

export default function CostBreakdownPie() {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl text-white">
      <h3 className="text-lg font-semibold text-cyan-400 mb-2">Phân bổ chi phí</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString() + "₫"} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
