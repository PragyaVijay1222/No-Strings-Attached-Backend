import express from "express";
import { Product } from "../model/ProductDetailsSchema.js";

const router = express.Router();

router.get("/female-fit", async (req, res) => {
  const data = await Product.find({
  styleFit: { $regex: "^female fit$", $options: "i" },
  type: /clothing/i
});
  res.json(data);
});

router.get("/male-fit", async (req, res) => {
  const data = await Product.find({
  styleFit: { $regex: "^male fit$", $options: "i" },
  type: /clothing/i
});
  res.json(data);
});

router.get("/accessories", async (req, res) => {
  const data = await Product.find({ type: /accessories/i });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;