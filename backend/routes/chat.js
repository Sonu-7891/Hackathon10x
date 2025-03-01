import express from "express";
import Chat from "../models/chat.js";
import Message from "../models/Message.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Create a new chat
router.post("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  const chat = new Chat({ users: [req.user, userId] });
  await chat.save();
  res.json(chat);
});

// Fetch user chats
router.get("/", authMiddleware, async (req, res) => {
  const chats = await Chat.find({ users: req.user }).populate("users", "name");
  res.json(chats);
});

// Send a message
router.post("/message", authMiddleware, async (req, res) => {
  const { chatId, content, file } = req.body;
  const message = new Message({
    chat: chatId,
    sender: req.user,
    content,
    file,
  });
  await message.save();
  res.json(message);
});

export default router;
