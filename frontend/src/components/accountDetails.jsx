import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountDetails = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    totalTransactions: [],
    creditTransactions: [],
    debitTransactions: [],
    totalDebited: 0,
    totalCredited: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const token = localStorage.getItem('Authorization');
      if (!token) {
        alert('Authorization token is missing. Please log in again.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/moneyrequest/accountSummary', {
          headers: { Authorization: token },
        });

        const { totalTransactions, totalDebited, totalCredited } = response.data;
        const { FirstName, LastName, email } = response.data.user;
        const creditTransactions = totalTransactions.filter(txn => txn.type === 'credit');
        const debitTransactions = totalTransactions.filter(txn => txn.type === 'debit');

        setUserData({
          FirstName,
          LastName,
          email,
          totalTransactions,
          creditTransactions,
          debitTransactions,
          totalDebited,
          totalCredited,
        });
      } catch (error) {
        console.error('Error fetching account details:', error.response?.data || error.message);
        alert('Failed to fetch account details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  const TransactionList = ({ transactions, title, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <ul className="space-y-3">
        {transactions.slice(0, 5).map((txn, index) => (
          <li key={index} className="text-gray-600 border-b border-gray-200 pb-2 last:border-b-0">
            <span className={`font-medium ${type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
              ₹{txn.amount.toFixed(2)}
            </span>
            <span className="ml-2">{txn.description}</span>
            <br />
            <span className="text-sm text-gray-500">
              {new Date(txn.date).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-center text-gray-900">Account Details</h1>

            {/* User Information */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-600">
                  <span className="font-medium">Full Name:</span> {userData.FirstName} {userData.LastName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {userData.email}
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Debited</h2>
                <p className="text-3xl font-bold text-red-600">₹{userData.totalDebited.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Total Credited</h2>
                <p className="text-3xl font-bold text-green-600">₹{userData.totalCredited.toFixed(2)}</p>
              </div>
            </div>

            {/* Transaction Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TransactionList 
                transactions={userData.totalTransactions} 
                title="Recent Transactions" 
                type="all"
              />
              <TransactionList 
                transactions={userData.creditTransactions} 
                title="Credit Transactions" 
                type="credit"
              />
              <TransactionList 
                transactions={userData.debitTransactions} 
                title="Debit Transactions" 
                type="debit"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;

