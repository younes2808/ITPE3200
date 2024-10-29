import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginImg } from "./../Utils/utils.js"; // Assuming you have a relevant image
import { registerUser } from "../Services/userService"; // Import registerUser function

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState(""); // For client-side validation errors

  const navigate = useNavigate(); // For navigation after registration

  // Email format validation
  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Reset errors
    setValidationError("");
    setError("");

    // Client-side validation
    if (!email || !isValidEmail(email)) {
      setValidationError("Invalid email format.");
      return;
    }
    if (!username || username.length < 3) {
      setValidationError("Username must be at least 3 characters long.");
      return;
    }
    if (!password || password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    // Proceed with API call after client-side validation passes
    try {
      const result = await registerUser(email, username, password); // Use the service function
      console.log("Registration successful!", result);
      navigate("/"); // Redirect to HomePage or another page after successful registration
    } catch (err) {
      if (err.message === "409") {
        setError("Username or email already exists.");
      } else {
        setError("Registration failed. Please check your details.");
      }
      console.error("Error during registration:", err);
    }
  };

  return (
    <body className="Login-Bakgrunn">
      <div className="Landing-page-box">
        <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
          <div className="flex flex-col justify-center p-8 md:p-14">
            <span className="mb-3 text-4xl font-mono">RAYS</span>
            <span className="font-light text-zinc-500 mb-8 border-b-black border-b-2">
              Create Your Account:
            </span>

            {/* Display client-side validation errors */}
            {validationError && <div className="text-red-500 mb-4">{validationError}</div>}

            {/* Display server-side error */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="py-3">
                <span className="mb-2 text-md">Email</span>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-200 rounded-md placeholder:font-light placeholder:text-gray-500"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Set state
                  required
                />
              </div>
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
              <button className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-400">
                Sign up
              </button>
            </form>
            <Link to="/" className="font-bold text-black hover:text-gray-300">
              Sign in here
            </Link>
          </div>
          <div className="relative">
            <img src={LoginImg} alt="Register-page bilde" className="w-[550px] h-full hidden rounded-r-2xl blur-sm md:block object-cover" />
          </div>
        </div>
      </div>
    </body>
  );
};

export default Register;

