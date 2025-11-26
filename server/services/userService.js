import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  return await User.create(data);
};

export const validateLogin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
};
