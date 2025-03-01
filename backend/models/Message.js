import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  file: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
