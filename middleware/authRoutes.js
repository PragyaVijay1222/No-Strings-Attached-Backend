import express from "express";
import { authenticateUser } from "./auth.js";

const router = express.Router();

router.get("/auth-check", authenticateUser, (req, res) => {
  res.status(200).json({ message: "User is authenticated", userId: req.user._id });
});

export default router;
