import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RightNavbar = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to return color based on index
  const getColorForIndex = (index) => {
    const colors = ['#FFFF00', '#FF0000', '#0000FF', '#800080']; // Yellow, Red, Blue, Purple
    return colors[index % colors.length]; // Cycle through colors based on index
  };

  // Fetch friends list for the current user
  const fetchFriends = async () => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const response = await fetch(`http://localhost:5249/api/Friend/${user.id}`); // Adjust endpoint as necessary
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const friendIds = await response.json();
        
        // Now fetch details for each friend
        const friendDetailsPromises = friendIds.map(async (friend) => {
          const userResponse = await fetch(`http://localhost:5249/api/User/${friend.friendId}`); // Assuming you have an endpoint to fetch user details
          if (userResponse.ok) {
            return userResponse.json();
          } else {
            throw new Error(`Failed to fetch user with ID: ${friend.friendId}`);
          }
        });

        const friendDetails = await Promise.all(friendDetailsPromises);
        setFriends(friendDetails); // Set friends details in state
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends(); // Fetch friends on component mount
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="fixed right-0 top-0 w-full 970px:w-36 lg:w-1/6 h-screen bg-gray-900 text-white p-6 flex-col hidden 970px:flex">
      <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">Friends</h2>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
        <div className="grid grid-cols-1 gap-3 w-full">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={friend.id} // Ensure this uses the correct property from the fetched user details
                className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40"
              >
                {/* Color circle for the friend's avatar based on index */}
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center mb-2" 
                  style={{ backgroundColor: getColorForIndex(index) }} // Color for the circle based on index
                >
                  <span className="text-white text-l font-bold">
                    {friend.username.charAt(0).toUpperCase()} {/* First letter of username */}
                  </span>
                </div>
                <p className="text-pretty font-semibold leading-tight">{friend.username}</p>
                <p className="text-xs text-gray-400 leading-tight">@{friend.username}</p>
                <button
                  onClick={() => navigate(`/profile/${friend.id}`)} // Navigate to profile
                  className="mt-3 lg:w-24 970px:w-20 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200"
                >
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No friends found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
