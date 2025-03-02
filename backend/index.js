import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";
import authMiddleware from "./Middlewares/authMiddleware.js";
import User from "./models/User.js"; // Ensure User model is imported

// Import Routes
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import groupRoutes from "./routes/group.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://hackathon10x-5n81.vercel.app", // Update as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// PeerJS Server for WebRTC
const peerServer = ExpressPeerServer(server, { debug: true });
app.use("/peerjs", peerServer);

// Middleware
app.use(
  cors({
    origin: "https://hackathon10x-5n81.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// Public Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/chat", authMiddleware, chatRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/group", authMiddleware, groupRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const usersInRoom = {};
const onlineUsers = new Set();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId || null;
  if (!userId) {
    console.warn(`⚠️ User ID missing for socket: ${socket.id}`);
    return;
  }

  console.log(`✅ User Connected: ${socket.id}, UserID: ${userId}`);
  socket.join(userId);

  socket.on("user-online", async (userId) => {
    onlineUsers.add(userId);
    io.emit("user-status-updated", { userId, isOnline: true });
    console.log(`🔵 User ${userId} is online`);

    await User.findByIdAndUpdate(userId, { lastSeen: null });
  });

  socket.on("user-offline", async (userId) => {
    onlineUsers.delete(userId);
    const lastSeenTime = new Date();
    await User.findByIdAndUpdate(userId, { lastSeen: lastSeenTime });
    io.emit("user-status-updated", {
      userId,
      isOnline: false,
      lastSeen: lastSeenTime,
    });
    console.log(`🔴 User ${userId} went offline at ${lastSeenTime}`);
  });

  socket.on("sendMessage", (data) => {
    console.log("📩 Sending message:", data);
    io.to(data.room).emit("receiveMessage", data);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`✅ User joined room: ${room}`);
  });

  // WebRTC Signaling
  socket.on("offer", (data) => socket.to(data.target).emit("offer", data));
  socket.on("answer", (data) => socket.to(data.target).emit("answer", data));
  socket.on("ice-candidate", (data) =>
    socket.to(data.target).emit("ice-candidate", data)
  );

  // Video Call Room Management
  socket.on("join-video-room", (roomId, userId) => {
    if (!usersInRoom[roomId]) usersInRoom[roomId] = [];
    usersInRoom[roomId].push(userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log(`🎥 User ${userId} joined video room: ${roomId}`);
  });

  socket.on("leave-video-room", (roomId, userId) => {
    usersInRoom[roomId] = usersInRoom[roomId].filter((id) => id !== userId);
    socket.to(roomId).emit("user-disconnected", userId);
    socket.leave(roomId);
    console.log(`🚪 User ${userId} left video room: ${roomId}`);
  });

  // Screen Sharing
  socket.on("start-screen-share", (roomId, streamId) => {
    socket
      .to(roomId)
      .emit("screen-share-started", { userId: socket.id, streamId });
    console.log(
      `📺 User ${socket.id} started screen sharing in room: ${roomId}`
    );
  });

  socket.on("stop-screen-share", (roomId) => {
    socket.to(roomId).emit("screen-share-stopped", { userId: socket.id });
    console.log(
      `📺 User ${socket.id} stopped screen sharing in room: ${roomId}`
    );
  });

  // Recording
  socket.on("start-recording", (roomId) => {
    socket.to(roomId).emit("recording-started", { userId: socket.id });
    console.log(`🎥 User ${socket.id} started recording in room: ${roomId}`);
  });

  socket.on("stop-recording", (roomId) => {
    socket.to(roomId).emit("recording-stopped", { userId: socket.id });
    console.log(`🎥 User ${socket.id} stopped recording in room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

app.get("/test", (req, res) => res.send("✅ Socket server is running"));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
