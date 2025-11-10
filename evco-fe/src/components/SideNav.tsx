'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { decodeRole } from '@/lib/auth';

type Role = 'Guest' | 'User' | 'CoOwner' | 'Staff' | 'Admin';

const itemsByRole: Record<Role, { href: string; label: string }[]> = {
  Guest: [],
  User: [
    { href: '/dashboard', label: 'Hồ sơ' },
  ],
  CoOwner: [
    { href: '/dashboard', label: 'Tổng quan' },
    { href: '/coowner/schedule', label: 'Lịch & đặt xe' },
    { href: '/coowner/costs', label: 'Chi phí & thanh toán' },
    { href: '/coowner/history', label: 'Lịch sử' },
    { href: '/coowner/groups', label: 'Nhóm đồng sở hữu' },
    { href: '/coowner/votes', label: 'Bỏ phiếu' },
  ],
  Staff: [
    { href: '/staff/dashboard', label: 'Tổng quan' },
    { href: '/staff/verifications', label: 'Xác minh KYC' },
    { href: '/staff/services', label: 'Dịch vụ xe' },
    { href: '/staff/disputes', label: 'Tranh chấp' },
  ],
  Admin: [
    { href: '/admin/dashboard', label: 'Tổng quan' },
    { href: '/admin/users', label: 'Người dùng' },
    { href: '/admin/licenses', label: 'Giấy phép' },
    { href: '/admin/groups', label: 'Nhóm' },
    { href: '/admin/reports', label: 'Báo cáo' },
    { href: '/admin/settings', label: 'Cài đặt' },
  ],
};

export default function SideNav() {
  const [role, setRole] = useState<Role>('Guest');
  useEffect(() => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE ?? 'accessToken');
    setRole(decodeRole(token));
  }, []);
  const items = itemsByRole[role] || [];
  if (!items.length) return null;

  return (
    <aside className="w-64 p-4 bg-white border-r">
      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <Link key={i.href} className="text-sm hover:underline" href={i.href}>{i.label}</Link>
        ))}
      </nav>
    </aside>
  );
}
