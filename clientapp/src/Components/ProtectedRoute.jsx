import React, { useEffect, useState } from "react"; // Import React and necessary hooks
import { Navigate } from "react-router-dom"; // Import Navigate for redirecting

const ProtectedRoute = ({ children }) => {
  // State variables to manage authentication status, loading state, and error messages
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the stored user data from sessionStorage
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      // Parse the stored user data
      const parsedUser = JSON.parse(storedUser);
      
      // Fetch user data from the API to validate the session
      fetch(`http://localhost:5249/api/User/${parsedUser.id}`)
        .then(response => {
          // Check if the response is ok (status code in the range 200-299)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // Parse the response as JSON
        })
        .then(data => {
          // Validate if the fetched data matches the stored user's ID
          if (data && data.id === parsedUser.id) {
            setIsAuthenticated(true); // User is authenticated
          } else {
            setIsAuthenticated(false); // User is not authenticated
          }
        })
        .catch(err => {
          setError(err.message); // Set error message if the fetch fails
          setIsAuthenticated(false); // User is not authenticated
        })
        .finally(() => setLoading(false)); // Set loading to false regardless of the fetch outcome
    } else {
      // If no user is stored, set loading to false and mark user as not authenticated
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // Show loading indicator while fetching authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if an error occurred during fetch
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If the user is not authenticated, redirect to the home page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content if the user is authenticated
  return children;
};

export default ProtectedRoute; // Export the component for use in other parts of the application

