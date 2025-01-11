import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("Authorization"); // Get token from localStorage
    
    const fetchBalance = async () => {
      try {
        // Fetch balance
        const response = await axios.get("http://localhost:8080/api/v1/account/getBalance", {
          headers: {
            Authorization: token // Attach the token with the correct header key
          }
        });
        
        const formattedBalance = response.data.balance.toFixed(2); // Format balance to 2 decimals
        setBalance(parseFloat(formattedBalance)); // Set balance from API response

        // Fetch users with filter query
        const response2 = await axios.get("http://localhost:8080/api/v1/user/bulk", {
          headers: {
            Authorization: token // Attach the token with the correct header key
          },
          params: {
            filter: searchQuery // Pass the filter query here
          }
        });
        
        
        setUsers(response2.data.users);
        console.log(response2.data.users);
         // Update users from the correct response
      } catch (error) {
        console.error('Error fetching balance or users:', error.response?.data || error.message);
      }
    };
    
    fetchBalance(); // Call the fetch balance function

  }, [searchQuery]); // Re-run the effect when searchQuery changes

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
          {users
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-md border-gray-200"
              >
                  <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold">
                {user.FirstName[0]?.toUpperCase() || 'U'}</div>
                  <div className="text-lg font-semibold">{user.FirstName} {user.LastName}</div>
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
