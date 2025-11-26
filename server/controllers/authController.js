import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import env from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.REFRESH_TOKEN_SECRET;

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, roles } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already used" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      roles: roles || ["Coowner"],
    });
    const accessToken = generateAccessToken({
      id: user._id,
      roles: user.roles,
    });
    const refreshToken = generateRefreshToken({ id: user._id });
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const accessToken = generateAccessToken({
      id: user._id,
      roles: user.roles,
    });
    const refreshToken = generateRefreshToken({ id: user._id });
    res.json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Missing refreshToken" });
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    const accessToken = generateAccessToken({
      id: user._id,
      roles: user.roles,
    });
    const newRefresh = generateRefreshToken({ id: user._id });
    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  // For stateless JWT we can implement blacklist in DB/Redis; for now just respond success
  res.json({ message: "Logged out" });
};
