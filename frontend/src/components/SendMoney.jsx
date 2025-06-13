import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
const SendMoney = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendMoney = (user) => {
    navigate(`/send?userid=${user._id}&Firstname=${user.FirstName}&Lastname=${user.LastName}`);
  };

  useEffect(() => {
    const fetchBalanceAndUsers = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("Authorization");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const usersResponse = await api.get(
          "/user/bulk",
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
        if (error.message === "Invalid or expired token") {
          navigate("/signin");
        } else {
          setError("Failed to fetch users. Please try again.");
          console.error("Error fetching data:", error.response?.data || error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceAndUsers();
  }, [debouncedSearchQuery, navigate]);

  const UserSkeleton = () => (
    <div className="animate-pulse flex items-center justify-between p-4 border rounded-lg border-gray-200 mb-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-24"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Send Money</h1>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-4 pl-12 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <UserSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>
      ) : users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border rounded-lg border-gray-200 hover:shadow-md transition duration-200 ease-in-out animate-fadeIn"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-lg font-bold">
                  {user.FirstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {user.FirstName || "First"} {user.LastName || "Last"}
                  </div>
                  <div className="text-sm text-gray-500">{user.email || "No email provided"}</div>
                </div>
              </div>
              <button
                onClick={() => handleSendMoney(user)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Send Money
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 bg-gray-100 p-8 rounded-lg">
          No users found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default SendMoney;

