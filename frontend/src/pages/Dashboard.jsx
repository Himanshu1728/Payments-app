import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { Cloud } from "lucide-react";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSendMoney = (user) => {
    navigate(`/send?userid=${user._id}&Firstname=${user.FirstName}&Lastname=${user.LastName}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      console.error("Authorization token is missing");
      navigate("/signin");
      return;
    }

    const fetchBalanceAndUsers = async () => {
      setLoading(true);
      try {
        const balanceResponse = await api.get("/account/getBalance", {
          headers: { Authorization: token },
        });
        setBalance(parseFloat(balanceResponse.data.balance.toFixed(2)));

        const usersResponse = await api.get("/user/bulk", {
          headers: { Authorization: token },
          params: { filter: debouncedSearchQuery },
        });
        setUsers(usersResponse.data?.users || []);
      } catch (error) {
        if (error.message === "Invalid or expired token") navigate("/signin");
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceAndUsers();
  }, [debouncedSearchQuery, navigate]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* AppBar */}
      <div className="flex justify-between items-center bg-gradient-to-r from-teal-500 to-amber-400 p-4 shadow">
        <div className="flex items-center space-x-3">
          <Cloud className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">PaymentsApp</span>
        </div>
        <div className="w-10 h-10 flex items-center justify-center bg-white text-teal-600 rounded-full text-lg font-bold shadow">
          H
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Balance */}
        <div className="text-2xl font-bold mb-6 text-gray-700">
          Your Balance: <span className="text-green-600">₹{balance}</span>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-4 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
        />

        {/* Users List */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-lg font-bold">
                    {user.FirstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {user.FirstName || "First"} {user.LastName || "Last"}
                  </div>
                </div>
                <button
                  onClick={() => handleSendMoney(user)}
                  className="bg-gradient-to-r from-teal-500 to-amber-400 text-white px-6 py-2 rounded-lg hover:opacity-90 transition focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  Send Money
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
