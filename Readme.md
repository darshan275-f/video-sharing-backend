# VTube - Video Sharing Backend 

VTube is a backend  for a video-sharing platform with additional social features, similar to Twitter. It allows users to upload, manage, and interact with videos while also enabling microblogging through short posts, likes, and comments.

## 🚀 Features
- **User Authentication** (Signup, Login, JWT-based Authorization)
- **Video Management** (Upload, Delete, Fetch, Update)
- **Playlist Management** (Create, Add, Remove, Retrieve Videos)
- **Like System** (Like and Unlike Videos)
- **Subscriptions** (Subscribe/Unsubscribe to Channels)
- **Comments** (Add, Fetch, Delete Comments on Videos)
- **Optimized Queries** using MongoDB Aggregation Pipelines
- **Pagination Support** for Efficient Data Retrieval
- **Twitter-like Functionality** (Users can post videos, comment, like, and interact with content)

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT-based authentication
- **File Uploads:** Cloudinary API

## 📖 API Documentation
- **Postman API Collection:** [[Link to Postman Collection](https://documenter.getpostman.com/view/42751716/2sB2cPjkTs)]
- **Mongoose Model Documentation:** [Link to Model Docs](https://app.eraser.io/workspace/Jm5NloMMruQJudgHNSmB)

## 🏗️ Setup Instructions

### 1️⃣ Clone the Repository
```
git clone https://github.com/darshan275-f/video-sharing-backend.git
cd vtube-backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the root directory and add:
```ini
PORT=8000
MONGODB_URL=your_mongodb_connection_string
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY="1d"
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY="10d"
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
```

### 4️⃣ Run the Server
```sh
npm start
```
Server will start at `http://localhost:8000`

## 🔥 Optimization Techniques Used
- **Aggregation Pipelines** for efficient data retrieval
- **Indexing in MongoDB** for faster queries
- **Pagination** to handle large datasets
- **Efficient File Uploads** using Cloudinary



## 🚀 Future Enhancements
- Implement **Live Streaming** support
- AI-powered **video recommendations**
- **Advanced Search** with filtering options

---
### 💡 Developed by Darshan Jomaling Patil
Feel free to contribute, fork, and give feedback! 🚀

