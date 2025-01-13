import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountDetails = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    totalTransactions: 0,
    creditTransactions: 0,
    debitTransactions: 0,
    totalDebited: 0,
    totalCredited: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch user and account details from the API
  useEffect(() => {
    const fetchAccountDetails = async () => {
      const token = localStorage.getItem('Authorization');
      if (!token) {
        alert('Authorization token is missing. Please log in again.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/account/details', {
          headers: { Authorization: token },
        });

        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching account details:', error.response?.data || error.message);
        alert('Failed to fetch account details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      {loading ? (
        <div className="text-center text-lg font-semibold text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Account Details</h1>

          {/* User Information */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">User Information</h2>
            <p className="text-gray-600">
              <strong>Full Name: </strong>{userData.firstName} {userData.lastName}
            </p>
            <p className="text-gray-600">
              <strong>Email: </strong>{userData.email}
            </p>
          </div>

          {/* Transaction Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total Transactions</h2>
              <p className="text-gray-600">{userData.totalTransactions}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Credit Transactions</h2>
              <p className="text-gray-600">{userData.creditTransactions}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Debit Transactions</h2>
              <p className="text-gray-600">{userData.debitTransactions}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total Debited</h2>
              <p className="text-gray-600">₹{userData.totalDebited}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">Total Credited</h2>
              <p className="text-gray-600">₹{userData.totalCredited}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
