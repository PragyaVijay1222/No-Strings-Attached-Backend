import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { User } from "../model/UserProfileSchema.js";
import { Product } from "../model/ProductDetailsSchema.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [products, favorites, bagItems] = await Promise.all([
      Product.find({ _id: { $in: user.listed } }),
      Product.find({ _id: { $in: user.favorites } }),
      Product.find({ _id: { $in: user.bag } })
    ]);
    
    res.status(200).json({
      ...user,
      products,
      favorites,
      bagItems
    });
  } catch (err) {
    console.error("Profile route error:", err.message);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});
export default router;
