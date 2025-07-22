import express from 'express';
import { Product } from "../model/ProductDetailsSchema.js";
import { authenticateUser } from "../middleware/auth.js";
import { User } from "../model/UserProfileSchema.js"
const router = express.Router();

router.post("/sell",authenticateUser, async (req, res) => {
  try {
    const {
      name,
      description,
      material,
      old,
      cost,
      styleFit,
      type,
      size,
      email,
      image,
      upi
    } = req.body;

    const sellerId = req.user?._id; 

    if (!sellerId) {
      return res.status(401).json({ message: "Unauthorized: sellerId missing" });
    }

    const newProduct = await Product.create({
      name,
      description,
      material,
      old,
      cost,
      styleFit,
      type,
      size,
      email,
      image,
      upi,
      sellerId 
    });

    await User.findByIdAndUpdate(
      sellerId,
      { $push: { listed: newProduct._id.toString() } },
      { new: true }
    );

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error("Sell route error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/my-listings", authenticateUser, async (req, res) => {
  try {
    const userId = req.user?._id;
    const products = await Product.find({ sellerId: userId });
    res.status(200).json(products);
  } catch (err) {
    console.error("My listings fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
