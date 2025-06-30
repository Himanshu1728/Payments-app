// Updated Dashboard2.jsx with new visual theme

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSummary from "../components/AccountSummary";
import Tabs from "../components/Tabs";
import SendMoney from "../components/SendMoney";
import AddMoney from "../components/AddMoney";
import RequestMoney from "../components/RequestMoney";
import useDebounce from "../hooks/useDebounce";
import Moneyrequests from "../components/Moneyrequests";
import AccountDetails from "../components/AccountDetailsTemp";
import { Cloud } from "lucide-react";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const Dashboard2 = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("send");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    if (!token) {
      navigate("/signin");
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await api.get("/me", {
          headers: { Authorization: token },
        });
        console.log(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error.response?.data || error.message);
        setIsAuthenticated(false);
        navigate("/signin");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBalanceAndUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("Authorization");
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
        console.error("Error fetching data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceAndUsers();
  }, [debouncedSearchQuery, isAuthenticated]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* AppBar */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl rounded-b-3xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cloud className="w-10 h-10" />
            <span className="text-3xl font-extrabold text-white">NovaPay</span>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-white text-purple-600 rounded-full text-lg font-bold shadow-lg">
            H
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
          </div>
        ) : (
          <>
            <AccountSummary balance={balance} />
            <Tabs onTabChange={handleTabChange} activeTab={activeTab} />
            <div className="mt-8">
              {activeTab === "send" && <SendMoney />}
              {activeTab === "add" && <AddMoney />}
              {activeTab === "request" && <RequestMoney />}
              {activeTab === "checkrequest" && <Moneyrequests />}
              {activeTab === "accountSummary" && <AccountDetails />}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard2;
