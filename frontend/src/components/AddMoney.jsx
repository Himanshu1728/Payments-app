import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const AddMoney = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      toast.error("Authorization token is missing. Please log in again.");
      navigate("/signin");
    }
  }, [navigate]);

  const handleAddMoney = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const enteredAmount = parseFloat(amount);
    if (!enteredAmount || enteredAmount <= 0) {
      setError("Please enter a valid amount greater than ₹0.");
      setIsLoading(false);
      return;
    }
    if (enteredAmount > 10000) {
      setError("You can only add up to ₹10,000 in a single transaction.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("Authorization");
      const response = await api.post(
        "/account/addBalance",
        { amount: enteredAmount },
        { headers: { Authorization: token } }
      );

      setSuccessMessage(`₹${enteredAmount.toFixed(2)} has been added to your account successfully.`);
      setAmount("");
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add money. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-100 flex justify-center items-center p-4">
      <Toaster />
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-emerald-300">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-emerald-700">Add Funds</h2>
        <p className="text-gray-700 mb-8 text-center">
          Quickly add money to your account. Maximum ₹10,000 per transaction.
        </p>

        <div className="mb-6">
          <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-700">
            Enter Amount:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 pl-8 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>
        </div>

        {error && (
          <p className="text-rose-600 text-sm mb-4 bg-rose-50 p-3 rounded-lg border border-rose-200">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="text-emerald-600 text-sm mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
            {successMessage}
          </p>
        )}

        <button
          onClick={handleAddMoney}
          disabled={isLoading}
          className={`w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Add Money'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddMoney;
