import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import { LoginImg } from "./../Utils/utils.js";
import { loginUser } from './../Services/userService'; // Import the login function


const HomePage = () => {
  // State variables to hold username, password, and any error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // For navigation after login

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    try {
      const response = await loginUser(username, password); // Use the new service function
      console.log(response.status);
      
      if (response.status === 401) {
        const errorText = await response.text();
        console.error("Login failed:", errorText);
  
        if (errorText.trim() === "Invalid password.") {
          setError("The password you entered is incorrect.");
        } else if (errorText.trim() === "No such username") {
          setError("The username you entered does not exist.");
        } else {
          setError("Unauthorized access. Please check your credentials.");
        }
      } else if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("user", JSON.stringify(data));
        console.log("Login successful!", data);
        navigate("/feed"); // Redirect to the feed page after successful login
      } else {
        setError("An unknown error occurred. Please try again.");
      }
  
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="Login-Bakgrunn">
      <div className="Landing-page-box">
        <div
          className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
        >
          <div className="flex flex-col justify-center p-8 md:p-14">
            <span className="mb-3 text-5xl font-mono">RAYS</span>
            <span className="font-light text-zinc-500 mb-8 border-b-black border-b-2">
              Welcome Back! Please enter your details:
            </span>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="py-3">
                <span className="mb-2 text-md">Username</span>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-200 rounded-md placeholder:font-light placeholder:text-gray-500"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Set state
                  required
                />
              </div>
              <div className="py-4">
                <span className="mb-2 text-md">Password</span>
                <input
                  type="password" // Change type to password for security
                  className="w-full p-2 border border-gray-200 rounded-md placeholder:font-light placeholder:text-gray-500"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Set state
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-400"
              >
                Sign in
              </button>
            </form>

            <Link to="/register" className="font-bold text-gray-600 hover:text-gray-300">
              Sign up for free
            </Link>
          </div>
          <div className="relative">
            <img
              src={LoginImg}
              alt="Login-page bilde"
              className="w-[550px] h-full hidden rounded-r-2xl blur-sm md:block object-cover"
            />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
