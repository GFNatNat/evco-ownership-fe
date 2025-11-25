const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const {
  signAccess,
  createRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} = require("../helpers/token");

// register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "email and password required" });
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already registered" });
  const hashed = await bcrypt.hash(password, 10);
  const u = await User.create({
    name,
    email,
    password: hashed,
    role: role || "coowner",
  });
  res.json({ user: { id: u._id, email: u.email, name: u.name } });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const access = signAccess(u);
  const refresh = await createRefreshToken(u);
  // set httpOnly cookie for refresh token
  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: 7 * 24 * 3600 * 1000,
  });
  return res.json({
    accessToken: access,
    user: { id: u._id, name: u.name, email: u.email, role: u.role },
  });
});

// refresh
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });
  try {
    const dbToken = await verifyRefreshToken(token);
    // rotate: revoke old and issue new
    await revokeRefreshToken(token);
    const newToken = await createRefreshToken({ _id: dbToken.userId });
    // save replacement link
    const rt = await RefreshToken.findOne({ token });
    if (rt) {
      rt.replacedByToken = newToken;
      await rt.save();
    }
    const user = await User.findById(dbToken.userId);
    const access = signAccess(user);
    res.cookie("refreshToken", newToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
    });
    return res.json({ accessToken: access });
  } catch (e) {
    return res
      .status(401)
      .json({ message: e.message || "Invalid refresh token" });
  }
});

// logout single device
router.post("/logout", async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (token) {
    await revokeRefreshToken(token);
  }
  res.clearCookie("refreshToken");
  res.json({ ok: true });
});

// logout-all (user requested revoke all)
router.post("/logout-all", async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });
  await RefreshToken.updateMany({ userId }, { revoked: true });
  res.clearCookie("refreshToken");
  res.json({ ok: true });
});

module.exports = router;
