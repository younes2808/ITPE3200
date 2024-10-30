import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFriendsByUserId, fetchFriendDetails } from '../Services/friendService'; // Import the services

const RightNavbar = () => {
  const [friends, setFriends] = useState([]); // State to hold friend list
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate(); // Hook for navigation

  // Function to return a color based on index
  const getColorForIndex = (index) => {
    const colors = ['#FCA5A5', '#A5B4FC', '#FCD34D', '#F0ABFC']; // All the color
    return colors[index % colors.length]; // Cycle through colors based on index
  };

  // Fetch the friend's list for the logged-in user
  const fetchFriends = async () => {
    try {
      const storedUser = sessionStorage.getItem('user'); // Retrieve user from session storage
      if (storedUser) {
        const user = JSON.parse(storedUser); // Parse user data
        const friendIds = await fetchFriendsByUserId(user.id); // Fetch friends using the service

        // Fetch details for each friend
        const friendDetailsPromises = friendIds.map(friend => fetchFriendDetails(friend.friendId));
        const friendDetails = await Promise.all(friendDetailsPromises); // Await all promises
        setFriends(friendDetails); // Set friend data in state
      }
    } catch (error) {
      console.error("Error fetching friends:", error); // Log any errors
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  useEffect(() => {
    fetchFriends(); // Fetch friends when the component mounts
  }, []);

  if (loading) return <div className="text-white">Loading...</div>; // Show loading message

  return (
    <div className="hidden 970px:flex flex-col h-full 970px:w-48 1150px:w-60 bg-white text-black p-6 border-gray-200 border-l-2 border-r-2">
      <h2 className="text-2xl font-lexend ml-4 mt-4 pb-4 text-left">Friends</h2>
      <div className="flex-grow overflow-y-auto post-textarea-grey">
        <div className="grid grid-cols-1 gap-3 w-full pr-2">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={friend.id} // Ensure this uses the correct property from fetched user data
                className="flex flex-col items-center bg-emerald-50 border-2 p-3 border-emerald-200 rounded-lg w-full h-40"
              >
                {/* Color circle for friend's avatar based on index */}
                <div 
                  className="h-16 w-12 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2" 
                  style={{ backgroundColor: getColorForIndex(index) }} // Circle color based on index
                >
                  <span className="text-black text-l font-bold">
                    {friend.username.charAt(0).toUpperCase()} {/* First letter of username */}
                  </span>
                </div>
                <p className="text-pretty font-general font-medium leading-tight">{friend.username}</p>
                <p className="text-xs text-gray-400 font-clash leading-tight">@{friend.username}</p>
                <button
                  onClick={() => navigate(`/profile/${friend.id}`)} // Navigate to profile
                  className="mt-3 w-24 py-1 font-general bg-emerald-300 text-sm text-black rounded-lg hover:bg-emerald-500 hover:text-white transition duration-200 1150px:w-36 1150px:text-base"
                >
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center pt-5">No friends found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;