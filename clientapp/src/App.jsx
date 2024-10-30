import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Feed from './Pages/Feed';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import CommentsPage from './Pages/CommentsPage'; 
import ConversationPage from "./Pages/ConversationPage"; 
import MessagePage from "./Pages/MessagePage"; 
import FriendRequests from './Pages/FriendRequestsPage';
import './Styles/Rays.css';
import Search from './Pages/Search';
import ProtectedRoute from './Components/ProtectedRoute'; // Import the updated ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<HomePage />} />

        {/* Protected Routes */}
        {/*Protected is a measure to stop people from accessing the page without being logged in*/}
        {/*They will not be able to page/feed without being logged in first */}
        <Route
          path='/feed'
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comments/:postId"
          element={
            <ProtectedRoute>
              <CommentsPage />
            </ProtectedRoute>
          }
        />
        <Route path='/register' element={<Register />} />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conversation/:userId"
          element={
            <ProtectedRoute>
              <ConversationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message/:receiverId/:senderId"
          element={
            <ProtectedRoute>
              <MessagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friend-requests"
          element={
            <ProtectedRoute>
              <FriendRequests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
