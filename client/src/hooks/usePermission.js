import useAuth from "./useAuth";

export default function usePermission() {
  const { user } = useAuth();

  const can = (requiredRoles = []) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return { can };
}
