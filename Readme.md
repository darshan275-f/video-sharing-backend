# VTube Backend - Video Sharing Platfornm 

## Overview
VTube Backend is a **Node.js and Express.js** application that provides RESTful APIs for a video streaming platform. It includes features like **video management, subscriptions, comments, and user authentication**. The backend is optimized using **MongoDB aggregation pipelines and pagination** for efficient data retrieval.

## Features
- **User Authentication** (Login, Signup, JWT-based authorization)
- **Video Management** (Upload, Delete, Fetch, Update)
- **Subscriptions** (Subscribe/Unsubscribe to channels)
- **Comments** (Add, Fetch comments on videos)
- **Optimized Queries** using MongoDB Aggregation Pipelines
- **Pagination Support** for efficient data retrieval


## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **Cloudinary** (for video and image storage)
- **JWT (JSON Web Tokens)** (for authentication)
- **Multer** (for handling file uploads)
- **Postman** (API testing & documentation)

---
## Documentation
- **Postman API Collection**: [[View Here](https://documenter.getpostman.com/view/42751716/2sB2cPjkTs)]
- **Database Models & Schema**: [[[View Here](https://app.eraser.io/workspace/Jm5NloMMruQJudgHNSmB?origin=share)]]
---


---
## Installation

### Prerequisites
- Install **Node.js** and **MongoDB**

### Steps to Run
```bash
# Clone the repository
[git clone https://github.com/darshan275-f/video-sharing-backend.git

# Navigate into the project directory
cd vtube-backend

# Install dependencies
npm install

# Set up environment variables (.env file)
PORT=8000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.omcb8.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY="1d"
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY="10d"

CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Start the server
npm start
```
By default, the server runs on `http://localhost:8000`


## Optimizations 🚀
### 1️⃣ MongoDB Aggregation Pipelines
- Used for **efficient data retrieval** by reducing unnecessary queries.
- Example: Fetching video details with **owner information** and **comments** in a single query.
```js
const videos = await Video.aggregate([
  { $match: { isPublished: true } },
  { $lookup: {
      from: 'users',
      localField: 'owner',
      foreignField: '_id',
      as: 'ownerDetails'
  }},
  { $unwind: '$ownerDetails' },
  { $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'video',
      as: 'comments'
  }}
]);
```

### 2️⃣ Pagination using `mongoose-aggregate-paginate-v2`
- Ensures fast **data loading** by **limiting records per request**.
```js
const options = { page: 1, limit: 10 };
const paginatedVideos = await Video.aggregatePaginate(aggregation, options);
```

---


---

## Contributing
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit changes and push to GitHub
4. Open a Pull Request (PR)

---



