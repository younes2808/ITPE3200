import React, { useState, useEffect } from 'react'; // Import React and hooks
import { useNavigate } from 'react-router-dom'; // Import navigate for routing
// API calls
import { fetchFriendsByUserId } from './../Services/friendService'; // Fetch friend IDs
import { fetchFriendDetails } from './../Services/userService'; // Fetch friend details

const ShowFriends = ({ userId }) => {
  const [friendDetails, setFriendDetails] = useState([]); // State for storing friend details
  const [loading, setLoading] = useState(true); // State for loading status
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendIds = await fetchFriendsByUserId(userId); // Get friend IDs
        const details = await fetchFriendDetails(friendIds); // Fetch details for each friend
        setFriendDetails(details); // Update state with friend details
      } catch (error) {
        console.error('Error fetching friends:', error); // Log any errors
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchFriends(); // Call the fetch function
  }, [userId]); // Dependency array to refetch if userId changes

  const handleFriendClick = (friendId) => {
    navigate(`/profile/${friendId}`); // Navigate to the friend's profile on click
  };

  if (loading) {
    return <div className="text-black h-full">Loading friends...</div>; // Loading state
  }

  if (friendDetails.length === 0) {
    return <div className="text-black h-full">No friends found.</div>; // No friends message
  }

  return (
    <div className="text-white h-full">
      <h2 className="text-2xl text-black">Friends</h2>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/*Mapping all friends from API*/}
        {friendDetails.map(friend => (
          <div key={friend.id} className="p-2 mr-0 bg-white rounded-md">
            <button 
             //Sending you to friend-page based on FriendID
              onClick={() => handleFriendClick(friend.id)} 
              className="text-blue-400 hover:underline"
            >
              {friend.username} {/* Display the friend's username */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowFriends; // Export the component for use in other parts of the application

