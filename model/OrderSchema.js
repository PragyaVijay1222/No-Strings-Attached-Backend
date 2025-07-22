import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "info",
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "productInfo" },
      cost: Number,
      name: String,
      upi: String,
    }
  ],
  totalCost: Number,
  upiUsed: String,
  orderedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("orderInfo", orderSchema);
