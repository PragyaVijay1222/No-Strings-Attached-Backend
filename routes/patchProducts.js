import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "../model/ProductDetailsSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const products = await Product.find({ isSold: { $exists: false } });

  if (products.length === 0) {
    console.log("✅ All products already have the 'isSold' field.");
  }

  for (const product of products) {
    product.isSold = false;
    await product.save();
    console.log(`✅ Set isSold=false for product ${product._id}`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
});
