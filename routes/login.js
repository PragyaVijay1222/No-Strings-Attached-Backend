import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/UserProfileSchema.js";
import { rateLimit } from "express-rate-limit";

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

const limiter = rateLimit({
  windowMs: 5 * 1000,
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

router.post("/login", limiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: "Login successful", userId: existingUser._id });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/auth-check", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ message: "Authenticated", userId: decoded.id });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

export default router;
