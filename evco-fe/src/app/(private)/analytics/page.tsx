"use client";
import OverviewCards from "./components/OverviewCards";
import UsageChart from "./components/UsageChart";
import CostBreakdownPie from "./components/CostBreakdownPie";
import OwnerComparison from "./components/OwnerComparison";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Phân tích & Thống kê</h2>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <UsageChart />
        </div>
        <div>
          <CostBreakdownPie />
        </div>
      </div>
      <OwnerComparison />
    </div>
  );
}
