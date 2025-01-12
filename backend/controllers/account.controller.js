

import mongoose from "mongoose";
import Account from "../models/account.model.js";
import User from "../models/user.model.js";

export const transferFunds = async (req, res) => {
  const { toAccountId, amount, description } = req.body; // Extract data from the request body
  const fromAccountId = req.user?.id;

  // Validate request payload
  if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    // Step 1: Deduct the amount from the sender's account
    const fromAccount = await Account.findOne({ userId: fromAccountId }); // Directly use the fromAccountId
    
    if (!fromAccount || fromAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds or sender account not found" });
    }
    fromAccount.balance -= amount;
    
    // Add transaction to the sender's transaction array
    fromAccount.transactions.push({
      type: 'debit',
      amount,
      description,
      toAccountId,
      date: new Date(),
    });

    await fromAccount.save();

    // Step 2: Add the amount to the recipient's account
    const toAccount = await Account.findOne({ userId: toAccountId });
    if (!toAccount) {
      return res.status(400).json({ message: "Recipient account not found" });
    }
    toAccount.balance += amount;

    // Add transaction to the recipient's transaction array
    toAccount.transactions.push({
      type: 'credit',
      amount,
      description,
      fromAccountId,
      date: new Date(),
    });

    await toAccount.save();

    return res.status(200).json({ message: "Transaction successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Transaction failed", error: error.message });
  }
};

  


export const getbalance = async (req, res) => {
    
  const  id  = req.user?.id; // User ID
  
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
 console.log("hello")
  try {
    // Find the account using the user's ID
    const account = await Account.findOne({ userId: id });
    console.log("account")
    if (!account) {
      return res.status(404).json({ message: "Account not found for this user" });
    }
    console.log(account.balance);
    return res.status(200).json({
      balance: account.balance,
      message: "Balance retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};




export const addBalance = async (req, res) => {
  try {
    const userId = req.user?.id; // Get the user ID from the request (assuming authentication is done)
    const { amount } = req.body; // The amount to be added to the balance

    // Check if the amount is valid (greater than zero)
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    // Find the user's account
    const account = await Account.findOne({  userId:userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Add the amount to the account balance
    account.balance += amount;

    // Create a transaction record for the added balance
    const transactionDetails = {
      type: "credit", // Since we are adding balance, it's a credit transaction
      amount: amount,
      description: `Balance added: ₹${amount}`,
      createdAt: new Date(),
    };

    // Push the transaction details to the user's transaction history
    account.transactions.push(transactionDetails);

    // Save the updated account
    await account.save();

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: `₹${amount} added successfully to your account`,
      balance: account.balance,
      transaction: transactionDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding balance to account", error: error.message });
  }
};
