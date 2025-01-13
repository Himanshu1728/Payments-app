// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSummary from "../components/AccountSummary";
import Tabs from "../components/Tabs";
import SendMoney from "../components/SendMoney";
import AddMoney from "../components/AddMoney";
import RequestMoney from "../components/RequestMoney";
import useDebounce from "../hooks/useDebounce";
import Moneyrequests from "../components/Moneyrequests"
const Dashboard2 = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("send");
  const navigate = useNavigate();

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
        // Fetch balance
        const balanceResponse = await axios.get("http://localhost:8080/api/v1/account/getBalance", {
          headers: { Authorization: token },
        });
        setBalance(parseFloat(balanceResponse.data.balance.toFixed(2)));

        // Fetch users
        const usersResponse = await axios.get("http://localhost:8080/api/v1/user/bulk", {
          headers: { Authorization: token },
          params: { filter: debouncedSearchQuery },
        });
        setUsers(usersResponse.data?.users || []);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceAndUsers();
  }, [debouncedSearchQuery, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AppBar */}
      <div className="flex justify-between items-center bg-gray-800 p-4">
        <div className="text-white font-bold text-xl">PaymentsApp</div>
        <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold">
          {"H"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Account Summary */}
        <AccountSummary balance={balance} />

        {/* Tabs */}
        <Tabs onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === "send" && <SendMoney  />}
        {activeTab === "add" && <AddMoney />}
        {activeTab === "request" && <RequestMoney />}
        {activeTab === "checkrequest" && <Moneyrequests />}
      </div>
    </div>
  );
};

export default Dashboard2;
