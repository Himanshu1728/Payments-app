// src/components/AccountSummary.js
import React from "react";

const AccountSummary = ({ balance }) => {
  return (
    <div className="text-2xl font-bold mb-6">
      Your Balance: <span className="text-green-600">₹{balance}</span>
    </div>
  );
};

export default AccountSummary;
