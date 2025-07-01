import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ["debit", "credit"], // Validation added
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      description: String,
      fromAccountId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
      },
      toAccountId: {
        type: mongoose.Types.ObjectId,
        ref: "Account",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Account = mongoose.model("Account", accountSchema);
export default Account;
