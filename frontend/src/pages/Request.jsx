import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Request = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userid");
  const firstName = searchParams.get("Firstname");
  const lastName = searchParams.get("Lastname");
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("Authorization token is missing");
      navigate("/signin");
    }
  }, [navigate]);

  const handleRequestMoney = async () => {
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
        "http://localhost:8080/api/v1/moneyrequest/requestMoney",
        {
            receiverId: userId,
          amount: amount,
          description: note,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert(`Successfully requested ₹${amount} from ${firstName} ${lastName} with note: "${note}"!`);
      setAmount("");
      setNote("");
      navigate("/dashboard2");
    } catch (error) {
      console.error("Error during request:", error.response?.data || error.message);
      alert("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        {/* Modal Heading */}
        <h2 className="text-xl font-bold mb-4">
          Request Money from {firstName} {lastName}
        </h2>

        {/* Amount Input */}
        <label className="block mb-2 text-gray-600">Enter Amount:</label>
        <input
          type="number"
          placeholder="Enter amount to request"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 border-gray-300"
        />

        {/* Note Input */}
        <label className="block mb-2 text-gray-600">Add a Note:</label>
        <input
          type="text"
          placeholder="Enter a transaction note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 border-gray-300"
        />

        {/* Request Money Button */}
        <button
          onClick={handleRequestMoney}
          disabled={loading}
          className={`w-full text-white py-3 rounded-md transition duration-200 ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Request Money"}
        </button>
      </div>
    </div>
  );
};

export default Request;
