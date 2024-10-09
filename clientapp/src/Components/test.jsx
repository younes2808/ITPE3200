<div className="fixed right-0 top-0 970px:w-36 lg:w-1/6 h-screen bg-gray-900 text-white p-6 flex-col hidden 970px:flex max-w-64 min-w-44">
<h2 className="text-2xl font-bold mb-4 text-center lg:text-left">Friends</h2>
<div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300">
  <div className="grid grid-cols-1 gap-3 w-full">
    {friends.length > 0 ? (
      friends.map((friend, index) => (
        <div
          key={friend.id} // Ensure this uses the correct property from the fetched user details
          className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40"
        >
          {/* Color circle for the friend's avatar based on index */}
          <div 
            className="h-16 w-14 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2" 
            style={{ backgroundColor: getColorForIndex(index) }} // Color for the circle based on index
          >
            <span className="text-white text-l font-bold">
              {friend.username.charAt(0).toUpperCase()} {/* First letter of username */}
            </span>
          </div>
          <p className="text-pretty font-semibold leading-tight">{friend.username}</p>
          <p className="text-xs text-gray-400 leading-tight">@{friend.username}</p>
          <button
            onClick={() => navigate(`/profile/${friend.id}`)} // Navigate to profile
            className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200 1350px:w-36 1350px:text-base"
          >
            View Profile
          </button>
        </div>
      ))
    ) : (
      <div className="text-gray-400 text-center">No friends found</div>
    )}