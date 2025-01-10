import mongoose from "mongoose";
import User from "./user.model.js";

const accountSchema = mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    ref: "User", 
    required: true, 
  },
  balance: {
    type: Number,
    default: 0,
    min: 0, 
  },
});

const Account = mongoose.model("Account", accountSchema); 
export default Account;
