import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce"; // Import the debounce hook
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

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSendMoney = (user) => {
    navigate(`/send?userid=${user._id}&Firstname=${user.FirstName}&Lastname=${user.LastName}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    console.log("token :",token);
    if (!token) {
      console.error("Authorization token is missing");
      navigate("/signin");
      return;
    }

    const fetchBalanceAndUsers = async () => {
      setLoading(true);
      try {
        // Fetch balance
        const balanceResponse = await axios.get(
          "http://localhost:8080/api/v1/account/getBalance",
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setBalance(parseFloat(balanceResponse.data.balance.toFixed(2)));

        // Fetch users
        const usersResponse = await axios.get(
          "http://localhost:8080/api/v1/user/bulk",
          {
            headers: {
              Authorization: token,
            },
            params: {
              filter: debouncedSearchQuery,
            },
          }
        );
        setUsers(usersResponse.data?.users || []);
      } catch (error) {
        if(error.message==="Invalid or expired token")navigate("/signin");
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* AppBar */}
      <div className="flex justify-between items-center bg-gray-800 p-4">
      <div className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 bg-yellow-400" />
            <span className="text-2xl font-bold text-gray-800">PaymentsApp</span>
          </div>
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold">
          {"H"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Balance */}
        <div className="text-2xl font-bold mb-6">
          Your Balance: <span className="text-green-600">₹{balance}</span>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 border rounded-md border-gray-300 mb-6"
        />

        {/* Users List */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border rounded-md border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold">
                    {user.FirstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="text-lg font-semibold">
                    {user.FirstName || "First"} {user.LastName || "Last"}
                  </div>
                </div>
                <button
                  onClick={() => handleSendMoney(user)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Send Money
                </button>
              </div>
            ))
          ) : (
            <div>No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
