import express from "express";
import { Order } from "../models/OrderSchema.js"; 
const router = express.Router();

router.post("/placeOrder", async (req, res) => {
  const { userId, products, totalCost, upiUsed } = req.body;

  try {
    const order = new Order({
      userId,
      products,
      totalCost,
      upiUsed,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

export default router;
