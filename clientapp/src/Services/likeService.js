const API_URL = 'http://localhost:5249/api/Like';

//function for liking post
export const likePost = async (userId, postId) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, postId }),
  });

  if (!response.ok) {
    throw new Error('Failed to like the post');
  }

  return response.json();
};

//Function for unliking post
export const unlikePost = async (userId, postId) => {
  const response = await fetch(API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, postId }),
  });

  if (!response.ok) {
    throw new Error('Failed to unlike the post');
  }

  return response.json(); 
};
