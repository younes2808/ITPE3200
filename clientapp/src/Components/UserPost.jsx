import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';

// Initialize Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UserPost = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL parameters

  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [postText, setPostText] = useState(''); // Handle editing post content

  const userid = sessionStorage.getItem('user'); // Assuming userId is stored in session storage
  const id = JSON.parse(userid);
  const loggedInUserId = id.id;
  // Fetch posts when the component mounts or userId changes
  useEffect(() => {
    const fetchPosts = async () => {  
    // Get logged-in user ID from session storage
    
      setLoading(true); // Start loading
      try {
        const response = await fetch(`http://localhost:5249/api/Post/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);

        // Fetch likes for each post
        const likesData = {};
        for (const post of data) {
          const likesResponse = await fetch(`http://localhost:5249/api/Like/${post.id}`);
          const likesInfo = await likesResponse.json();
          likesData[post.id] = likesInfo;
        }
        setLikes(likesData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]); // Trigger on userId change

  // Fetch username for a specific userId (on demand)
  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId]; // Return cached username if it exists
    }

    try {
      const response = await fetch(`http://localhost:5249/api/User/${userId}`); // API that fetches user data by ID
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      const userData = await response.json();
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: userData.username, // Cache the username
      }));
      return userData.username;
    } catch (err) {
      console.error('Error fetching username:', err);
      return 'Unknown User'; // Fallback if there's an error
    }
  };

  // Toggle like/unlike
  const toggleLike = async (postId) => {
    const alreadyLiked = likes[postId]?.find(like => like.userId === loggedInUserId);

    try {
      if (alreadyLiked) {
        // Unlike the post
        await fetch('http://localhost:5249/api/Like', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: loggedInUserId, postId }),
        });

        // Update state to remove like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: prevLikes[postId].filter(like => like.userId !== loggedInUserId),
        }));
      } else {
        // Like the post
        await fetch('http://localhost:5249/api/Like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: loggedInUserId, postId }),
        });

        // Update state to add like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: [...prevLikes[postId], { userId: loggedInUserId, likedAt: new Date() }],
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  // Handle post deletion
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5249/api/Post/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      // Remove the post from state
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Handle edit submission
  const editPostHandler = async () => {
    if (!editingPostId || !loggedInUserId) return;

    const formData = new FormData();
    formData.append('Content', postText);
    formData.append('UserId', loggedInUserId);

    try {
      const response = await fetch(`http://localhost:5249/api/Post/${editingPostId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      // Reset the editing state and reload posts
      setEditingPostId(null);
      setPostText('');
      alert('Post updated successfully');
      window.location.reload(); // Refresh to show updated post
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
      <div className="mt-auto mb-4 flex-grow-0 space-y-6 items-start">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-600 p-3.5 rounded-lg shadow-md">
              <UsernameDisplay userId={post.userId} className="text-white" fetchUsername={fetchUsername} navigate={navigate} />
    
              <h2 className="font-medium font-mono text-slate-400">
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
    
              {editingPostId === post.id ? (
                <textarea
                  maxLength={1000}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="post-textarea w-full bg-gray-500 text-white rounded-lg resize-none h-full"
                />
              ) : (
                <h2 className="text-white mb-1.5 break-words font-serif">{post.content}</h2>
              )}
    
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
    
              {/* Only render the MapComponent if location exists */}
              {post.location && (
                <div className="my-4">
                  <MapComponent location={post.location} />
                </div>
              )}
    
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
    
              <div className="flex justify-between mt-2 space-x-4">
                <button onClick={() => toggleLike(post.id)} className="text-blue-500 hover:underline text-xs 400px:text-base">
                  {likes[post.id]?.find(like => like.userId === loggedInUserId) ? 'Liked' : 'Like'}
                </button>

                {/* Only show Edit and Delete buttons if the post belongs to the logged-in user */}
                {post.userId === loggedInUserId && editingPostId !== post.id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setPostText(post.content); // Populate the textarea with the existing content
                      }}
                      className="text-yellow-500 hover:underline text-xs 400px:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 hover:underline text-xs 400px:text-base"
                    >
                      Delete
                    </button>
                  </>
                )}

                {/* Confirm edit submission */}
                {editingPostId === post.id && (
                  <button onClick={editPostHandler} className="text-green-500 hover:underline text-xs 400px:text-base">
                    Save
                  </button>
                )}
                {/* Comment button */}
                <button onClick={() => navigate(`/comments/${post.id}`)} className="text-blue-500 hover:underline text-xs 400px:text-base">
                  Comment
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">No posts available.</div>
        )}
      </div>
    );
    
};

// UsernameDisplay component
const UsernameDisplay = ({ userId, fetchUsername, navigate }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId);
      setUsername(name);
    };
    getUsername();
  }, [userId, fetchUsername]);

  return (
    <div className="flex items-center space-x-2">
      <button
        className="text-white hover:underline"
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

const parseLocation = (location) => {
  const match = location.match(/Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/);
  return match ? { lat: parseFloat(match[1]), lng: parseFloat(match[2]) } : null;
};

export default UserPost;
