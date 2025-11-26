import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosClient";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (e) {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      const me = await api.get("/users/me");
      setUser(me.data);
      return me.data;
    }
    throw new Error("Login failed");
  };

  const register = async (formData) => {
    // formData: FormData or object handled in axios client
    const res = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const fetchMe = async () => {
    try {
      const r = await api.get("/users/me");
      setUser(r.data);
      return r.data;
    } catch (e) {
      setUser(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}
