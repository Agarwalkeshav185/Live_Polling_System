# 🎓 Live Polling System

A real-time interactive polling application that enables teachers to create polls, ask questions, and receive instant feedback from students. Built with React, Node.js, Socket.IO, and MongoDB.

## ✨ Features

### For Teachers
- 📊 Create polls with unique poll codes
- ❓ Ask multiple-choice questions with customizable time limits
- 📈 View live results as students submit answers
- 💬 Real-time chat with students
- 👥 Manage participants (remove students if needed)
- 📜 View complete poll history and analytics

### For Students
- 🔐 Join polls using unique poll codes
- ⏱️ Answer timed multiple-choice questions
- 📊 View results immediately after submission
- 💬 Chat with teacher and classmates
- 🔄 Real-time updates for all activities

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - WebSocket server for real-time features
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB installed locally or MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Agarwalkeshav185/Live_Polling_System.git
cd Live_Polling_System
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/polling-system >> .env
echo NODE_ENV=development >> .env
echo CORS_ORIGIN=http://localhost:3000 >> .env
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install

# Create .env file
echo VITE_API_URL=http://localhost:5000/api > .env
echo VITE_SOCKET_URL=http://localhost:5000 >> .env
```

### Running Locally

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

3. **Start Frontend Dev Server**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

4. **Open your browser** and navigate to `http://localhost:3000`

## 📁 Project Structure

```
Live_Polling_System/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route page components
│   │   ├── store/          # Redux store and slices
│   │   ├── lib/            # Utility functions (socket)
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── package.json
│
├── backend/                 # Node.js backend server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── socket/             # Socket.IO event handlers
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md               # This file
```

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the **Root Directory** to `frontend`
   - Add environment variables:
     - `VITE_API_URL` = your backend API URL
     - `VITE_SOCKET_URL` = your backend Socket.IO URL
   - Click **Deploy**

### Backend Deployment (Render/Railway)

#### Option 1: Render
1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `PORT` = 5000
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `NODE_ENV` = production
   - `CORS_ORIGIN` = your Vercel frontend URL
6. Deploy

#### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub repo
3. Set **Root Directory** to `backend`
4. Add environment variables (same as above)
5. Deploy

### Database (MongoDB Atlas)
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist all IP addresses (0.0.0.0/0) for development
4. Get your connection string
5. Update `MONGODB_URI` in backend environment variables

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polling-system
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 📝 API Documentation

### REST Endpoints

#### Polls
- `POST /api/polls/create` - Create a new poll
- `GET /api/polls/:pollCode` - Get poll details
- `GET /api/polls/:pollCode/results` - Get poll results
- `GET /api/polls/:pollCode/chat` - Get chat history

### Socket.IO Events

#### Client → Server
- `teacher:join` - Teacher joins poll
- `student:join` - Student joins poll
- `question:ask` - Teacher asks question
- `answer:submit` - Student submits answer
- `student:remove` - Teacher removes student
- `chat:message` - Send chat message

#### Server → Client
- `poll:data` - Poll data updates
- `question:new` - New question broadcast
- `results:update` - Live results update
- `student:joined` - Student joined notification
- `student:left` - Student disconnected
- `student:kicked` - Student removed
- `chat:message` - New chat message
- `error` - Error notifications

## 🎯 Usage Guide

### For Teachers
1. Select "I'm a Teacher" on the home page
2. Enter your name and click "Create Poll"
3. You'll receive a unique poll code to share with students
4. Click "Ask Question" to create a new question
5. Enter question text, options, correct answer, and time limit
6. View live results as students answer
7. Use chat to communicate with students
8. View poll history after session ends

### For Students
1. Select "I'm a Student" on the home page
2. Enter your name and the poll code shared by teacher
3. Click "Join Poll"
4. Wait for the teacher to ask questions
5. Select your answer before time runs out
6. View results after submission
7. Use chat to ask questions or discuss

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Keshav Agarwal**
- GitHub: [@Agarwalkeshav185](https://github.com/Agarwalkeshav185)

---

**Note**: Make sure to update environment variables with your production URLs before deploying!

For issues or questions, please open an issue on GitHub.
