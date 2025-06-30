import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

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
        toast.error('Authorization token is missing. Please log in again.');
        return;
      }

      try {
        const response = await api.get('/moneyrequest/accountSummary', {
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
        toast.error('Failed to fetch account details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  const TransactionList = ({ transactions, title, type }) => (
    <div className="bg-amber-50 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-emerald-300">
      <div><Toaster /></div>
      <h2 className="text-xl font-bold text-emerald-700 mb-4">{title}</h2>
      <ul className="space-y-3">
        {transactions.slice(0, 5).map((txn, index) => (
          <li key={index} className="text-gray-700 border-b border-gray-300 pb-2 last:border-b-0">
            <span className={`font-semibold ${type === 'credit' ? 'text-teal-700' : type === 'debit' ? 'text-rose-700' : 'text-amber-800'}`}>
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
    <div className="bg-emerald-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-10">
            <h1 className="text-4xl font-extrabold text-center text-emerald-800">Account Overview</h1>

            {/* User Information */}
            <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-emerald-300">
              <h2 className="text-2xl font-bold text-teal-700 mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Full Name:</span> {userData.FirstName} {userData.LastName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {userData.email}
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-emerald-300">
                <h2 className="text-2xl font-bold text-rose-700 mb-4">Total Debited</h2>
                <p className="text-4xl font-extrabold text-rose-700">₹{userData.totalDebited.toFixed(2)}</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-emerald-300">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Total Credited</h2>
                <p className="text-4xl font-extrabold text-teal-700">₹{userData.totalCredited.toFixed(2)}</p>
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
