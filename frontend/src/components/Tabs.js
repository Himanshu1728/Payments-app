// src/components/Tabs.js
import React, { useState } from "react";

const Tabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("send");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => handleTabClick("send")}
        className={`py-2 px-4 rounded-md ${activeTab === "send" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      >
        Send Money
      </button>
      <button
        onClick={() => handleTabClick("add")}
        className={`py-2 px-4 rounded-md ${activeTab === "add" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      >
        Add Money
      </button>
      <button
        onClick={() => handleTabClick("request")}
        className={`py-2 px-4 rounded-md ${activeTab === "request" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      >
        Request Money
      </button>
    </div>
  );
};

export default Tabs;
