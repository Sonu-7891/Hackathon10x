import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const router = express.Router();

// ✅ Create a new group
router.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const newGroup = new Group({
    name,
    description,
    admin: req.user,
    members: [req.user],
  });
  await newGroup.save();
  res.json(newGroup);
});

// ✅ Get all groups
router.get("/", authMiddleware, async (req, res) => {
  const groups = await Group.find().populate("members", "name");
  res.json(groups);
});

// ✅ Join a group
router.post("/:groupId/join", authMiddleware, async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  if (!group.members.includes(req.user)) {
    group.members.push(req.user);
    await group.save();
  }
  res.json({ message: "Joined group" });
});

// ✅ Send a message in group chat
router.post("/:groupId/message", authMiddleware, async (req, res) => {
  const { content } = req.body;
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  const message = new Message({
    chat: req.params.groupId,
    sender: req.user,
    content,
  });
  await message.save();

  group.messages.push(message);
  await group.save();

  res.json(message);
});

export default router;
