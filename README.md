# RAYS - A Social Media Application
# ITPE3200 Project Assignment
Table of Contents
Project Overview
Technologies Used
Features
Setup and Installation
Folder Structure
API Documentation
Future Enhancements
Contributors
Project Overview
RAYS is a social media application developed as a part of the ITPE3200 course project. The primary focus of the application is to allow users to create, post, and share different types of media including notes, images, and YouTube video links.

While the initial version of the project is scoped to handle basic posting functionality, future iterations may include features like friend requests and direct messaging, which are currently outside the scope of this project.

Technologies Used
Frontend: React (JavaScript)
Backend: .NET (C#)
Styling: TailwindCSS
Database: SQL Server
API Integration: RESTful APIs
Features
1. Post Creation:
Users can create posts containing text notes.
Upload and share images.
Embed YouTube video links.
2. View Posts:
Browse through a feed of posts created by other users.
Posts can include a combination of text, images, and videos.
3. User Profile (Basic):
View and manage user profiles.
See personal and shared posts.
4. Authentication:
Basic user authentication with login and sign-up functionality.
5. Responsive Design:
The app is responsive and optimized for both desktop and mobile views using TailwindCSS.
Setup and Installation
Prerequisites
To run the project locally, you will need to have the following installed:

Node.js
.NET Core SDK
SQL Server
Backend Setup
Clone the repository:

bash
Kopier kode
git clone https://github.com/yourusername/RAYS.git
cd RAYS/backend
Set up the SQL Server database. Create a new database and update the connection string in the appsettings.json file:

json
Kopier kode
"ConnectionStrings": {
  "DefaultConnection": "Server=your_server_name;Database=RAYS;Trusted_Connection=True;"
}
Run database migrations:

bash
Kopier kode
dotnet ef database update
Run the .NET API server:

bash
Kopier kode
dotnet run
Frontend Setup
Navigate to the frontend folder:

bash
Kopier kode
cd ../frontend
Install dependencies:

bash
Kopier kode
npm install
Start the React development server:

bash
Kopier kode
npm start
Access the application on http://localhost:3000.

Folder Structure
php
Kopier kode
RAYS/
│
├── backend/                # .NET API
│   ├── Controllers/        # API Controllers
│   ├── Models/             # Data Models
│   ├── Migrations/         # Database Migrations
│   └── appsettings.json    # Database configuration
│
├── frontend/               # React Application
│   ├── public/             # Public files
│   ├── src/                # Source code
│   │   ├── components/     # React Components
│   │   ├── pages/          # Pages for different routes
│   │   ├── styles/         # TailwindCSS styles
│   │   └── App.js          # Main React file
│   └── tailwind.config.js  # Tailwind configuration
│
└── README.md               # Project documentation
API Documentation
Base URL:
http://localhost:5000/api

Endpoints:
Posts
GET /posts: Retrieve a list of all posts.
POST /posts: Create a new post (text, image, or video link).
GET /posts/{id}: Retrieve a specific post by ID.
DELETE /posts/{id}: Delete a specific post.
Users
POST /auth/register: Register a new user.
POST /auth/login: Authenticate an existing user.
Future Enhancements
Although the current scope of the project is focused on basic social media functionalities, future improvements could include:

Friend Requests: Users will be able to send and accept friend requests.
Direct Messaging: Real-time messaging between users.
Likes & Comments: Enable engagement on posts through likes and comments.
User Notifications: Notify users of new posts, messages, and friend requests.
Post Reactions: Add emojis and other forms of interaction on posts.
Contributors
Project Lead: [Your Name]
Backend Developer: [Team Member 1]
Frontend Developer: [Team Member 2]
UI/UX Designer: [Team Member 3]
Feel free to contribute by forking the repository and submitting pull requests!

Thank you for checking out RAYS! Enjoy building, posting, and sharing. 🌟
