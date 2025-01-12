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
