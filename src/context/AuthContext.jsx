import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Khi token thay đổi → tự cập nhật vào axiosClient
  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete axiosClient.defaults.headers.Authorization;
    }
  }, [token]);

  // ✅ Hàm login
  // AuthContext.jsx (only the login function body changed)
const login = async ({ email, password }) => {
  setLoading(true);
  try {
    const payload = { email, password }; // <-- send Email as backend requires
    console.log('[LOGIN] baseURL:', axiosClient.defaults.baseURL);
    console.log('[LOGIN] POST /Auth/login payload:', payload);

    const res = await authApi.login(payload);
    const d = res?.data ?? {};

    const t =
      d.token || d.accessToken || d.jwt ||
      d.data?.accessToken || d.data?.token || d.result?.token || '';

    if (!t) throw new Error('Không nhận được token từ API');

    const r =
      d.role || d.user?.role || d.data?.role || d.result?.role || 'CoOwner';

    localStorage.setItem('accessToken', t);
    localStorage.setItem('role', r);
    setToken(t);
    setRole(r);
    setUser({ email, role: r });

    return { ok: true, role: r };
  } catch (err) {
    console.error('Login error:', err);
    const data = err?.response?.data;
    const msg =
      (typeof data === 'string' && data) ||
      data?.message ||
      JSON.stringify(data) ||
      err.message ||
      'Đăng nhập thất bại';
    return { ok: false, error: msg };
  } finally {
    setLoading(false);
  }
};


  // ✅ Hàm register
  const register = async ({ email, password, firstName, lastName, confirmPassword }) => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        return { ok: false, error: 'Mật khẩu xác nhận không khớp' };
      }

      const payload = {
        email,
        password,
        firstName,
        lastName,
        confirmPassword
      };

      const res = await authApi.register(payload);
      const d = res?.data || {};

      // Successful registration - don't auto-login
      return { ok: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
    } catch (err) {
      console.error('Register error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.Password?.[0] ||
        JSON.stringify(err?.response?.data) ||
        err.message ||
        'Đăng ký thất bại';
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng xuất
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    setToken('');
    setRole('');
    setUser(null);
  };

  // ✅ Kiểm tra đăng nhập khi tải trang
  useEffect(() => {
    const t = localStorage.getItem('accessToken');
    if (t) {
      setToken(t);
      axiosClient.defaults.headers.Authorization = `Bearer ${t}`;
    }
    const r = localStorage.getItem('role');
    if (r) setRole(r);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        loading,
        login,
        register,
        logout,
        setUser,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
