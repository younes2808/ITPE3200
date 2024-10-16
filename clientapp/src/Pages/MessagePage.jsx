import React from "react";
import LeftNavbar from "../Components/LeftNavbar"; // Juster importbanen etter behov
import RightNavbar from "../Components/RightNavbar"; // Juster importbanen etter behov
import Messages from "../Components/Messages"; // Juster importbanen etter behov

const MessagePage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <LeftNavbar />
      <Messages />
      <RightNavbar />
    </div>
  );
};

export default MessagePage;
