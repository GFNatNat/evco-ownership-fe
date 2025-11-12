/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Select, MenuItem, Box, Button } from "@mui/material";
import { paymentsApi } from "@/app/(private)/payments/api/paymentsApi";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

export default function FinanceGroupSummary() {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/groups/my");
        if (!r.ok) return;
        const g = await r.json();
        setGroups(g);
        if (g.length) setGroupId(g[0].id);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      try {
        const s = await paymentsApi.getGroupFinance(groupId);
        setSummary(s);
      } catch (e) {
        console.error("load summary", e);
      }
    })();
  }, [groupId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="text-cyan-400 font-semibold">Tổng quan tài chính nhóm</Typography>
        <Select value={groupId ?? ""} onChange={(e) => setGroupId(Number(e.target.value))} size="small">
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
          ))}
        </Select>
      </div>

      {!summary ? (
        <Typography className="text-gray-400">Không có dữ liệu</Typography>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-neutral-900 text-white">
            <CardContent>
              <Typography color="gray">Số dư quỹ</Typography>
              <Typography variant="h4" className="text-cyan-400 font-bold">{summary.balance.toLocaleString()}₫</Typography>
              <Typography color="gray" className="mt-2">Quỹ bảo dưỡng: {summary.maintenanceReserve.toLocaleString()}₫</Typography>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 text-white col-span-2">
            <CardContent>
              <Typography color="gray">Phân bổ chi phí</Typography>
              <Box style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={summary.breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {summary.breakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => v.toLocaleString() + "₫"} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <div className="mt-3 flex gap-2 flex-wrap">
                {summary.recentInvoices?.map((inv: any) => (
                  <Button key={inv.id} variant="outlined" size="small">{inv.id} • {inv.total.toLocaleString()}₫</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
