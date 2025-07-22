import express from "express";
import { User } from "../model/UserProfileSchema.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bag: user.bag,
      favorites: user.favorites,
      listed: user.listed,
    });
  } catch (err) {
    console.error("Error in /profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
