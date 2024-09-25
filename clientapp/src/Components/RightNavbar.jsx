import React from 'react';

const RightNavbar = () => {
  return (
    <div className="fixed right-0 top-0 w-1/5 h-screen bg-gray-900 text-white p-6 flex flex-col items-start space-y-8"> {/* Endret til fixed */}
      <h2 className="text-2xl font-bold">Friends</h2>
      <nav className="flex flex-col space-y-4">
        <a href="#" className="flex items-center space-x-4">
          <span className="material-icons text-xl">person</span>
          <span className="text-xl">Friend 1</span>
        </a>
        {/* Legg til flere venners navn her */}
      </nav>
    </div>
  );
};

export default RightNavbar;
