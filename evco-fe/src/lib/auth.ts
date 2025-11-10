import jwtDecode from 'jwt-decode';
export type Decoded = { sub: string; email?: string; role?: string; exp?: number; [k: string]: any };
export function decodeRole(token?: string): 'Guest'|'User'|'CoOwner'|'Staff'|'Admin' {
  if (!token) return 'Guest';
  try {
    const d = jwtDecode<Decoded>(token);
    const r = (d.role || d['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '').toLowerCase();
    if (r.includes('admin')) return 'Admin';
    if (r.includes('staff')) return 'Staff';
    if (r.includes('coowner') || r.includes('co-owner')) return 'CoOwner';
    if (r.includes('user')) return 'User';
    return 'User';
  } catch { return 'Guest'; }
}
