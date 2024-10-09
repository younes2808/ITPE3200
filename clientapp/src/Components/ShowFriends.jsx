import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowFriends = ({ userId }) => {
  const [friends, setFriends] = useState([]); // Store friend IDs
  const [friendDetails, setFriendDetails] = useState([]); // Store friend details (including usernames)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/Friend/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const friendIds = await response.json();
        setFriends(friendIds); // Set the list of friend IDs
        await fetchFriendDetails(friendIds); // Fetch details for each friend
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFriendDetails = async (friendIds) => {
      const details = await Promise.all(
        friendIds.map(async (friend) => {
          const response = await fetch(`http://localhost:5249/api/User/${friend.friendId}`); // Adjust this endpoint accordingly
          if (!response.ok) {
            console.error(`Failed to fetch details for friendId ${friend.friendId}`);
            return null;
          }
          return response.json(); // Assume it returns user data with username
        })
      );
      setFriendDetails(details.filter(detail => detail !== null)); // Filter out null responses
    };

    fetchFriends();
  }, [userId]);

  const handleFriendClick = (friendId) => {
    navigate(`/profile/${friendId}`); // Navigate to the friend's profile
  };

  if (loading) {
    return <div className="text-white">Loading friends...</div>;
  }

  if (friendDetails.length === 0) {
    return <div className="text-white">No friends found.</div>; // Display message if no friends
  }

  return (
    <div className="text-white">
      <h2 className="text-2xl">Friends</h2>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {friendDetails.map(friend => (
          <div key={friend.id} className="p-2 mr-0 bg-gray-600 rounded-md">
            <button 
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

export default ShowFriends;
