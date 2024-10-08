import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserPost from '../Components/UserPost';
import UserLikedPosts from '../Components/UserLikedPosts'; // Import the new UserLikedPosts component
import ShowFriends from '../Components/ShowFriends'; // Import the ShowFriends component
import LeftNavbar from '../Components/LeftNavbar';
import RightNavbar from '../Components/RightNavbar';

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL
  const navigate = useNavigate(); // For navigation

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('example@example.com');
  const [activeTab, setActiveTab] = useState('posts');
  const [friendshipStatus, setFriendshipStatus] = useState('none'); // To handle friendship status
  const [currentUserId, setCurrentUserId] = useState(null);
  const [randomColor, setRandomColor] = useState('#000000');

  // Function to generate a random color
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  };

  useEffect(() => {
    setRandomColor(generateRandomColor());

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/User/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        setUsername(userData.username);
        setEmail(userData.email || 'example@example.com');
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchFriendshipStatus = async () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.id);

        // Fetch friend requests involving the current user
        const requestsResponse = await fetch(`http://localhost:5249/api/Friend/requests/${user.id}`);
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          
          // Check if there are received requests from the userId
          const receivedRequest = requests.find(request => request.senderId === parseInt(userId) && !request.isSender);
          const sentRequest = requests.find(request => request.receiverId === parseInt(userId) && request.isSender);

          // Fetch current user friendships
          const friendsResponse = await fetch(`http://localhost:5249/api/Friend/${user.id}`);
          if (friendsResponse.ok) {
            const friends = await friendsResponse.json();
            const friendExists = friends.some(friend => friend.friendId === parseInt(userId));

            if (friendExists) {
              setFriendshipStatus('friend'); // Users are friends
            } else if (sentRequest) {
              setFriendshipStatus('pending-sent'); // Request sent to userId
            } else if (receivedRequest) {
              setFriendshipStatus('pending-received'); // Request received from userId
            } else {
              setFriendshipStatus('none'); // No friend request sent or received
            }
          } else {
            console.error('Failed to fetch friends:', friendsResponse.status);
          }
        } else {
          console.error('Failed to fetch requests:', requestsResponse.status);
        }
      }
    };

    fetchUserDetails();
    fetchFriendshipStatus();
  }, [userId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDeleteFriend = async () => {
    try {
      const response = await fetch(`http://localhost:5249/api/Friend/${currentUserId}/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFriendshipStatus('none'); // Update state to reflect friend removal
        window.location.reload(); // Refresh to get the updated state
      } else {
        console.error('Failed to delete friend');
      }
    } catch (error) {
      console.error('Error deleting friend:', error);
    }
  };

  const handleAddFriend = async () => {
    try {
      const response = await fetch('http://localhost:5249/api/Friend/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId: currentUserId, receiverId: userId }), // Send friend request
      });

      if (response.ok) {
        setFriendshipStatus('pending-sent'); // Update the state to reflect the new friendship
      } else {
        console.error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    // Handle accepting the friend request
    try {
      const response = await fetch(`http://localhost:5249/api/Friend/request/${userId}`, {
        method: 'PUT', // Assuming you have an endpoint to accept requests
      });

      if (response.ok) {
        setFriendshipStatus('friend'); // Update status to friends
      } else {
        console.error('Failed to accept friend request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleSendMessage = () => {
    navigate(`/message/${currentUserId}/${userId}`);// Redirect to message page with the userId
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftNavbar />
      <div className="w-full bg-gray-900 p-6 overflow-y-auto">
        <div className="w-fit ml-32 md:w-[58vw] md:ml-auto h-screen max-w-5xl bg-gray-700 p-6 mx-auto overflow-x-auto scrollbar-none rounded-lg">
          <div
            className="relative w-full h-40 sm:h-48 flex items-center justify-center rounded-md"
            style={{ backgroundColor: randomColor }}
          >
            <h1 className="text-4xl font-bold text-white mx-auto">
              {username.charAt(0).toUpperCase()}
            </h1>
          </div>

          <div className="text-center mt-6">
            <h1 className="text-lg sm:text-2xl font-semibold mt-2 text-white">@{username}</h1>
            <a href={`mailto:${email}`} className="text-blue-400 hover:text-white">{email}</a>

            {/* Display buttons only if it's not the user's own profile */}
            {currentUserId !== parseInt(userId) && (
              <div className="mt-4 space-y-2">
                {friendshipStatus === 'friend' ? (
                  <button 
                    onClick={handleDeleteFriend} 
                    className="bg-red-500 mr-1 text-white px-3 py-1 rounded hover:bg-red-400 transition duration-200"
                  >
                    Delete Friend
                  </button>
                ) : friendshipStatus === 'pending-sent' ? (
                  <button 
                    className="bg-gray-500 mr-1 text-white px-3 py-1 rounded"
                  >
                    Request Sent
                  </button>
                ) : friendshipStatus === 'pending-received' ? (
                  <button 
                    onClick={handleAcceptFriendRequest}
                    className="bg-green-500 mr-1 text-white px-3 py-1 rounded hover:bg-green-400 transition duration-200"
                  >
                    Accept Friend Request
                  </button>
                ) : (
                  <button 
                    onClick={handleAddFriend} 
                    className="bg-green-500 mr-1 text-white px-3 py-1 rounded hover:bg-green-400 transition duration-200"
                  >
                    Add Friend
                  </button>
                )}
                <button 
                  onClick={handleSendMessage} 
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400 transition duration-200"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              className={`${activeTab === 'posts' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`}
              onClick={() => handleTabClick('posts')}
            >
              Posts
            </button>
            <button
              className={`${activeTab === 'likes' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`}
              onClick={() => handleTabClick('likes')}
            >
              Likes
            </button>
            <button
              className={`${activeTab === 'friends' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'}`}
              onClick={() => handleTabClick('friends')}
            >
              Friends
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'posts' && <UserPost userId={userId} />}
            {activeTab === 'likes' && <UserLikedPosts userId={userId} />}
            {activeTab === 'friends' && <ShowFriends userId={userId} />}
          </div>
        </div>
      </div>
      <RightNavbar />
    </div>
  );
};

export default Profile;
