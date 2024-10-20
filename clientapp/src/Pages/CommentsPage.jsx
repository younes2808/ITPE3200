import { useParams } from 'react-router-dom';
import TopBar from './../Components/TopBar';
import RightNavbar from './../Components/RightNavbar';
import LeftNavbar from './../Components/LeftNavbar';
import BottomNavbar from './../Components/BottomNavbar';
import Comments from '../Components/Comments';

const CommentsPage = () => {
  const { postId } = useParams(); // Get postId from URL parameters

  return (
    <div className="bg-orange-500 flex h-screen flex-col overflow-y-auto">
      {/* Top Bar */}
      <TopBar />

      {/* Hovedcontainer */}
        {/* Justert container med dynamisk margin og max-w for å sikre plass til navbarene */}
        <div className="flex w-full max-w-[1300px] mx-auto bg-blue-500 h-full">

          {/* Left Navbar - plasseres på venstre side */}
          <div className="flex-none"> 
            <LeftNavbar />
          </div>

          {/* Post og feed-seksjonen i midten */}
          <div className="flex-grow bg-gray-100 p-6 overflow-y-auto w-full 400px:pl-6 400px:pr-10 510px:pl-24 510px:pr-5 580px:pr-10 md:pl-44 md:pr-16 870px:pl-48 870px:pr-20 970px:pr-16 1150px:pl-64 1150px:pr-14">
            <Comments postId={postId} />
          </div>

          {/* Right Navbar - plasseres på høyre side */}
          <div className="flex-none"> 
            <RightNavbar />
          </div>
        </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default CommentsPage;
