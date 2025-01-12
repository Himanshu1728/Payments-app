import MoneyRequest from "../models/MoneyRequest.model.js";
import Account from "../models/account.model.js";

export const handleMoneyRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const receiverId = req.user._id;

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Find the money request
    const moneyRequest = await MoneyRequest.findOne({
      _id: requestId,
      receiverId,
      status: "pending",
    });

    if (!moneyRequest) {
      return res.status(404).json({ message: "Money request not found or already handled" });
    }

    if (action === "accepted") {
      // Process the transaction
      const senderAccount = await Account.findOne({ userId: moneyRequest.senderId });
      const receiverAccount = await Account.findOne({ userId: receiverId });

      if (!receiverAccount || receiverAccount.balance < moneyRequest.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Deduct from receiver and add to sender
      receiverAccount.balance -= moneyRequest.amount;
      senderAccount.balance += moneyRequest.amount;

      // Log transactions in both accounts
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

      senderAccount.transactions.push(transactionDetails);
      receiverAccount.transactions.push(debitTransactionDetails);

      await receiverAccount.save();
      await senderAccount.save();

      moneyRequest.status = "accepted";
    } else {
      moneyRequest.status = "rejected";
    }

    await moneyRequest.save();

    res.status(200).json({
      success: true,
      message: `Money request ${action} successfully`,
      data: moneyRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Create a new money request
export const createMoneyRequest = async (req, res) => {
    try {
      const { receiverId, amount, description } = req.body;
      const senderId = req.user?.id;
  
      if (!receiverId || !amount) {
        return res.status(400).json({ message: "Receiver ID and amount are required" });
      }
  
      // Check if receiver exists
      const receiverAccount = await Account.findOne({ userId: receiverId });
      if (!receiverAccount) {
        return res.status(404).json({ message: "Receiver not found" });
      }
  
      // Create the money request
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
  
  // View money requests (for the logged-in user)
  export const viewMoneyRequests = async (req, res) => {
    try {
      const userId = req.user?.id;
  
      const requests = await MoneyRequest.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }).populate("senderId", "email FirstName LastName")
        .populate("receiverId", "email FirstName LastName");
  
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
      const creditTransactions = account.transactions.filter(transaction => transaction.type === 'credit').slice(0, 5);
      const debitTransactions = account.transactions.filter(transaction => transaction.type === 'debit').slice(0, 5);
  
      return res.status(200).json({
        creditTransactions,
        debitTransactions,
        totalDebited,
        totalCredited
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching account summary", error: error.message });
    }
  };
  