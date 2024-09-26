import React from 'react';

const RightNavbar = () => {
  return (
    <div className="fixed right-0 top-0 w-1/6 h-screen bg-gray-900 text-white p-6 flex flex-col">
      <h2 className="text-2xl font-bold">Friends</h2>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-300"> {/* Tailwind scrollbar klasser */}
        <div className="grid grid-cols-1 gap-3 w-full">

          {/* Friend 1 */}
          <div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40">
            <div className="h-16 w-14 bg-pink-500 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2">A</div>
            <p className="text-pretty font-semibold leading-tight">Rafey</p>
            <p className="text-xs text-gray-400 leading-tight">@Sixty</p>
            <button className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200">View Profile</button>
          </div>

          {/* Friend 2 */}
          <div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40">
            <div className="h-16 w-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2">F</div>
            <p className="text-pretty font-semibold leading-tight">Ali</p>
            <p className="text-xs text-gray-400 leading-tight">@Ali</p>
            <button className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200">View Profile</button>
          </div>

          {/* Friend 3 */}
          <div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40">
            <div className="h-16 w-14 bg-green-500 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2">J</div>
            <p className="text-pretty font-semibold leading-tight">Jojo</p>
            <p className="text-xs text-gray-400 leading-tight">@Rainbow</p>
            <button className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200">View Profile</button>
          </div>

          {/* Friend 4 */}
          <div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40">
            <div className="h-16 w-14 bg-gray-500 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2">A</div>
            <p className="text-pretty font-semibold leading-tight">Shoeb</p>
            <p className="text-xs text-gray-400 leading-tight">@GaysRcool</p>
            <button className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200">View Profile</button>
          </div>

          {/* Friend 5 */}
          <div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40">
            <div className="h-16 w-14 bg-blue-400 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2">D</div>
            <p className="text-pretty font-semibold leading-tight">Beetlejuice</p>
            <p className="text-xs text-gray-400 leading-tight">@BEET</p>
            <button className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200">View Profile</button>
          </div>

          {/* Friend 6 */}
          <div className="flex flex-col items-center bg-gray-800 p-3 rounded-lg w-full h-40">
            <div className="h-16 w-14 bg-yellow-500 rounded-full flex items-center justify-center text-white text-pretty font-bold mb-2">H</div>
            <p className="text-pretty font-semibold leading-tight">Diddy</p>
            <p className="text-xs text-gray-400 leading-tight">@BABYOIL</p>
            <button className="mt-3 w-24 py-1 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-500 transition duration-200">View Profile</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RightNavbar;
