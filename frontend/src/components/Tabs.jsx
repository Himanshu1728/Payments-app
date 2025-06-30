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
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-5 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out transform
            ${activeTab === tab.id
              ? "bg-gradient-to-r from-teal-500 to-amber-400 text-white scale-105 shadow-lg"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gradient-to-r hover:from-teal-100 hover:to-amber-100"}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
