import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userid");
  const firstName = searchParams.get("Firstname");
  const lastName = searchParams.get("Lastname");
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("Authorization token is missing");
      navigate("/signin");
    }
  }, [navigate]);

  const handleSendMoney = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/account/transaction",
        {
          toAccountId: userId,
          amount: amount,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(`Successfully sent ₹${amount} to ${firstName} ${lastName}!`);
      setAmount(""); // Clear input field
      navigate("/dashboard")
    } catch (error) {
      console.error("Error during transaction:", error.response?.data || error.message);
      alert("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        {/* Modal Heading */}
        <h2 className="text-xl font-bold mb-4">
          Payment to {firstName} {lastName}
        </h2>

        {/* Amount Input */}
        <label className="block mb-2 text-gray-600">Enter Amount:</label>
        <input
          type="number"
          placeholder="Enter amount to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 border-gray-300"
        />

        {/* Send Money Button */}
        <button
          onClick={handleSendMoney}
          disabled={loading}
          className={`w-full text-white py-3 rounded-md transition duration-200 ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>
      </div>
    </div>
  );
};

export default SendMoney;
