import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchComments as fetchCommentsFromService,
  createComment as createCommentService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
} from './../Services/commentService';
import { fetchUsernameById } from './../Services/userService';

// Component for displaying a username
const UsernameDisplay = ({ userId, fetchUsername, onClick }) => {
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId); // Fetch username based on userId
      setUsername(name); // Update state with fetched username
    };
    getUsername(); // Call the function to get username
  }, [userId, fetchUsername]);

  return (
    <span 
      className='text-2xl font-general font-medium text-black hover:text-gray-500 hover:underline transition-all duration-200 ease-in-out'
      onClick={onClick} // Handle username click
    >
      {username} {/*Display the username */}  
    </span>
  );
};

// Main Comments component
const Comments = ({ postId }) => {
  const navigate = useNavigate(); // Hook for navigation
  const commentsEndRef = useRef(null); // Ref for scrolling to the end of the comments list
  const [comments, setComments] = useState([]); // State for comments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // State for error messages
  const [newComment, setNewComment] = useState(''); // State for the new comment input
  const [usernames, setUsernames] = useState({}); // State for storing fetched usernames
  const [editingCommentId, setEditingCommentId] = useState(null); // State for tracking comment being edited

  // Fetch username by ID and cache results
  const fetchUsernameFromService = async (userId) => {
    if (usernames[userId]) {
      return usernames[userId]; // Return cached username if available
    }

    const name = await fetchUsernameById(userId); // Fetch username from service
    setUsernames((prevUsernames) => ({ 
      ...prevUsernames, 
      [userId]: name, // Cache the fetched username
    }));
    return name; // Return the fetched username
  };

  // Function to fetch comments for the post
  const fetchComments = useCallback(async () => {
    setLoading(true); // Set loading state
    try {
      const data = await fetchCommentsFromService(postId); // Fetch comments from service
      setComments(data); // Update comments state
    } catch (err) {
      setError(err.message); // Set error message if fetch fails
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [postId]); // Dependency on postId

  useEffect(() => {
    fetchComments(); // Fetch comments on component mount
  }, [fetchComments]); // Dependency on fetchComments

  // Handle form submission for comments
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const storedUser = sessionStorage.getItem('user'); // Get user from session storage
    const userId = storedUser ? JSON.parse(storedUser).id : null; // Parse user ID

    if (!userId) {
      console.error("User ID not found in session storage."); // Log if user ID is not found
      return;
    }

    // Handle editing a comment
    if (editingCommentId) {
      const commentUpdatePayload = {
        commentId: editingCommentId,
        userId: parseInt(userId, 10),
        text: newComment, // New comment text
      };

      try {
        await updateCommentService(commentUpdatePayload); // Update comment via service

        // Update the comment in the state without affecting order
        setComments((prevComments) =>
          prevComments.map(comment =>
            comment.id === editingCommentId ? { ...comment, text: newComment } : comment
          )
        );
        setNewComment(''); // Reset new comment input
        setEditingCommentId(null); // Clear editing state

        alert("Comment updated successfully!"); // Alert user of success
      } catch (err) {
        console.error('Error while updating comment:', err);
        setError('Error while updating comment: ' + err.message); // Set error message
      }
    } else {
      // Handle creating a new comment
      const commentPayload = {
        text: newComment,
        userId: parseInt(userId, 10),
        postId: parseInt(postId, 10),
        createdAt: new Date().toISOString(), // Current timestamp
      };

      try {
        const savedComment = await createCommentService(commentPayload); // Create comment via service
        await fetchComments(); // Refresh comments list after adding a new comment

        // Optionally, add the saved comment to the comments state
        setComments((prevComments) => [...prevComments, savedComment]);
        setNewComment(''); // Reset new comment input

        // Automatically scroll to the bottom of the comments list
        setTimeout(() => {
          commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);

        alert("Comment made successfully!"); // Alert user of success
      } catch (err) {
        console.error('Error while posting comment:', err);
        setError('Error while posting comment: ' + err.message); // Set error message
      }
    }
  };

  // Handle comment deletion
  const handleDelete = async (commentId) => {
    const storedUser = sessionStorage.getItem('user'); // Get user from session storage
    const userId = storedUser ? JSON.parse(storedUser).id : null; // Parse user ID

    if (!userId) {
      console.error("User ID not found in session storage."); // Log if user ID is not found
      return;
    }

    try {
      await deleteCommentService(commentId, userId); // Delete comment via service
      // Remove the deleted comment from the state
      setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
      alert("Comment deleted successfully!"); // Alert user of success
    } catch (err) {
      console.error('Error while deleting comment:', err);
      setError('Error while deleting comment: ' + err.message); // Set error message
    }
  };

  // Handle comment editing
  const handleEdit = (comment) => {
    setNewComment(comment.text); // Prepopulate the textarea with the selected comment's text
    setEditingCommentId(comment.id); // Set the comment ID being edited
  };

  // Render loading state
  if (loading) {
    return <div>Loading comments...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the comments section
  return (
    <div className="bg-emerald-200 shadow-lg rounded-lg p-8 h-full flex flex-col">
      {/* Button to navigate back to the feed */}
      <button 
        className='text-gray-800 hover:text-slate-800 hover:font-extralight' 
        onClick={() => navigate("/feed")} // Navigate to the feed on click
      >
        Go back to feed
      </button>

      {/* Header displaying the post ID */}
      <h1 className="text-gray-800 text-xl mb-4">Comments for Post {postId}</h1>

      {/* Form for submitting a new comment or updating an existing one */}
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          value={newComment} // Controlled input for the new comment
          onChange={(e) => setNewComment(e.target.value)} // Update newComment state on change
          placeholder="Add a comment..." // Placeholder text for the textarea
          className="w-full p-2 rounded-lg" // Styling for the textarea
          rows="3" // Number of visible rows in the textarea
          required // Make this field mandatory
        />
        {/* Submit button that changes based on editing state */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          {editingCommentId ? 'Update Comment' : 'Submit Comment'} {/* Conditional text*/}
        </button>
      </form>

      {/* Conditional rendering based on the number of comments */}
      {comments.length === 0 ? (
        <p className="text-gray-800">No comments yet.</p> // Message if no comments are present
      ) : (
        <ul className="h-full overflow-y-auto border border-gray-800 p-2 rounded-lg bg-white">
          {comments
            .filter(comment => comment.id) // Filter out any comments without an id
            .map((comment) => (
              <li key={`comment-${comment.id}`} className="p-3 mb-2 border-b-2 text-white">
                {/* Display the username for the comment's author */}
                <UsernameDisplay 
                  userId={comment.userId} 
                  fetchUsername={fetchUsernameFromService} 
                  onClick={() => navigate(`/profile/${comment.userId}`)} // Navigate to user's profile
                />
                {/* Display the comment's creation date */}
                <p className='font-clash pb-2 font-normal text-sm text-gray-500'>
                  {new Date(comment.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </p>
                {/* Display the comment text */}
                <p className='text-black font-general'>{comment.text}</p>
                {/* Conditional buttons for editing or deleting the comment */}
                {parseInt(comment.userId, 10) === parseInt(JSON.parse(sessionStorage.getItem('user')).id, 10) && (
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-300"
                      onClick={() => handleEdit(comment)} //handle edit action
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-300"
                      onClick={() => handleDelete(comment.id)} //handle delete action
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}

          <div ref={commentsEndRef} /> {/* Ref to allow scrolling to the bottom of the comments list */}
        </ul>
      )}
    </div>
  );
};

export default Comments; // Export the Comments component