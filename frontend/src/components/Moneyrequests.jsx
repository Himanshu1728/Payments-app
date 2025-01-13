import React, { useEffect, useState } from "react";
import axios from "axios";

const MoneyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  const fetchRequests = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      // Fetch requests for the logged-in user (received requests)
      const response = await axios.get(
        "http://localhost:8080/api/v1/moneyrequest/moneyRequests",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data);
      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching money requests:", error.response?.data || error.message);
      alert("Failed to fetch requests. Please try again.");
    }
  };

  const fetchSentRequests = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      // Fetch requests sent by the logged-in user
      const response = await axios.get(
        "http://localhost:8080/api/v1/moneyrequest/sentRequests",  // Endpoint for sent requests
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSentRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching sent money requests:", error.response?.data || error.message);
      alert("Failed to fetch sent requests. Please try again.");
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchSentRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/account/money-requests/${requestId}/${action}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(`Request ${action === "accept" ? "accepted" : "rejected"} successfully.`);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
      setSentRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.response?.data || error.message);
      alert(`Failed to ${action} request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = (request) => (
    <div key={request._id} className="flex justify-between items-center border-b py-4">
      <div>
        <p><strong>From:</strong> {request.senderId.FirstName} {request.senderId.LastName} ({request.senderId.email})</p>
        <p><strong>To:</strong> {request.receiverId.FirstName} {request.receiverId.LastName} ({request.receiverId.email})</p>
        <p><strong>Amount:</strong> ₹{request.amount}</p>
        <p><strong>Description:</strong> {request.description || "No description provided"}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex gap-2">
        {request.status === "pending" && (
          <>
            <button
              onClick={() => handleAction(request._id, "accept")}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(request._id, "reject")}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"}`}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Money Requests</h1>

      {/* Tab Navigation */}
      <div className="flex mb-4 space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "received" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("received")}
        >
          Requests for Me
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveTab("sent")}
        >
          Requests Sent by Me
        </button>
      </div>

      {/* Requests Display */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4">
        {activeTab === "received" ? (
          requests.length === 0 ? (
            <p className="text-center text-gray-600">No money requests available.</p>
          ) : (
            requests.map(renderRequest)
          )
        ) : (
          sentRequests.length === 0 ? (
            <p className="text-center text-gray-600">No sent money requests available.</p>
          ) : (
            sentRequests.map(renderRequest)
          )
        )}
      </div>
    </div>
  );
};

export default MoneyRequests;
