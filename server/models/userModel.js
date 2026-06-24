import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  photo: { type: String, default: "" },
  creditBalance: { type: Number, default: 5 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'transaction' }],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
