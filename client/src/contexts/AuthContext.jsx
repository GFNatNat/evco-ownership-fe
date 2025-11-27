import { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";
import userApi from "../api/userApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await userApi.getProfile();
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await authApi.login({ email, password });

      const { user, accessToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", user.roles[0]);

      setUser(user);
      return true;
    } catch (e) {
      console.error("LOGIN FAILED:", e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}

    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
