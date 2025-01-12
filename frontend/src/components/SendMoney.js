// src/components/SendMoney.js
import React from "react";
import { useNavigate } from "react-router-dom";

const SendMoney = ({ users }) => {
  const navigate = useNavigate();

  const handleSendMoney = (user) => {
    navigate(`/send?userid=${user._id}&Firstname=${user.FirstName}&Lastname=${user.LastName}`);
  };

  return (
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
  );
};

export default SendMoney;
