import express from "express";
import authMiddleware from "../Middlewares/authMiddleware.js";
import upload from "../Middlewares/uploadMiddleware.js";
import Message from "../models/Message.js";

const router = express.Router();

// ✅ Send a message with text or file
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  const { chatId, content } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const message = new Message({
    chat: chatId,
    sender: req.user,
    content,
    file: fileUrl,
  });
  await message.save();

  res.json(message);
});

// ✅ Get messages from a chat
router.get("/:chatId", authMiddleware, async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId }).populate(
    "sender",
    "name"
  );
  res.json(messages);
});

export default router;
