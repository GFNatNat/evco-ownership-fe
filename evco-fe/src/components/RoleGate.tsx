/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { decodeRole } from '@/lib/auth';
import { canAccess } from '@/lib/rbac';

export default function RoleGate({ need, children }:{ need: 'USER'|'COOWNER'|'STAFF'|'ADMIN', children: ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE ?? 'accessToken');
    const r = decodeRole(token);
    setOk(canAccess(r, need));
  }, [need]);

  if (!ok) return <div className="p-6">Bạn không có quyền truy cập.</div>;
  return <>{children}</>;
}
