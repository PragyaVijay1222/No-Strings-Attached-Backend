import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { Order } from "../model/OrderSchema.js";
import { User } from "../model/UserProfileSchema.js";
import { Product } from "../model/ProductDetailsSchema.js";
import { sendConfirmationEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/place", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const bag = req.user.bag || [];

    if (bag.length === 0) {
      return res.status(400).json({ message: "Bag is empty" });
    }

    const products = await Product.find({ _id: { $in: bag }, isSold: false });

    if (products.length === 0) {
      return res.status(400).json({ message: "All products are already sold" });
    }

    const sellers = await User.find({ _id: { $in: products.map(p => p.sellerId) } });
    const sellersMap = Object.fromEntries(sellers.map(u => [u._id.toString(), u.name]));

    let orderTotal = 0;
    const orderItems = [];

    for (const product of products) {
      orderTotal += product.cost;

      product.isSold = true;
      await product.save();

      await User.findByIdAndUpdate(product.sellerId, {
        $addToSet: { sold: product._id.toString() },
      });

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        sellerName: sellersMap[product.sellerId.toString()] || "Unknown",
        cost: product.cost,
      });
    }

    const user = await User.findById(userId);
    user.bought.push(...products.map(p => p._id.toString()));
    user.bag = [];
    await user.save();

    const newOrder = await Order.create({
      userId,
      products: orderItems,
      total: orderTotal,
    });

    await sendConfirmationEmail(
  user.email,
    "Your Order Confirmation - No Strings Attached",
    `<h2>Thank you for your purchase, ${user.name}!</h2>
    <p>Your order has been confirmed. Here's a summary:</p>
   <ul>
     ${products.map(p => `<li>${p.name} - ₹${p.cost}</li>`).join("")}
   </ul>
   <p>Total: ₹${orderTotal}</p>
   <p>We'll update you once it's shipped!</p>`
);

    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
