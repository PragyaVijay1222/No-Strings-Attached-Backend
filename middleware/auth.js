import jwt from "jsonwebtoken";
import { User } from "../model/UserProfileSchema.js";

export const authenticateUser = async (req, res, next) => {

  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id || decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};