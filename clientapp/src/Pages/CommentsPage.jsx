import { useParams } from 'react-router-dom';
import RightNavbar from '../Components/RightNavbar';
import LeftNavbar from '../Components/LeftNavbar';
import Comments from '../Components/Comments';

const CommentsPage = () => {
  const { postId } = useParams(); // Get postId from URL parameters

  return (
    <div className="bg-gray-100 flex h-screen">
      {/* Left Navbar */}
      <LeftNavbar />
      
      {/* Comments */}
      <div className="w-full bg-gray-100 p-6 flex justify-center items-center">
        <Comments postId={postId} /> {/* Pass postId as a prop */}
      </div>

      {/* Right Navbar */}
      <RightNavbar />
    </div>
  );
};

export default CommentsPage;
