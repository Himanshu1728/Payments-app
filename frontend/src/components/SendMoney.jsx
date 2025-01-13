// src/components/SendMoney.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";

const SendMoney = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State for users
  const [loading, setLoading] = useState(false); // State for loading
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounced value of search query

  // Function to handle search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle navigation to the Send page
  const handleSendMoney = (user) => {
    navigate(`/send?userid=${user._id}&Firstname=${user.FirstName}&Lastname=${user.LastName}`);
  };

  // Fetch balance and users
  useEffect(() => {
    const fetchBalanceAndUsers = async () => {
      setLoading(true);
      const token = localStorage.getItem("Authorization"); // Get token from local storage

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        // Fetch users based on search query
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
        setUsers(usersResponse.data?.users || []); // Update users state
      } catch (error) {
        if(error.message==="Invalid or expired token")navigate("/signin");
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBalanceAndUsers();
  }, [debouncedSearchQuery, navigate]);

  return (
    <div className="space-y-4 p-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-3 border rounded-md border-gray-300 mb-6"
      />

      {/* User List */}
      {loading ? (
        <div>Loading...</div>
      ) : users.length > 0 ? (
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
  );
};

export default SendMoney;
