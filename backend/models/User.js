import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skills: [String],
  profilePic: String,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});

export default mongoose.model("User", UserSchema);
