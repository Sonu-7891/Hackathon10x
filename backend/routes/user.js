import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const onlineUsers = new Set(); // Track online users

// ✅ Get user profile (including last seen status)
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    const isOnline = onlineUsers.has(req.params.userId);

    res.json({
      ...user.toObject(),
      isOnline,
      lastSeen: isOnline ? null : user.lastSeen,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Check user online status and last seen
router.get("/status/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isOnline = onlineUsers.has(req.params.userId);
  res.json({
    userId: req.params.userId,
    isOnline,
    lastSeen: isOnline ? null : user.lastSeen,
  });
});

export default router;
