import axios from "./axiosInstance";

export const login = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};
