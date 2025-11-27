import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();
  return user?.role || "Guest";
}
