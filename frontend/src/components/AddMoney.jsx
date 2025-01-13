// src/components/AddMoney.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMoney = () => {
  const [amount, setAmount] = useState(""); // State for the entered amount
  const [error, setError] = useState(""); // State for validation errors
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();
  const token = localStorage.getItem("Authorization");

  // Redirect to signin if token is missing
  if (!token) {
    alert("Authorization token is missing. Please log in again.");
    navigate("/signin");
    return null; // Avoid rendering the component
  }

  const handleAddMoney = async () => {
    // Clear any previous messages
    setError("");
    setSuccessMessage("");

    // Validate amount
    const enteredAmount = parseFloat(amount);
    if (!enteredAmount || enteredAmount <= 0) {
      setError("Please enter a valid amount greater than ₹0.");
      return;
    }
    if (enteredAmount > 10000) {
      setError("You can only add up to ₹10,000 in a single transaction.");
      return;
    }

    try {
      // API Call
      const response = await axios.post(
        "http://localhost:8080/api/v1/account/addBalance",
        { amount: enteredAmount }, // Data payload
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Display success message
      setSuccessMessage(`₹${enteredAmount.toFixed(2)} has been added to your account successfully.`);
      setAmount(""); // Clear input field
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message || "Failed to add money. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh] bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Add Money</h2>
        <p className="text-gray-600 mb-6 text-center">Add money to your account. Maximum ₹10,000 per transaction.</p>

        {/* Input for amount */}
        <label className="block mb-2 text-gray-700 font-medium">Enter Amount:</label>
        <input
          type="number"
          placeholder="Enter amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 border-gray-300 focus:ring-2 focus:ring-blue-500"
        />

        {/* Error message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Success message */}
        {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

        {/* Add Money Button */}
        <button
          onClick={handleAddMoney}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Money
        </button>
      </div>
    </div>
  );
};

export default AddMoney;
