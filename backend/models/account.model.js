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
        type: String, // 'debit' or 'credit'
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      description: String,
      fromAccountId: mongoose.Types.ObjectId, // Reference to the sender for debit transactions
      toAccountId: mongoose.Types.ObjectId,   // Reference to the receiver for credit transactions
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Account = mongoose.model("Account", accountSchema);
export default Account;