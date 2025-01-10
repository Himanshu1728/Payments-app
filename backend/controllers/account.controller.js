import Account from "../models/account.model.js";

export const transferFunds = async (fromAccountId, toAccountId, amount) => {
    // Decrement the balance of the fromAccount
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Start a transaction
    try {
        // Step 1: Deduct the amount from the sender's account
        const fromAccount = await Account.findById(fromAccountId).session(session);
        if (!fromAccount || fromAccount.balance < amount) {
          throw new Error("Insufficient funds");
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
    
     
        await session.commitTransaction();
        session.endSession();
    
        return resizeBy.status(200).json({ message: "Transaction successful" });
      } catch (error) {
        // If an error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new Error("Transaction failed: " + error.message);
      }
}