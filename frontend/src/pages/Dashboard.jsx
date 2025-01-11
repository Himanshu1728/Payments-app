import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [balance,setbalance]=useState(0);
  useEffect(()=>{

  },[])
  const users = [
    { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AppBar */}
      <div className="flex justify-between items-center bg-gray-800 p-4">
        <div className="flex items-center space-x-4">
          <div className="text-white font-bold text-xl">PaymentsApp</div>
        </div>
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
          Your Balance: <span className="text-green-600">$1,500.00</span>
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
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-md border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-lg font-semibold">{user.name}</div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  Send Money
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
