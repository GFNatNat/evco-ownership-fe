export type Role = 'Guest' | 'User' | 'CoOwner' | 'Staff' | 'Admin';

export const canAccess = (role: Role, section: 'USER'|'COOWNER'|'STAFF'|'ADMIN') => {
  if (section === 'USER') return ['User','CoOwner','Staff','Admin'].includes(role);
  if (section === 'COOWNER') return ['CoOwner','Staff','Admin'].includes(role);
  if (section === 'STAFF') return ['Staff','Admin'].includes(role);
  if (section === 'ADMIN') return ['Admin'].includes(role);
  return false;
};
