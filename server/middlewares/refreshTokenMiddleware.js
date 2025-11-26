import jwt from "jsonwebtoken";
import User from "../models/User.js";
import env from "../config/env.js";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES || "15m" }
  );

  const refreshToken = jwt.sign({ id: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES || "7d",
  });

  return { accessToken, refreshToken };
};

export const refreshTokenMiddleware = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const tokens = generateTokens(user);
    return res.json(tokens);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};
