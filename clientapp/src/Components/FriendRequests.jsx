import React, { useState, useEffect, useCallback } from 'react'; // Import React and necessary hooks
import { useNavigate } from 'react-router-dom'; // Import hook for navigation
import { fetchUsernameById } from './../Services/userService'; // Import service to fetch usernameById
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from './../Services/friendService'; // Import friend request services

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]); // State to hold friend requests
  const [loading, setLoading] = useState(true); // State to handle loading status
  const navigate = useNavigate(); // Hook to enable navigation

  // Fetch friend requests for the current user
  const fetchFriendRequests = useCallback(async () => {
    try {
      const storedUser = sessionStorage.getItem('user'); // Retrieve user info from session storage
      if (storedUser) {
        const user = JSON.parse(storedUser); // Parse user info
        const data = await getFriendRequests(user.id); // Fetch friend requests using the service
        await fetchUsernames(data); // Fetch usernames for the requests
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error); // Log any errors
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, []); // Memoized function to avoid unnecessary re-renders

  // Fetch usernames for each friend request
  const fetchUsernames = async (requests) => {
    const updatedRequests = await Promise.all(
      requests.map(async (request) => {
        const username = await fetchUsernameById(request.senderId); // Fetch the username using the service
        return {
          ...request,
          username, // Add the username to the request
        };
      })
    );
    setFriendRequests(updatedRequests); // Update state with the new requests
  };

  // Accept friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId); // Use the service to accept the request
      setFriendRequests(prev => prev.filter(req => req.id !== requestId)); // Remove the accepted request from the state
      window.location.reload(); // Reload the page to update the list (could be optimized)
    } catch (error) {
      console.error("Error accepting request:", error); // Log any errors
    }
  };

  // Reject friend request
  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId); // Use the service to reject the request
      setFriendRequests(prev => prev.filter(req => req.id !== requestId)); // Remove the rejected request from the state
    } catch (error) {
      console.error("Error rejecting request:", error); // Log any errors
    }
  };

  useEffect(() => {
    fetchFriendRequests(); // Initial fetch

    // Set up polling to fetch friend requests every 5 seconds
    const interval = setInterval(fetchFriendRequests, 5000);
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchFriendRequests]); // Include fetchFriendRequests as a dependency

  if (loading) return <div className="text-white">Loading...</div>; // Display loading message while fetching

  return (
    <div className="mt-auto flex-grow items-start w-full h-full">
      <div className="bg-white shadow-lg rounded-lg p-8 h-full flex flex-col">
        <h2 className="300px:text-2xl 400px:text-3xl font-extrabold font-general text-black mb-6">Friend Requests</h2>

        <div className="flex-grow space-y-4 overflow-y-auto">
          {friendRequests.length > 0 ? ( // Check if there are any friend requests
            friendRequests.map(request => (
              <div
                key={request.id} // Use request ID as a unique key
                className="bg-emerald-200 p-4 rounded-lg flex justify-between items-center"
              >
                <p className="text-black font-general">
                  Friend request from{" "}
                  <span 
                    onClick={() => navigate(`/profile/${request.senderId}`)} // Clickable username to navigate to profile
                    className="text-blue-700 text-lg font-semibold cursor-pointer hover:underline"
                  >
                    {request.username} {/* Display the sender's username */}
                  </span>
                </p>
                <div>
                  <button
                    onClick={() => handleAcceptRequest(request.id)} // Accept request handler
                    className="bg-green-500 hover:bg-green-700 font-clash text-white px-2 py-1 rounded 510px:mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)} // Reject request handler
                    className="bg-red-500 hover:bg-red-700 font-clash text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No friend requests</div> // Message when no friend requests exist
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests; // Export the FriendRequests component
