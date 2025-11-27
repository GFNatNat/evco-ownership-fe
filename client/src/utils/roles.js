export const ROLES = {
  ADMIN: "Admin",
  STAFF: "Staff",
  COOWNER: "Coowner",
};

export const hasRole = (user, roles = []) => {
  if (!user) return false;
  return roles.includes(user.role);
};
