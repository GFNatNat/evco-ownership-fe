"use client";
import AdminOverview from "./components/AdminOverview";
import GroupTable from "./components/GroupTable";
import ContractTable from "./components/ContractTable";
import CheckInOutTable from "./components/CheckInOutTable";
import FinanceSummary from "./components/FinanceSummary";
import FinanceGroupSummary from "@/app/(private)/admin/FinanceGroupSummary";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-cyan-400">
        Bảng điều khiển quản trị viên
      </h2>

      <AdminOverview />
      <GroupTable />
      <ContractTable />
      <CheckInOutTable />
      <FinanceSummary />
      <FinanceGroupSummary />
    </div>
  );
}
