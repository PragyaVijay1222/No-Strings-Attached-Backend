import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "../model/ProductDetailsSchema.js";
import { User } from "../model/UserProfileSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const products = await Product.find({}); 

  for (const product of products) {
    const user = await User.findOne({ email: product.email });

    if (user) {

      if (!product.sellerId) {
        product.sellerId = user._id;
        await product.save();
        console.log(`✅ Set sellerId for product ${product._id}`);
      }

      await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { listed: product._id.toString() } }
      );
      console.log(`📌 Added product ${product._id} to user ${user._id}'s listed array`);
    } else {
      console.warn(`⚠️ No user found for product ${product._id} with email ${product.email}`);
    }
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
});
