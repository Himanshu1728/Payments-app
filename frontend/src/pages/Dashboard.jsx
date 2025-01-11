import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/account/getBalance",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setBalance(parseFloat(response.data.balance.toFixed(2)));

        const response2 = await axios.get(
          "http://localhost:8080/api/v1/user/bulk",
          {
            headers: {
              Authorization: token,
            },
            params: {
              filter: searchQuery,
            },
          }
        );

        setUsers(response2.data?.users || []);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [searchQuery, navigate]);

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
        <div className="text-white font-bold text-xl">PaymentsApp</div>
        <div className="w-10 h-10 rounded-full bg-gray-400">
          <img
            src="https://via.placeholder.com/40"
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
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
``
