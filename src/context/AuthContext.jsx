// ========================= PHÂN QUYỀN NGƯỜI DÙNG =========================
// - Backend trả về user.roles là mảng chuỗi, ví dụ: ["Admin"], ["CoOwner"], ["Staff"]
// - FE luôn lấy user.roles[0], chuẩn hóa viết hoa chữ cái đầu (Admin, Staff, CoOwner)
// - Nếu role không hợp lệ, FE mặc định là CoOwner (an toàn)
// - Role được lưu vào localStorage và state FE, dùng cho kiểm tra truy cập
// - Khi reload, FE lấy lại role từ localStorage, chuẩn hóa lại
// - Tất cả kiểm tra phân quyền đều dùng đúng format chuỗi này
// - Nếu backend/JWT trả về role khác, FE vẫn an toàn (mặc định CoOwner)
// ========================================================================
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
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const payload = {
        email,
        password,
        userName: email,
        username: email,
        userNameOrEmail: email,
      };
      const res = await authApi.login(payload);
      const d = res?.data || {};

      // Lấy token
      const t =
        d.token ||
        d.accessToken ||
        d.jwt ||
        d.data?.accessToken ||
        d.data?.token ||
        d.result?.token ||
        '';

      if (!t) throw new Error('Không nhận được token từ API');

      // Lấy user object đúng vị trí
      const userObj = d.user || d.data?.user || {};
      console.log('DEBUG: d.user =', d.user, '| d.data.user =', d.data?.user, '| userObj =', userObj, '| userObj.roles =', userObj.roles);

      // Lấy role không phân biệt hoa thường và log ra role thực tế
      const roleStrRaw = userObj.roles?.[0] || 'CoOwner';
      // Chuẩn hóa: luôn viết hoa chữ cái đầu, còn lại thường
      const capitalize = (s) => s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'CoOwner';
      let r = capitalize(roleStrRaw);
      // Nếu không phải Admin/Staff/CoOwner thì mặc định là CoOwner
      if (!['Admin', 'Staff', 'CoOwner'].includes(r)) r = 'CoOwner';
      console.log('DEBUG: roleStrRaw from API =', roleStrRaw, '| mapped FE role =', r);

      localStorage.setItem('accessToken', t);
      localStorage.setItem('role', r);
      setToken(t);
      setRole(r);
      setUser({ email: userObj.email || email, role: r });

      return { ok: true, role: r };
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
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
    let r = localStorage.getItem('role');
    // Chuẩn hóa role khi reload
    const capitalize = (s) => s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : 'CoOwner';
    r = capitalize(r);
    if (!['Admin', 'Staff', 'CoOwner'].includes(r)) r = 'CoOwner';
    if (t) {
      setToken(t);
      axiosClient.defaults.headers.Authorization = `Bearer ${t}`;
    }
    if (r) setRole(r);
    // Nếu có cả token và role thì set lại user
    if (t && r) {
      setUser({ email: '', role: r });
    }
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
