import express from "express";
import mongoose from "mongoose";
import { Message } from "../model/Message.js";
import { Product } from "../model/ProductDetailsSchema.js";

const router = express.Router();

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: -1 });

    const chatThreads = {};
    console.log("Fetched messages:", messages.length);
for (const msg of messages) {
  const rawProductId = msg.productId;
  const rawReceiverId = msg.receiverId;

  if (!mongoose.Types.ObjectId.isValid(rawProductId)) {
    console.warn(`⚠️ Skipping message ${msg._id} — invalid productId: ${rawProductId}`);
    continue;
  }

  const key = `${msg.productId}-${msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString()}`;
  console.log("Processing message:", msg._id, rawProductId);

  if (!chatThreads[key]) {
    let productName = "Product";

    try {
      const product = await Product.findById(rawProductId);
      if (product?.name) productName = product.name;
      else console.warn(`⚠️ Product not found for ID: ${rawProductId}`);
    } catch (err) {
      console.error("Failed to fetch product:", err.message);
    }

    chatThreads[key] = {
      _id: key,
      productId: rawProductId,
      sellerId: rawReceiverId,
      productName,
      lastMessage: msg.content
    };
  }
}



    res.json(Object.values(chatThreads));
  } catch (err) {
    console.error("Chat thread fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:productId/:userId", async (req, res) => {
  const { productId, userId } = req.params;

  try {
    const messages = await Message.find({
      productId,
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


export default router;
