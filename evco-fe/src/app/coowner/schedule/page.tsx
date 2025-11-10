'use client';
import Topbar from '@/components/Topbar';
import SideNav from '@/components/SideNav';
import ScheduleTable from '@/components/ScheduleTable';

export default function CoownerSchedule() {
  return (
    <>
      <Topbar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-3">Lịch sử dụng xe</h3>
          <ScheduleTable />
        </main>
      </div>
    </>
  );
}
