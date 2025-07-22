import express from "express";
import { User } from "../model/UserProfileSchema.js";

const router = express.Router();

router.post("/addToBag", async (req, res) => {
  const { userId, productId } = req.body;
  await User.findByIdAndUpdate(userId, { $addToSet: { bag: productId } });
  res.sendStatus(200);
});

router.post("/removeFromBag", async (req, res) => {
  const { userId, productId } = req.body;
  await User.findByIdAndUpdate(userId, { $pull: { bag: productId } });
  res.sendStatus(200);
});


router.post("/addFavorite", async (req, res) => {
  const { userId, productId } = req.body;
  await User.findByIdAndUpdate(userId, { $addToSet: { favorites: productId } });
  res.sendStatus(200);
});

router.post("/removeFavorite", async (req, res) => {
  const { userId, productId } = req.body;
  await User.findByIdAndUpdate(userId, { $pull: { favorites: productId } });
  res.sendStatus(200);
});

export default router;