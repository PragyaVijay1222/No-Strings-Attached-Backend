import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../model/UserProfileSchema.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 5 * 1000,
  limit: 1,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 16);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false, 
    });

    return res.status(201).json({ message: "User created", userId: newUser._id });

  } catch (err) {
    console.error("Signup error:", err);
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
