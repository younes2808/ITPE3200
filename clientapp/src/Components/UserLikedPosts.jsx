import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// API calls
import { fetchLikedPostsByUserId, fetchPostDetailsById, toggleLike } from './../Services/likedpostService';
import { fetchLikesByPostId, deletePostById, updatePost } from './../Services/postService';
import { fetchUsernameById } from './../Services/userService';

// Initialize Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl; // Remove default icon URL
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UserLikedPosts = ({ userId }) => {
  const [likedPosts, setLikedPosts] = useState([]); // State for liked posts IDs
  const [postsDetails, setPostsDetails] = useState([]); // State for post details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [likes, setLikes] = useState({}); // State for likes per post
  const [editErrorMessage, setEditErrorMessage] = useState(''); // Error message for editing
  const [usernames, setUsernames] = useState({}); // State for usernames
  const [editingPostId, setEditingPostId] = useState(null); // State for editing post ID
  const [postText, setPostText] = useState(''); // State for post text
  const navigate = useNavigate(); // Navigation hook

  // Fetch liked posts on mount
  useEffect(() => {
    const fetchLikedPosts = async () => {
      setLoading(true);
      try {
        const postIds = await fetchLikedPostsByUserId(userId);
        setLikedPosts(postIds);
      } catch (err) {
        console.error('Error fetching liked posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [userId]);

  // Fetch post details based on liked posts
  useEffect(() => {
    const fetchPostsDetails = async () => {
      if (likedPosts.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const details = await Promise.all(likedPosts.map(postId => fetchPostDetailsById(postId)));
        setPostsDetails(details);

        const likesData = {};
        for (const post of details) {
          const likesInfo = await fetchLikesByPostId(post.id);
          likesData[post.id] = likesInfo;
        }
        setLikes(likesData);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsDetails();
  }, [likedPosts]);

  // Toggle like on a post
  const toggleLikeHandler = async (postId) => {
    const userData = sessionStorage.getItem('user');
    const loggedInUser = JSON.parse(userData);
    const userId = loggedInUser?.id;

    if (!userId) {
      console.error('User not logged in');
      return;
    }

    const alreadyLiked = likes[postId]?.find(like => like.userId === userId);

    try {
      await toggleLike(userId, postId, alreadyLiked);
      setLikes(prevLikes => {
        const updatedLikes = { ...prevLikes };
        if (alreadyLiked) {
          updatedLikes[postId] = updatedLikes[postId].filter(like => like.userId !== userId);
        } else {
          updatedLikes[postId] = [...(updatedLikes[postId] || []), { userId, likedAt: new Date() }];
        }
        return updatedLikes;
      });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  // Delete a post
  const deletePostHandler = async (postId) => {
    try {
      await deletePostById(postId);
      setPostsDetails(postsDetails.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Edit a post
  const editPostHandler = async () => {
  if (!editingPostId || !loggedInUserId) return;

  // Check if postText is empty
  if (postText.trim() === '') {
    setEditErrorMessage('Post content cannot be empty.'); // Set error message
    return;
  }

  try {
    await updatePost(editingPostId, postText, loggedInUserId);
    setEditingPostId(null);
    setPostText('');
    setEditErrorMessage(''); // Clear error message on successful update
    alert('Post updated successfully');
    window.location.reload();
  } catch (error) {
    console.error('Error updating post:', error);
  }
  };
  

  // Fetch username by user ID
  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId];
    }
    try {
      const userData = await fetchUsernameById(userId);
      setUsernames(prevUsernames => ({
        ...prevUsernames,
        [userId]: userData.username,
      }));
      return userData.username;
    } catch (err) {
      return 'Unknown User';
    }
  };

  // Render loading state
  if (loading) {
    return <p className="text-white">Loading liked posts...</p>;
  }

  // Render error state
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Render no liked posts state
  if (postsDetails.length === 0) {
    return <p className="text-gray-400 h-full">This user hasn't liked any posts yet.</p>;
  }

  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
  const loggedInUserId = loggedInUser?.id;

  return (
    <div className="mt-auto mb-4 flex-grow-0 space-y-6 items-start">
      {editErrorMessage && (
        <div className="bg-red-200 text-red-600 p-4 rounded-lg">
          {editErrorMessage}
        </div>
      )}
      {/*Mapping every post from endpoint based on state*/}
      {postsDetails.map(post => (
        <div key={post.id} className="bg-emerald-200 p-3.5 rounded-lg shadow-md">
          {/*Fetching username based on userID and making it clickable*/}
          <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} navigate={navigate} />
          <h2 className="font-clash pb-2 font-normal text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </h2>
          {/*Conditionally rendered content/edit post-area*/}
          {editingPostId === post.id ? (
            <textarea
              maxLength={1000}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="post-textarea w-full bg-white text-black font-lexend rounded-lg resize-none h-full"
            />
          ) : (
            <h2 className="text-gray-800 mb-1.5 break-words font-lexend font-normal">{post.content}</h2>
          )}
          {/*Conditionally rendered clickable URL*/}
          {post.videoUrl && (
            <a
              href={post.videoUrl.startsWith('http') ? post.videoUrl : `http://${post.videoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex"
            >
              {post.videoUrl}
            </a>
          )}
          {/*Conditionally rendered Map Component*/}
          {post.location && (
            <div className="my-4">
              <MapComponent location={post.location} />
            </div>
          )}
          {/*Conditionally rendered image*/}
          {post.imagePath && (
            <img
              src={`http://localhost:5249/${post.imagePath}`}
              alt="Post"
              className="mt-2 h-50% w-full rounded-lg"
            />
          )}

          <span className="text-red-500 font-light">
            {likes[post.id]?.length || 0} ♡
          </span>
          {/*Like button show status based on if user has liked the post*/}
          <div className="flex justify-between mt-2 space-x-4">
            <button onClick={() => toggleLikeHandler(post.id)} className="text-blue-500 hover:underline text-xs 400px:text-base">
              {likes[post.id]?.find(like => like.userId === loggedInUserId) ? 'Liked' : 'Like'}
            </button>
            {/*Conditionally rendered edit/delete buttons*/}
            {post.userId === loggedInUserId && editingPostId !== post.id && (
              <>
                <button
                  onClick={() => {
                    setEditingPostId(post.id);
                    setPostText(post.content);
                  }}
                  className="text-yellow-500 hover:underline text-xs 400px:text-base"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePostHandler(post.id)}
                  className="text-red-500 hover:underline text-xs 400px:text-base"
                >
                  Delete
                </button>
              </>
            )}
            {/*Conditionally rendered save on edit button*/}
            {editingPostId === post.id && (
              <button onClick={editPostHandler} className="text-green-500 hover:underline text-xs 400px:text-base">
                Save
              </button>
            )}
            {/*Button to navigate to comment page of post*/}
            <button onClick={() => navigate(`/comments/${post.id}`)} className="text-blue-500 hover:underline text-xs 400px:text-base">
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// UsernameDisplay component
const UsernameDisplay = ({ userId, fetchUsername, navigate }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsernameById(userId);
      setUsername(name);
    };
    getUsername();
  }, [userId, fetchUsername]);

  return (
    <div className="flex items-center space-x-2">
      <button
        className="font-general text-2xl font-medium text-black hover:underline"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        {username}
      </button>
    </div>
  );
};

// Map component and location parsing
const MapComponent = ({ location }) => {
  const coordinates = parseLocation(location);
  if (!coordinates) return null;

  return (
    <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={5} style={{ height: '200px', width: '100%', zIndex: '0' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>Lat: {coordinates.lat}, Lng: {coordinates.lng}</Popup>
      </Marker>
    </MapContainer>
  );
};

// Parse location string to extract coordinates
const parseLocation = (location) => {
  const match = location.match(/Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/);
  return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null;
};

export default UserLikedPosts;