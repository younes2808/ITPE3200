import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const UsernameDisplay = ({ userId, fetchUsername }) => {
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const getUsername = async () => {
      const name = await fetchUsername(userId);
      setUsername(name);
    };
    getUsername();
  }, [userId, fetchUsername]);

  return <span className='font-extralight text-sm text-slate-200'>{username}</span>;
};

const Comments = ({ postId }) => {
  const navigate = useNavigate();
  const commentsEndRef = useRef(null); // Ref for scrolling to the end of the comments list.
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [usernames, setUsernames] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);

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

  // Function to fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5249/api/Comment/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]); // Include postId as a dependency

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // Include fetchComments in the dependency array

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const storedUser = sessionStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId) {
      console.error("User ID not found in session storage.");
      return;
    }

    if (editingCommentId) {
      const commentUpdatePayload = {
        commentId: editingCommentId,
        userId: parseInt(userId, 10),
        text: newComment,
      };

      try {
        const response = await fetch(`http://localhost:5249/api/Comment/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentUpdatePayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update comment:', errorData);
          setError('Failed to update comment: ' + (errorData.comment || 'Unknown error'));
          return;
        }

        // Update comment in the same place without affecting order
        setComments((prevComments) =>
          prevComments.map(comment =>
            comment.id === editingCommentId ? { ...comment, text: newComment } : comment
          )
        );
        setNewComment('');
        setEditingCommentId(null);

        alert("Comment updated successfully!");
      } catch (err) {
        console.error('Error while updating comment:', err);
        setError('Error while updating comment: ' + err.message);
      }
    } else {
      const commentPayload = {
        text: newComment,
        userId: parseInt(userId, 10),
        postId: parseInt(postId, 10),
        createdAt: new Date().toISOString(),
      };

      try {
        const response = await fetch(`http://localhost:5249/api/Comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to post comment:', errorData);
          setError('Failed to post comment: ' + (errorData.comment || 'Unknown error'));
          return;
        }

        const savedComment = await response.json();
        // Refresh comments list after adding a new comment
        await fetchComments();

        // Optionally, add the saved comment to the comments state
        setComments((prevComments) => [...prevComments, savedComment]);
        setNewComment('');

        // Automatically scroll to the bottom of the comments list
        setTimeout(() => {
          commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);

        alert("Comment made successfully!");
      } catch (err) {
        console.error('Error while posting comment:', err);
        setError('Error while posting comment: ' + err.message);
      }
    }
  };

  const handleDelete = async (commentId) => {
    const storedUser = sessionStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    if (!userId) {
      console.error("User ID not found in session storage.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5249/api/Comment/${commentId}?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete comment:', errorData);
        setError('Failed to delete comment: ' + (errorData.comment || 'Unknown error'));
        return;
      }

      // Remove the deleted comment from the state
      setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
      alert("Comment deleted successfully!");

    } catch (err) {
      console.error('Error while deleting comment:', err);
      setError('Error while deleting comment: ' + err.message);
    }
  };

  const handleEdit = (comment) => {
    setNewComment(comment.text); // Prepopulate the textarea with the selected comment's text
    setEditingCommentId(comment.id); // Set the comment ID being edited
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-20 bg-gray-800 p-4 rounded-lg w-4/4">
      <button 
        className='text-yellow-200 hover:text-slate-100 hover:font-extralight' 
        onClick={() => navigate("/feed")}
      >
        Go back to feed
      </button>
      <h1 className="text-white text-xl mb-4">Comments for Post {postId}</h1>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 rounded-lg"
          rows="3"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">
          {editingCommentId ? 'Update Comment' : 'Submit Comment'}
        </button>
      </form>

      {comments.length === 0 ? (
        <p className="text-gray-400">No comments yet.</p>
      ) : (
        <ul className="max-h-64 overflow-y-auto border border-gray-600 p-2 rounded-lg bg-gray-700">
          {comments
            .filter(comment => comment.id) // Filter out any comments without an id
            .map((comment) => (
              <li key={`comment-${comment.id}`} className="p-3 rounded-lg mb-2 text-white">
                <UsernameDisplay userId={comment.userId} fetchUsername={fetchUsername} />
                <p className='font-light font-mono text-slate-400'>
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
                <p>{comment.text}</p>
                {parseInt(comment.userId, 10) === parseInt(JSON.parse(sessionStorage.getItem('user')).id, 10) && (
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className="bg-yellow-500 text-white p-1 rounded"
                      onClick={() => handleEdit(comment)}
                    >
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 text-white p-1 rounded"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          <div ref={commentsEndRef} /> {/* Ref for scrolling to the bottom */}
        </ul>
      )}
    </div>
  );
};

export default Comments;
