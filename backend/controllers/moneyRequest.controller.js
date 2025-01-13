import MoneyRequest from "../models/MoneyRequest.model.js";
import Account from "../models/account.model.js";

export const handleMoneyRequest = async (req, res) => {
  const { requestId, action } = req.body;
  const receiverId = req.user?.id;

  if (!["accepted", "rejected"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    // Find the money request
    const moneyRequest = await MoneyRequest.findById(requestId);
console.log(moneyRequest);
    if (!moneyRequest) {
      return res.status(404).json({ message: "Money request not found or already handled" });
    }

    const senderAccount = await Account.findOne({ userId: moneyRequest.senderId });
    const receiverAccount = await Account.findOne({ userId: receiverId });

    if (!senderAccount || !receiverAccount) {
      return res.status(404).json({ message: "Sender or receiver account not found" });
    }

    if (action === "accepted") {
      if (receiverAccount.balance < moneyRequest.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Deduct from receiver and add to sender
      receiverAccount.balance -= moneyRequest.amount;
      senderAccount.balance += moneyRequest.amount;

      // Transaction details for both sender and receiver
      const transactionDetails = {
        type: "credit",
        amount: moneyRequest.amount,
        description: moneyRequest.description || "Money request accepted",
        createdAt: new Date(),
      };
      const debitTransactionDetails = {
        ...transactionDetails,
        type: "debit",
      };

      // Save the transactions in both accounts
      senderAccount.transactions.push(transactionDetails);
      receiverAccount.transactions.push(debitTransactionDetails);

      // Save updated accounts
      await senderAccount.save();
      await receiverAccount.save();

      // Update money request status
      moneyRequest.status = "accepted";
    } else {
      // If rejected, just update the status
      moneyRequest.status = "rejected";
    }

    // Save the updated money request
    await moneyRequest.save();

    res.status(200).json({
      success: true,
      message: `Money request ${action} successfully`,
      data: moneyRequest,
    });
  } catch (error) {
    console.error("Error handling money request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createMoneyRequest = async (req, res) => {
  const { receiverId, amount, description } = req.body;
  const senderId = req.user?.id;

  if (!receiverId || !amount) {
    return res.status(400).json({ message: "Receiver ID and amount are required" });
  }

  try {
    // Check if receiver exists
    const receiverAccount = await Account.findOne({ userId: receiverId });
    if (!receiverAccount) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Create and save the money request
    const moneyRequest = new MoneyRequest({
      senderId,
      receiverId,
      amount,
      description,
    });
    await moneyRequest.save();

    res.status(201).json({
      success: true,
      message: "Money request created successfully",
      data: moneyRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewMoneyRequests = async (req, res) => {
  const userId = req.user?.id;
  const { type } = req.query; // type: 'sent', 'received', or 'all'

  try {
    let requests;

    if (type === "received") {
      requests = await MoneyRequest.find({ receiverId: userId })
        .populate("senderId", "email FirstName LastName")
        .populate("receiverId", "email FirstName LastName");
    } else if (type === "sent") {
      requests = await MoneyRequest.find({ senderId: userId })
        .populate("senderId", "email FirstName LastName")
        .populate("receiverId", "email FirstName LastName");
    } else {
      // Default to 'all' if type is not specified or is invalid
      requests = await MoneyRequest.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
        .populate("senderId", "email FirstName LastName")
        .populate("receiverId", "email FirstName LastName");
    }

    res.status(200).json({
      success: true,
      message: "Money requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAccountSummary = async (req, res) => {
  const userId = req.user?.id;

  try {
    const account = await Account.findOne({ userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Calculate totals
    const totalDebited = account.transactions
      .filter(transaction => transaction.type === 'debit')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalCredited = account.transactions
      .filter(transaction => transaction.type === 'credit')
      .reduce((total, transaction) => total + transaction.amount, 0);

    // Paginate or fetch limited transactions (e.g., latest 5)
    const totalTransactions = account.transactions.slice(0, 5);
    const creditTransactions = account.transactions.filter(transaction => transaction.type === 'credit').slice(0, 5);
    const debitTransactions = account.transactions.filter(transaction => transaction.type === 'debit').slice(0, 5);

    return res.status(200).json({
      totalTransactions,
      creditTransactions,
      debitTransactions,
      totalDebited,
      totalCredited,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching account summary", error: error.message });
  }
};
