const BASE_URL = 'http://localhost:5249/api';
//fetching liked posts by userID
export const fetchLikedPostsByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/Post/likedby/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch liked posts');
  }
  return await response.json();
};
//Fetching Post Object By ID
export const fetchPostDetailsById = async (postId) => {
  const response = await fetch(`${BASE_URL}/Post/${postId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post with ID: ${postId}`);
  }
  return await response.json();
};
//toggling like based on USERID POSTID and ISLIKED
export const toggleLike = async (userId, postId, isLiked) => {
  const method = isLiked ? 'DELETE' : 'POST';
  const response = await fetch(`${BASE_URL}/Like`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, postId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} post`);
  }
};

