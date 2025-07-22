import express from 'express';
import { Feedback } from '../model/FeedbackSchema.js';

const router = express.Router();

router.post("/feedback", async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    const newFeedback = await Feedback.create({
      name,
      email,
      feedback
    });

    res.status(201).json({ message: "Feedback submitted successfully" }); // ✅ Add this
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;