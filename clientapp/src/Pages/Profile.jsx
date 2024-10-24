import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserPost from './../Components/UserPost';
import UserLikedPosts from './../Components/UserLikedPosts';
import ShowFriends from './../Components/ShowFriends';
import LeftNavbar from './../Components/LeftNavbar';
import RightNavbar from './../Components/RightNavbar';
import TopBar from './../Components/TopBar';
import BottomNavbar from './../Components/BottomNavbar';

const Profile = () => {
  const scrollRef = useRef(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [friendshipStatus, setFriendshipStatus] = useState('none');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [randomColor, setRandomColor] = useState('#000000');

  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  useEffect(() => {
    setRandomColor(generateRandomColor());

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5249/api/User/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

        const requestsResponse = await fetch(`http://localhost:5249/api/Friend/requests/${user.id}`);
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          const receivedRequest = requests.find(request => request.senderId === parseInt(userId) && !request.isSender);
          const sentRequest = requests.find(request => request.receiverId === parseInt(userId) && request.isSender);

          const friendsResponse = await fetch(`http://localhost:5249/api/Friend/${user.id}`);
          if (friendsResponse.ok) {
            const friends = await friendsResponse.json();
            const friendExists = friends.some(friend => friend.friendId === parseInt(userId));

            if (friendExists) {
              setFriendshipStatus('friend');
            } else if (sentRequest) {
              setFriendshipStatus('pending-sent');
            } else if (receivedRequest) {
              setFriendshipStatus('pending-received');
            } else {
              setFriendshipStatus('none');
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
        setFriendshipStatus('none');
        window.location.reload();
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
        body: JSON.stringify({ senderId: currentUserId, receiverId: userId }),
      });

      if (response.ok) {
        setFriendshipStatus('pending-sent');
      } else {
        console.error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      const requestsResponse = await fetch(`http://localhost:5249/api/Friend/requests/${currentUserId}`);
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        const receivedRequest = requests.find(request => request.senderId === parseInt(userId) && !request.isSender);

        if (receivedRequest) {
          const requestId = receivedRequest.id;
          const response = await fetch(`http://localhost:5249/api/Friend/accept/${requestId}`, {
            method: 'PUT',
          });

          if (response.ok) {
            setFriendshipStatus('friend');
            window.location.reload();
          } else {
            console.error('Failed to accept friend request');
          }
        } else {
          console.error('No pending friend request found to accept.');
        }
      } else {
        console.error('Failed to fetch friend requests');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleSendMessage = () => {
    navigate(`/message/${userId}/${currentUserId}`);
  };

  return (
    <div className="bg-gray-100 border flex h-screen flex-col overflow-y-auto">
      <TopBar scrollContainer={scrollRef}/>
      <div className="flex w-full max-w-[1200px] mx-auto bg-gray-100 border h-full">
        {/* Left Navbar */}
        <div className="flex-none z-10 510px:mr-16 md:mr-52 "> {/* Set a width for the left navbar */}
          <LeftNavbar />
        </div>

        {/* Main content area */}
        <div ref={scrollRef} className="flex-grow bg-gray-700 300px:pt-24 510px:pt-8 p-6 overflow-y-auto h-full mb- rounded-lg">
          <div className="relative w-full z-0 h-40 sm:h-48 flex items-center justify-center rounded-md" style={{ backgroundColor: randomColor }}>
            <h1 className="text-4xl font-bold text-white mx-auto">
              {username.charAt(0).toUpperCase()}
            </h1>
          </div>

          <div className="text-center mt-6">
            <h1 className="text-lg sm:text-2xl font-semibold mt-2 text-white">@{username}</h1>
            <a href={`mailto:${email}`} className="text-blue-400 hover:text-white">{email}</a>

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
                  <button className="bg-gray-500 mr-1 text-white px-3 py-1 rounded">
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
              className={`${
                activeTab === 'posts' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'
              } px-4 py-2 transition duration-150`}
              onClick={() => handleTabClick('posts')}
            >
              Posts
            </button>
            <button
              className={`${
                activeTab === 'likes' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'
              } px-4 py-2 transition duration-150`}
              onClick={() => handleTabClick('likes')}
            >
              Likes
            </button>
            <button
              className={`${
                activeTab === 'friends' ? 'text-blue-500 font-bold' : 'text-gray-100 hover:text-white hover:bg-gray-400 rounded'
              } px-4 py-2 transition duration-150`}
              onClick={() => handleTabClick('friends')}
            >
              Friends
            </button>
          </div>

          <div className="mt-6 mb-12">
            {activeTab === 'posts' && <UserPost userId={userId} />}
            {activeTab === 'likes' && <UserLikedPosts userId={userId} />}
            {activeTab === 'friends' && <ShowFriends userId={userId} />}
          </div>
        </div>

        {/* Right Navbar */}
        <div className="flex-none "> {/* Set a width for the right navbar */}
          <RightNavbar />
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Profile;
