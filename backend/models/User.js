import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  profilePic: String,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  lastSeen: { type: Date, default: null }, // Store last seen timestamp
});

export default mongoose.model("User", UserSchema);
