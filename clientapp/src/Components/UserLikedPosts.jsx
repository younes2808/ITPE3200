import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const UserLikedPosts = ({ userId }) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [postsDetails, setPostsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState({});
  const [usernames, setUsernames] = useState({});
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [postText, setPostText] = useState(''); // Handle editing post content
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5249/api/Post/likedby/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch liked posts');
        }
        const postIds = await response.json();
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

  useEffect(() => {
    const fetchPostsDetails = async () => {
      if (likedPosts.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const postsDetailsPromises = likedPosts.map(async (postId) => {
          const response = await fetch(`http://localhost:5249/api/Post/${postId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch post with ID: ${postId}`);
          }
          return await response.json();
        });

        const details = await Promise.all(postsDetailsPromises);
        setPostsDetails(details);

        // Fetch likes for each post
        const likesData = {};
        for (const post of details) {
          const likesResponse = await fetch(`http://localhost:5249/api/Like/${post.id}`);
          const likesInfo = await likesResponse.json();
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

  const toggleLike = async (postId) => {
    // Retrieve the logged-in user's ID from sessionStorage
    const userData = sessionStorage.getItem('user');
    const loggedInUser = JSON.parse(userData);
    const userId = loggedInUser?.id; // Make sure to handle cases where user data might not exist
  
    if (!userId) {
      console.error('User not logged in');
      return;
    }
  
    const alreadyLiked = likes[postId]?.find(like => like.userId === userId);
  
    try {
      if (alreadyLiked) {
        // If already liked, send a DELETE request to remove the like
        await fetch('http://localhost:5249/api/Like', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, postId }),
        });
  
        // Update state by removing the like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: prevLikes[postId].filter(like => like.userId !== userId),
        }));
      } else {
        // If not liked, send a POST request to add a like
        await fetch('http://localhost:5249/api/Like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, postId }),
        });
  
        // Update state by adding the like
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: [...(prevLikes[postId] || []), { userId, likedAt: new Date() }],
        }));
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };
  

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5249/api/Post/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPostsDetails(postsDetails.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const editPostHandler = async () => {
    if (!editingPostId || !loggedInUserId) return;
  
    const formData = new FormData();
    formData.append('Content', postText);
    formData.append('UserId', userId);
  
    try {
      const response = await fetch(`http://localhost:5249/api/Post/${editingPostId}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
  
      // Update the post in the state
      setPostsDetails((prevPosts) =>
        prevPosts.map((post) => 
          post.id === editingPostId ? { ...post, content: postText } : post
        )
      );
  
      setEditingPostId(null);
      setPostText('');
      alert('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  
  const fetchUsername = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId];
    }

    try {
      const response = await fetch(`http://localhost:5249/api/User/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch username');
      }
      const userData = await response.json();
      setUsernames((prevUsernames) => ({
        ...prevUsernames,
        [userId]: userData.username,
      }));
      return userData.username;
    } catch (err) {
      console.error('Error fetching username:', err);
      return 'Unknown User';
    }
  };

  if (loading) {
    return <p className="text-white">Loading liked posts...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (postsDetails.length === 0) {
    return <p className="text-gray-400 h-full">This user hasn't liked any posts yet.</p>;
  }

  const userid = sessionStorage.getItem('user');
  const id = JSON.parse(userid);
  const loggedInUserId = id.id;

  
  return (
    <div className="mt-auto mb-4 flex-grow-0 space-y-6 items-start">
      {postsDetails.length > 0 ? (
        postsDetails.map((post) => (
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
  
              {/* Show Edit button only if not editing */}
              {/* Show Edit button only if not editing */}
              {post.userId === loggedInUserId && editingPostId !== post.id && (
                  <button
                    onClick={() => {
                      setEditingPostId(post.id);
                      setPostText(post.content); // Populate the textarea with the existing content
                    }}
                    className="text-yellow-500 hover:underline text-xs 400px:text-base "
                  >
                    Edit
                  </button>
                )}
  
              {/* Delete button should always be visible if the user is the post creator */}
              {post.userId === loggedInUserId && (
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 hover:underline text-xs 400px:text-base"
                >
                  Delete
                </button>
              )}
  
              {/* Confirm edit submission */}
              {editingPostId === post.id && (
                <button
                  onClick={editPostHandler}
                  className="text-green-500 hover:underline text-xs 400px:text-base"
                >
                  Save
                </button>
              )}
              {/* Comment button */}
              <button onClick={() => navigate(`/comments/${post.id}`)} className="text-blue-500 text-xs hover:underline 400px:text-base">
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
    <div
      className="text-white cursor-pointer hover:underline"
      onClick={() => navigate(`/profile/${userId}`)}
    >
      {username}
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


export default UserLikedPosts;
