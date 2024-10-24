import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state to prevent flickering
  const [error, setError] = useState(null); // For handling errors

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Fetch user data from the API to confirm authentication
      fetch(`/api/User/${parsedUser.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then(data => {
          // If the user is valid, set authenticated to true
          if (data && data.id === parsedUser.id) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false); // User is not valid
          }
        })
        .catch(err => {
          setError(err.message);
          setIsAuthenticated(false); // In case of an error, treat as not authenticated
        })
        .finally(() => setLoading(false)); // End loading after fetch is complete
    } else {
      setLoading(false);
      setIsAuthenticated(false); // If no user is stored, mark as not authenticated
    }
  }, []);

  if (loading) return <div>Loading...</div>; // Optional: Show loading while checking authentication

  if (error) return <div>Error: {error}</div>; // Display error if something goes wrong

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirect to home if not authenticated
  }

  return children; // Render protected content if authenticated
};

export default ProtectedRoute;
