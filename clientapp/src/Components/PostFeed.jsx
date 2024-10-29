import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS for map styling
import L from 'leaflet';
import {
  fetchPostsByUserId,
  fetchLikesByPostId,
  deletePostById,
  likePost,
  unlikePost,
  updatePost,
} from './../Services/postService'; // Import service functions for post operations
import { fetchUsernameById } from './../Services/userService'; // Import function to fetch username by user ID

// Initialize Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PostFeed = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]); // State to store posts
  const [usernames, setUsernames] = useState({}); // Cache for usernames to avoid repeated fetches
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [likes, setLikes] = useState({}); // Cache for likes by post ID
  const [userId, setUserId] = useState(null); // State to store current user's ID
  const [editingPostId, setEditingPostId] = useState(null); // State to manage editing post ID
  const [postText, setPostText] = useState(''); // State for text input during editing

  // Fetch user from sessionStorage when the component mounts
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id); // Set user ID
      loadPosts(parsedUser.id); // Load posts for the user
    }
  }, []);

  // Load posts for a given user ID
  const loadPosts = async (userId) => {
    try {
      const data = await fetchPostsByUserId(userId); // Fetch posts
      setPosts(data); // Set posts in state

      // Fetch likes for each post
      const likesData = {};
      for (const post of data) {
        const likesInfo = await fetchLikesByPostId(post.id); // Fetch likes for each post
        likesData[post.id] = likesInfo; // Store likes in the cache
      }
      setLikes(likesData); // Update likes state
    } catch (err) {
      setError(err.message); // Set error message on failure
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Fetch username for a specific user ID (on demand)
  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId]; // Return cached username if it exists
    }

    try {
      const username = await fetchUsernameById(userId); // Fetch username
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: username, // Cache the username
      }));
      return username;
    } catch (err) {
      console.error('Error fetching username:', err);
      return 'Unknown User'; // Fallback if there's an error
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await deletePostById(postId); // Call service to delete post
      // Remove the post from state
      setPosts(posts.filter(post => post.id !== postId)); // Update posts state
      alert('Post deleted successfully'); // Notify user
    } catch (error) {
      console.error('Error deleting post:', error); // Log error
    }
  };

  // Handle edit submission
  const handleEditPost = async () => {
    if (!editingPostId || !userId) return; // Validate editing state

    try {
      await updatePost(editingPostId, postText, userId); // Call service to update post
      // Reset the editing state and reload posts
      setEditingPostId(null); // Clear editing state
      setPostText(''); // Clear text input
      alert('Post updated successfully'); // Notify user
      loadPosts(userId); // Reload posts
    } catch (error) {
      console.error('Error updating post:', error); // Log error
    }
  };

  // Handle like/unlike action
  const handleLikeToggle = async (postId) => {
    const alreadyLiked = likes[postId]?.find(like => like.userId === userId); // Check if post is already liked
    
    try {
      if (alreadyLiked) {
        await unlikePost(userId, postId); // Call service to unlike post
        // Update state to remove like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: prevLikes[postId].filter(like => like.userId !== userId), // Filter out the like
        }));
      } else {
        await likePost(userId, postId); // Call service to like post
        // Update state to add like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: [...prevLikes[postId], { userId, likedAt: new Date() }], // Add new like
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error); // Log error
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-emerald-200">
        <div className="bg-emerald-200 p-6 rounded-lg shadow-lg">Loading...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-emerald-200">
        <div className="bg-emerald-200 p-6 rounded-lg shadow-lg text-red-500">{error}</div>
      </div>
    );
  }

  // Render posts
  return (
    <div className="pt-4 mt-auto flex-grow-0 space-y-4 items-start">
      {posts.map((post) => (
        <div key={post.id} className="bg-emerald-200 p-3.5 rounded-lg shadow-md">
          <UsernameDisplay userId={post.userId} fetchUsername={fetchUsername} navigate={navigate} /> {/* Display username */}

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

          {editingPostId === post.id ? ( // Show textarea if editing
            <textarea
              maxLength={1000}
              value={postText}
              onChange={(e) => setPostText(e.target.value)} // Update post text
              className="post-textarea w-full p-4 bg-white text-black rounded-lg resize-none h-28"
            />
          ) : (
            <h2 className="text-gray-800 mb-1.5 break-words font-lexend font-normal">{post.content}</h2> // Display post content
          )}

          {post.videoUrl && (
            <a
              href={post.videoUrl.startsWith('http') ? post.videoUrl : `http://${post.videoUrl}`} // Link to video if available
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex"
            >
              {post.videoUrl}
            </a>
          )}

          {post.location && (
            <div className="my-4">
              <MapComponent location={post.location} /> {/* Render map component for location */}
            </div>
          )}

          {post.imagePath && (
            <img src={`http://localhost:5249/${post.imagePath}`} alt="Post" className="mt-2 h-50% w-full rounded-lg" /> 
          )} {/* Display post image */}

          <span className="text-red-500 font-light">
            {likes[post.id]?.length || 0} ♡ {/* Display number of likes */}
          </span>

          <div className="flex justify-between space-x-4">
            <button onClick={() => handleLikeToggle(post.id)} className="text-blue-500 hover:underline">
              {likes[post.id]?.find(like => like.userId === userId) ? 'Liked' : 'Like'} {/* Toggle like button */}
            </button>

            {/* Edit and Delete buttons, only visible for the post's creator */}
            {post.userId === userId && ( // Only show if the user is the post creator
              <>
                {editingPostId === post.id ? ( // If currently editing
                  <button onClick={handleEditPost} className="text-green-500 hover:underline">
                    Save
                  </button>
                ) : (
                  <button onClick={() => {
                    setEditingPostId(post.id); // Set post to edit
                    setPostText(post.content); // Set the post text to be edited
                  }} className="text-yellow-500 hover:underline">
                    Edit
                  </button>
                )}

                <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </>
            )}
            <button onClick={() => navigate(`/comments/${post.id}`)} className="text-blue-500 hover:underline">
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Separate component to handle username display and fetching
const UsernameDisplay = ({ userId, fetchUsername, navigate }) => {
  const [username, setUsername] = useState('Loading...'); // State to store username

  // Fetch username when component mounts
  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId); // Fetch username from service
      setUsername(name); // Update username state
    };
    getUsername();
  }, [userId, fetchUsername]);

  // Navigate to user profile on username click
  const handleUsernameClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <button 
      onClick={handleUsernameClick} 
      className="text-2xl font-general font-medium text-black hover:text-gray-500 hover:underline transition-all duration-200 ease-in-out"
    >
      {username}
    </button>
  );
};

// Map component for displaying location
const MapComponent = ({ location }) => {
  const coordinates = parseLocation(location); // Parse location string to coordinates
  if (!coordinates) return null; // Return null if no valid coordinates

  return (
    <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={5} style={{ height: '200px', width: '100%', zIndex: '0' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>Lat: {coordinates.lat}, Lng: {coordinates.lng}</Popup> {/* Display coordinates in popup */}
      </Marker>
    </MapContainer>
  );
};

// Utility function to parse location string into coordinates
const parseLocation = (location) => {
  const match = location.match(/Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/); // Regex to extract coordinates
  return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null; // Return parsed coordinates or null
};

export default PostFeed; // Export the PostFeed component
