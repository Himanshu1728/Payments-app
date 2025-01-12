import mongoose from "mongoose";

const moneyRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  description: {
    type: String,
    default: null, // Optional field, can be null if not provided
    maxlength: 500, // Maximum length of the description
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MoneyRequest = mongoose.model("MoneyRequest", moneyRequestSchema);
export default MoneyRequest;
