import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "info", required: true }, 
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "productInfo", required: true }, 
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "info", required: true },
      sellerName: String,
      cost: Number
    }
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);
