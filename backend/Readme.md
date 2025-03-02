# Community Collaboration Platform - Backend 🚀

This is the backend for a community collaboration platform built using the MERN stack. It enables real-time chat, group collaboration, file sharing, and video calls.

## 📌 Features
✅ User Authentication (JWT)  
✅ Real-Time Messaging (Socket.io)  
✅ Group Chat & Collaboration  
✅ File Sharing in Chats (Images, Videos, Documents up to 10MB)  
✅ Video Call Feature (WebRTC & Socket.io)  
✅ MongoDB Database with Mongoose  

## 📂 Project Structure
```
backend/
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Chat.js
│   ├── Message.js
│   ├── Group.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── projects.js
│   ├── chats.js
│   ├── messages.js
│   ├── groups.js
├── config/
│   ├── db.js
├── middleware/
│   ├── authMiddleware.js
│   ├── uploadMiddleware.js
├── uploads/  (For storing uploaded files)
├── server.js
├── .env
├── package.json
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-username/community-collab-backend.git
cd community-collab-backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```ini
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Start the Server
```sh
npm start
```
The server will run at `http://localhost:5000`.

## 🛠 API Endpoints

### 🔐 Authentication
| Method | Endpoint              | Description           |
|--------|----------------------|-----------------------|
| POST   | `/api/auth/register` | Register a new user  |
| POST   | `/api/auth/login`    | Login and get a token |

### 💬 Chat & Messaging
| Method | Endpoint              | Description                     |
|--------|----------------------|---------------------------------|
| POST   | `/api/chats/`        | Create a new chat              |
| GET    | `/api/chats/`        | Get all user chats             |
| POST   | `/api/messages/`     | Send a message (text/file)     |
| GET    | `/api/messages/:chatId` | Get messages for a chat  |

### 👥 Group Chat
| Method | Endpoint                  | Description               |
|--------|--------------------------|---------------------------|
| POST   | `/api/groups/`           | Create a new group        |
| GET    | `/api/groups/`           | Get all groups            |
| POST   | `/api/groups/:groupId/join` | Join a group         |
| POST   | `/api/groups/:groupId/message` | Send a message in a group |

### 📁 File Sharing
| Method | Endpoint         | Description                            |
|--------|-----------------|----------------------------------------|
| POST   | `/api/messages/` | Send a file (Images, Videos, Docs up to 10MB) |

### 🎥 Video Call (Socket.io)
- **Join a Video Room:** Emit `join-room` with `roomId` and `userId`  
- **Handle User Connection:** Listen for `user-connected` and `user-disconnected`

### ⚡ WebSocket Events
| Event             | Description                          |
|------------------|----------------------------------|
| `sendMessage`    | Broadcasts a message to users     |
| `receiveMessage` | Listens for incoming messages    |
| `join-room`      | Connects a user to a video call room |
| `user-connected` | Notifies when a user joins a room |
| `user-disconnected` | Notifies when a user leaves a room |

## 🛠 Deployment

### 1️⃣ Deploy on Render/Heroku
- Host the backend on **Render** or **Heroku**.
- Use **MongoDB Atlas** for the database.

### 2️⃣ Connect Frontend
- Use the provided API endpoints.
- WebSocket for real-time messaging.

## 📌 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Real-Time:** Socket.io, WebRTC
- **File Uploads:** Multer



