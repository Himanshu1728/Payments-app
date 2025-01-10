

import mongoose from "mongoose";
import Account from "../models/account.model.js";
import User from "../models/user.model.js";

export const transferFunds = async (req, res) => {
  const { toAccountId, amount } = req.body; // Extract data from the request body
 const fromAccountId=req.user?.id;
  // Validate request payload
  if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    // Step 1: Deduct the amount from the sender's account
    const fromAccount = await Account.findById(fromAccountId).session(session);
    if (!fromAccount || fromAccount.balance < amount) {
      throw new Error("Insufficient funds or sender account not found");
    }
    fromAccount.balance -= amount;
    await fromAccount.save();

    // Step 2: Add the amount to the recipient's account
    const toAccount = await Account.findById(toAccountId).session(session);
    if (!toAccount) {
      throw new Error("Recipient account not found");
    }
    toAccount.balance += amount;
    await toAccount.save();

    // Step 3: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Transaction successful" });
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ message: "Transaction failed", error: error.message });
  }
};



export const getbalance = async (req, res) => {
  const { id } = req.user?.id; // User ID

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the account using the user's ID
    const account = await Account.findOne({ userid: id });
    if (!account) {
      return res.status(404).json({ message: "Account not found for this user" });
    }

    return res.status(200).json({
      balance: account.balance,
      message: "Balance retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};
