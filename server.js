import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Message } from "./model/Message.js";


import bagRoutes from "./routes/bagAndFavorites.js";
import feedbackRoutes from "./routes/feedback.js";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js";
import productRoutes from "./routes/products.js";
import sellRoutes from "./routes/sell.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import profileRoutes from "./routes/profile.js";
import authCheckRoutes from "./middleware/authRoutes.js";
import orderRoutes from "./routes/order.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://no-strings-attached-frontend.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://no-strings-attached-frontend.vercel.app"
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use(cors({ origin: ["http://localhost:5173", "https://no-strings-attached-frontend.vercel.app"], credentials: true, exposedHeaders: ['set-cookie'] }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Database connection error:", err));


app.use("/api/bag", bagRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/auth", signupRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sell", sellRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authCheckRoutes);
app.use("/api/order", orderRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", async ({ room, senderId, receiverId, productId, content }) => {
  try {

    console.log("Incoming message payload:", {
  senderId,
  receiverId,
  productId,
  content
});

    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      console.error("Invalid ObjectId format");
      return;
    }
    const message = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      productId: new mongoose.Types.ObjectId(productId),
      content
    });

    await message.save();
    console.log("Message saved to DB:", message);

    io.to(room).emit("receiveMessage", { senderId, content });
  } catch (err) {
    console.error("Failed to save message:", err.message);
  }
  });



  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));