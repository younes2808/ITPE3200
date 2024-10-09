import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftNavbar from '../Components/LeftNavbar'; 
import RightNavbar from '../Components/RightNavbar';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch friend requests for the current user
  const fetchFriendRequests = useCallback(async () => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await fetch(`http://localhost:5249/api/Friend/requests/${user.id}`); // Replace with your actual endpoint

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        await fetchUsernames(data); // Fetch usernames for the requests
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this is created once

  // Fetch usernames for each friend request
  const fetchUsernames = async (requests) => {
    const updatedRequests = await Promise.all(requests.map(async (request) => {
      const response = await fetch(`http://localhost:5249/api/User/${request.senderId}`);
      const userData = await response.json();
      return {
        ...request,
        username: userData.username,
      };
    }));
    setFriendRequests(updatedRequests);
  };

  // Accept friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5249/api/Friend/accept/${requestId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Remove the accepted request from the state
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
        window.location.reload()
      } else {
        console.error("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Reject friend request
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5249/api/Friend/reject/${requestId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Remove the rejected request from the state
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        console.error("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  useEffect(() => {
    fetchFriendRequests(); // Initial fetch

    // Set up polling to fetch friend requests every 5 seconds
    const interval = setInterval(fetchFriendRequests, 5000);
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchFriendRequests]); // Include fetchFriendRequests as a dependency

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900">
      <LeftNavbar />
      <div className="flex-grow ml-64 py-6 md:mr-[17vw] mr-5">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 h-full flex flex-col">
          <h2 className="text-3xl font-extrabold text-white mb-6">Friend Requests</h2>

          <div className="flex-grow space-y-4 overflow-y-auto">
            {friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <div
                  key={request.id}
                  className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                >
                  <p className="text-white">
                    Friend request from{" "}
                    <span 
                      onClick={() => navigate(`/profile/${request.senderId}`)} // Clickable username to navigate to profile
                      className="text-blue-400 cursor-pointer hover:underline"
                    >
                      {request.username}
                    </span>
                  </p>
                  <div>
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center">No friend requests</div>
            )}
          </div>
        </div>
      </div>
      <RightNavbar />
    </div>
  );
};

export default FriendRequests;
