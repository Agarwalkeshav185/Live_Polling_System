# Live Polling System - Backend

## Features
- Express.js server with Socket.io for real-time communication
- MongoDB for data persistence
- RESTful API endpoints for poll management
- Real-time events for polling, chat, and student management
- Teacher can create polls, ask questions, and manage students
- Students can join polls, submit answers, and view results
- Chat functionality between teachers and students

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polling-system
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Poll Management
- `POST /api/polls/create` - Create a new poll
- `GET /api/polls/:pollCode` - Get poll details
- `GET /api/polls/teacher/:teacherId` - Get teacher's poll history
- `GET /api/polls/:pollCode/results` - Get poll results
- `GET /api/polls/:pollCode/chat` - Get chat messages

## Socket.io Events

### Teacher Events
- `teacher:join` - Teacher joins poll
- `question:ask` - Ask a new question
- `student:remove` - Remove a student from poll

### Student Events
- `student:join` - Student joins poll
- `answer:submit` - Submit answer to question
- `question:timeout` - Question timer expired

### Chat Events
- `chat:message` - Send/receive chat messages

### Broadcast Events
- `poll:data` - Poll data updates
- `question:new` - New question asked
- `results:update` - Live results update
- `student:joined` - Student joined notification
- `student:left` - Student left notification
- `student:kicked` - Student removed by teacher

## Database Schema

### Poll
- pollCode: String (unique)
- teacherId: String
- questions: Array of Questions
- activeStudents: Array of Students
- isActive: Boolean
- createdAt: Date

### Question
- questionText: String
- options: Array of Strings
- correctAnswer: String
- timeLimit: Number
- answers: Array of Answers
- askedAt: Date
- isActive: Boolean

### Answer
- studentName: String
- studentId: String
- selectedOption: String
- answeredAt: Date

## Deployment

### MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Update `MONGODB_URI` in `.env` with your connection string

### Hosting Options
- **Railway**: Connect GitHub repo and deploy
- **Render**: Connect GitHub repo and add environment variables
- **Heroku**: Use Heroku CLI to deploy

Make sure to update `CORS_ORIGIN` to your frontend URL in production.
