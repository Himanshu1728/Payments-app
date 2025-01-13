import React from "react";

const Tabs = ({ onTabChange, activeTab }) => {
  const tabs = [
    { id: "send", label: "Send Money" },
    { id: "add", label: "Add Money" },
    { id: "request", label: "Request Money" },
    { id: "checkrequest", label: "Money Requests" },
    { id: "accountSummary", label: "Account Summary" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
