import React from "react";
import { LoginImg } from "./../Utils/utils.js"
const HomePage = () => {
  return (
    <body className="Login-Bakgrunn">
    <div className="Landing-page-box">
      <div
        className="relative flex flex-col m-6 space-y-8
      bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0
      "
      >
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-mono">RAYS</span>
          <span className="font-light text-zinc-500 mb-8 border-b-black border-b-2">
            Welcome Back! Please enter your details:
          </span>

          <div className="py-3">
            <span className="mb-2 text-md">Username</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-md
            placeholder:font-light placeholder:text-gray-500"
              name="username"
              id="username"
            ></input>
          </div>
          <div className="py-4">
            <span className="mb-2 text-md">Password</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-md
            placeholder:font-light placeholder:text-gray-500"
              name="password"
              id="password"
            ></input>
          </div>
          <button className="w-full bg-black text-white p-2
          rounded-lg mb-6 hover:bg-white hover:text-black hover:border
          hover:border-gray-400">
          Sign in
          </button>
          <div className="text-center text-gray-500">
            Don't have an account?
            <span className="font-bold text-black hover:text-gray-300"> Sign up for free</span>
          </div>
        </div>
        <div className="relative">
          <img src={ LoginImg } alt="Login-page bilde"
          className="w-[550px] h-full hidden rounded-r-2xl md:block object-cover"/>
          {/*Tekst over bilde*/}
          <div className="absolute hidden bottom-10 right-6
          p-6 bg-white bg-opacity-25 backdrop-blur-sm rounded
          drop-shadow-lg md:block">
            <span className="text-white text-xl">
              Velkommen
            </span>
          </div>
        </div>
      </div>
    </div>
    </body>
  );
};

export default HomePage;
