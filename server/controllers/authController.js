import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import env from "../config/env.js";
import { generateResetToken } from "../utils/resetToken.js";

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

    if (!user.passwordHash)
      return res
        .status(500)
        .json({ message: "User has no passwordHash stored" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken({
      id: user._id,
      roles: user.roles,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    // ⭐ Quan trọng: đưa role ra FE
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token + hashed token
    const { resetToken, tokenHash } = generateResetToken();

    // save hashed token into DB
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // TODO: gửi email thật ở đây
    console.log("🔐 RESET LINK:", resetURL);

    res.json({
      message: "Reset password link sent to email",
      resetURL, // tạm gửi để test Postman
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Hash token để so sánh
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() }, // còn hạn
    });

    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });

    // Change password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    next(err);
  }
};
