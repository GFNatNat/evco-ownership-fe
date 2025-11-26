import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setLoading(false);
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
      // optionally refresh user
      await fetchMe();
      return res.data;
    }
    throw new Error("Login failed");
  };

  const register = async (payload) => {
    // payload: { name, email, password, ownerPercent, documents: { idFile, licenseFile } }
    // Use separate endpoint for file upload if backend requires multipart
    // Here we call /auth/register with FormData
    const form = new FormData();
    Object.keys(payload).forEach((k) => {
      if (!payload[k]) return;
      if (k === "documents") {
        if (payload.documents.idFile)
          form.append("idFile", payload.documents.idFile);
        if (payload.documents.licenseFile)
          form.append("licenseFile", payload.documents.licenseFile);
      } else {
        form.append(k, payload[k]);
      }
    });
    const res = await api.post("/auth/register", form, {
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

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, fetchMe }}
    >
      {children}
    </AuthContext.Provider>
  );
};
